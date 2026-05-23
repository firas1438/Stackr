output "db_address" {
  description = "Address of the RDS instance"
  value       = aws_db_instance.postgres.address
}
