module "networking" {
  source       = "./modules/networking"
  project_name = var.project_name
  region       = var.region
}

module "security" {
  source       = "./modules/security"
  project_name = var.project_name
  vpc_id       = module.networking.vpc_id
}

module "database" {
  source             = "./modules/database"
  project_name       = var.project_name
  db_username        = var.db_username
  db_password        = var.db_password
  db_name            = var.db_name
  private_subnet_ids = module.networking.private_subnet_ids
  rds_sg_id          = module.security.rds_sg_id
}

module "compute" {
  source             = "./modules/compute"
  project_name       = var.project_name
  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  private_subnet_ids = module.networking.private_subnet_ids
  alb_sg_id          = module.security.alb_sg_id
  backend_sg_id      = module.security.backend_sg_id
  frontend_sg_id     = module.security.frontend_sg_id
  github_repo        = var.github_repo
  db_address         = module.database.db_address
  db_username        = var.db_username
  db_password        = var.db_password
  db_name            = var.db_name
}
