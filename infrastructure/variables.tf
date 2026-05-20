variable "region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "aws_access_key_id" {
  description = "AWS access key ID"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key"
  type        = string
  sensitive   = true
}

variable "aws_session_token" {
  description = "AWS session token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the project"
  default     = "stackr"
}

variable "db_username" {
  description = "Database administrator username"
  default     = "stackr_admin"
}

variable "db_password" {
  description = "Database administrator password"
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  default     = "stackr_db"
}

variable "github_repo" {
  description = "GitHub repository URL"
  default     = "https://github.com/firas1438/Stackr.git"
}
