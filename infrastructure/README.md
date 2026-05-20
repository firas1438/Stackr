## Project Infrastructure on AWS

This directory contains the Terraform configuration to deploy the Stackr application (Vite/React frontend, NestJS backend, PostgreSQL database) on AWS. The infrastructure is organized into four distinct modules that work together to create a secure, scalable architecture.

## Architecture Overview

### 1. Networking Module (`modules/networking`)
**Role:** Creates the foundational isolated network (VPC) where all other resources will live.
- **VPC**: The private virtual network housing the entire infrastructure.
- **Subnets**: 
  - **Public Subnets**: Connected directly to the internet (used for Load Balancer, Frontend EC2, NAT Gateway).
  - **Private Subnets**: Hidden from the public internet (used for Backend instances, PostgreSQL Database).
- **Internet Gateway**: Allows resources in the public subnets to connect to the outside world.
- **NAT Gateway**: Allows resources in the private subnets (like the backend downloading npm packages) to access the internet safely without exposing their IP.
- **Route Tables**: Maps network traffic to the correct gateways.

### 2. Security Module (`modules/security`)
**Role:** Acts as the virtual firewall, ensuring resources can only communicate with authorized parties.
- **ALB Security Group**: Allows public HTTP traffic (port 80) from anywhere.
- **Frontend Security Group**: Allows public HTTP and SSH traffic from anywhere.
- **Backend Security Group**: Crucially, *only* allows traffic originating from the ALB Security Group (port 3000). The internet cannot hit the backend servers directly.
- **RDS Security Group**: *Only* allows Postgres traffic (port 5432) originating from the Backend Security Group.

### 3. Database Module (`modules/database`)
**Role:** Provisions the managed, highly available database.
- **DB Subnet Group**: Ensures the database is launched exclusively inside the private subnets.
- **PostgreSQL RDS Instance**: The managed database server. Automatically securely protected by the RDS Security Group and hidden from the internet.

### 4. Compute Module (`modules/compute`)
**Role:** Manages the actual servers running the application code, distributing traffic, and scaling automatically.
- **Application Load Balancer (ALB)**: Sits in the public subnets, receives all backend API requests, and distributes them evenly across the active backend servers.
- **Target Group & Listener**: The listener waits for port 80 traffic on the ALB and routes it to the Target Group (the pool of healthy backend instances). It also actively pings `/health` to ensure the servers are alive.
- **AMI Data Source**: Automatically fetches the latest official Ubuntu operating system image.
- **Backend Launch Template**: The blueprint for spinning up a new backend server. It defines the OS, the server size (`t2.micro`), and runs the `user_data` script (installs Node, clones the repo, injects the dynamic Database URL, builds NestJS, and starts the server).
- **Auto Scaling Group (ASG)**: Uses the Launch Template to spin up backend servers inside the private subnets. If CPU utilization goes over 70%, it automatically creates more servers (scaling out) and registers them to the Target Group.
- **Frontend EC2 Instance**: A standalone server in the public subnet. Its `user_data` script dynamically grabs the new ALB's DNS name, injects it into Vite as `VITE_API_URL`, builds the frontend, and serves it using Nginx with SPA routing.

---

## Setup & Deployment

1. Create a `terraform.tfvars` file to define your secrets:

   ```hcl
   db_password = "your_db_password"
   ```
   
2. Initialize Terraform (downloads AWS provider):

   ```bash
   terraform init
   ```

3. Review the infrastructure plan:

   ```bash
   terraform plan
   ```

4. Apply the infrastructure:

   ```bash
   terraform apply
   ```

## Outputs
After a successful deployment, Terraform will output the following:
- `frontend_public_ip`: Use this to access the Vite/React frontend in your browser.
- `backend_alb_dns`: The URL of your backend Application Load Balancer.
- `db_address`: The internal PostgreSQL database host address.
- `vpc_id`: The ID of the created Virtual Private Cloud.
