# Application Load Balancer
resource "aws_lb" "backend_alb" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.public_subnet_ids

  tags = {
    Name = "${var.project_name}-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "backend_tg" {
  name     = "${var.project_name}-backend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

# Listener
resource "aws_lb_listener" "backend_listener" {
  load_balancer_arn = aws_lb.backend_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}

# AMI Data Source
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Backend Launch Template
resource "aws_launch_template" "backend_lt" {
  name_prefix   = "${var.project_name}-backend-"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = "t2.micro"

  vpc_security_group_ids = [var.backend_sg_id]

  user_data = base64encode(<<-EOF
              #!/bin/bash
              set -e

              # Install dependencies
              apt update -y
              curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
              apt install -y nodejs git

              # Clone and configure environment variables
              cd /home/ubuntu
              git clone ${var.github_repo} app
              cd app/backend
              echo "DATABASE_URL=postgresql://${var.db_username}:${var.db_password}@${var.db_address}:5432/${var.db_name}" >> .env
              echo "PORT=3000" >> .env

              # Build app
              npm install
              npm run prisma:generate
              npm run build

              # Start app
              node dist/src/main.js &
              EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-backend-instance"
    }
  }
}

# Backend Auto Scaling Group
resource "aws_autoscaling_group" "backend_asg" {
  name                = "${var.project_name}-backend-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.backend_tg.arn]
  health_check_type   = "ELB"
  min_size            = 2
  max_size            = 4
  desired_capacity    = 2

  launch_template {
    id      = aws_launch_template.backend_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.project_name}-backend-asg"
    propagate_at_launch = true
  }
}

# Scaling Policy
resource "aws_autoscaling_policy" "cpu_scaling" {
  name                   = "${var.project_name}-cpu-scaling"
  autoscaling_group_name = aws_autoscaling_group.backend_asg.name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 70.0
  }
}

# Frontend EC2 Instance
resource "aws_instance" "frontend" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  subnet_id                   = var.public_subnet_ids[0]
  vpc_security_group_ids      = [var.frontend_sg_id]
  associate_public_ip_address = true
  user_data_replace_on_change = true

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Install dependencies
              apt update -y
              curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
              apt install -y nodejs git nginx

              # Clone and configure
              cd /home/ubuntu
              git clone ${var.github_repo} app
              cd app/frontend
              echo "VITE_API_URL=http://${aws_lb.backend_alb.dns_name}/api/v1" >> .env

              # Build app
              npm install
              npm run build

              # Deploy
              sudo mkdir -p /var/www/html/vite-app
              sudo cp -r dist/* /var/www/html/vite-app/
              sudo chown -R www-data:www-data /var/www/html/vite-app
              sudo chmod -R 755 /var/www/html/vite-app

              # Configure Nginx
              rm -f /etc/nginx/sites-enabled/default
              cat <<EON > /etc/nginx/sites-available/vite-app
              server {
                  listen 80;
                  server_name _;
                  root /var/www/html/vite-app;
                  index index.html;
                  
                  location / {
                      try_files \$uri \$uri/ /index.html;
                  }
              }
              EON
              ln -sf /etc/nginx/sites-available/vite-app /etc/nginx/sites-enabled/
              systemctl restart nginx
              EOF

  tags = {
    Name = "${var.project_name}-frontend"
  }
}
