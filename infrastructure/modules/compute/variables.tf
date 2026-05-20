variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "alb_sg_id" {
  description = "Security Group ID for ALB"
  type        = string
}

variable "backend_sg_id" {
  description = "Security Group ID for Backend"
  type        = string
}

variable "frontend_sg_id" {
  description = "Security Group ID for Frontend"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository URL for the code"
  type        = string
}

variable "db_address" {
  description = "Database instance address"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  type        = string
}
