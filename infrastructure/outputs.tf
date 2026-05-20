output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.networking.vpc_id
}

output "db_address" {
  description = "Database instance address"
  value       = module.database.db_address
}

output "backend_alb_dns" {
  description = "The DNS name of the backend load balancer"
  value       = module.compute.alb_dns_name
}

output "frontend_public_ip" {
  description = "Public IP of the frontend EC2 instance"
  value       = module.compute.frontend_public_ip
}
