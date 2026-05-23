output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.backend_alb.dns_name
}

output "frontend_public_ip" {
  description = "Public IP of the frontend EC2 instance"
  value       = aws_instance.frontend.public_ip
}
