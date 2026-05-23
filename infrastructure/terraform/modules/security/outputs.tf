output "alb_sg_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb_sg.id
}

output "backend_sg_id" {
  description = "ID of the Backend EC2 security group"
  value       = aws_security_group.backend_sg.id
}

output "rds_sg_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds_sg.id
}

output "frontend_sg_id" {
  description = "ID of the Frontend EC2 security group"
  value       = aws_security_group.frontend_sg.id
}
