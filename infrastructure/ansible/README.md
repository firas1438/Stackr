## Configuration Management with Ansible

This directory contains the Ansible playbooks and configuration templates used to configure your EC2 instances on boot. Instead of using complex bash scripts inside Terraform's `user_data`, we use Ansible playbooks to ensure clean, readable, modular, and idempotent server setup.

## Architecture Overview

The configuration management is split into two playbooks and their supporting Jinja2 configuration templates.

### 1. Backend Playbook (`playbook-backend.yml`)
**Role:** Configures the NestJS application server on the backend instance.
*   **System Packages**: Installs `nodejs` and `git`.
*   **Permissions**: Corrects the owner and group of the cloned application repository to the standard `ubuntu` user.
*   **Environment Configuration**: Writes the backend `.env` containing connection coordinates to the private RDS Postgres database, the port, allowed CORS origins, and the generative Gemini API key.
*   **Application Build**: Runs `npm install`, runs Prisma migrations (`npx prisma migrate deploy`), generates the Prisma client client side, and compiles the NestJS application.
*   **Daemonization**: Renders the custom systemd unit template into `/etc/systemd/system/backend.service`, configures auto-restarts, and starts the backend service.

### 2. Frontend Playbook (`playbook-frontend.yml`)
**Role:** Configures Nginx and builds the React web application on the frontend instance.
*   **System Packages**: Installs `nodejs`, `git`, and `nginx`.
*   **Permissions**: Standardizes repository owner/group settings.
*   **Environment Configuration**: Writes the frontend `.env` containing the `VITE_API_URL` pointing to the public backend ALB DNS.
*   **Application Build**: Safely discards lockfiles and `node_modules` to avoid the Windows/Linux Rollup optional-dependency conflict, installs npm packages, and runs `npm run build`.
*   **Production Deployment**: Creates the webroot `/var/www/html/vite-app`, copies the compiled React dist assets, and sets standard restrictive permissions (`0755` for directories, `0644` for files).
*   **Nginx Configuration**: Renders the custom Nginx server block template, removes the default default host configuration, enables the custom host, and restarts Nginx to begin serving.

### 3. Templates (`templates/`)
*   **`backend.service.j2`**: A systemd Jinja2 template ensuring the NestJS application is kept running, auto-restarted on failures, and correctly routed to `node dist/main.js`.
*   **`nginx.conf.j2`**: An Nginx virtual host Jinja2 template configured with SPA routing rules (using `try_files` to redirect all unmatched traffic back to `index.html`).


## Workflow

This infrastructure adopts the **Ansible Local** pattern. The workflow is completely self-bootstrapping and requires no central master node or open SSH configurations:

```
[ Terraform Bootstraps Instance ]
              │
              ▼
[ user_data runs apt update ]
              │
              ▼
[ Installs ansible & git packages ]
              │
              ▼
[ git clones the repository app ]
              │
              ▼
[ cd app/infrastructure/ansible ]
              │
              ▼
[ Runs: ansible-playbook -i "localhost," -c local my-playbook.yml ]
```

## Manual Debugging & Configuration Re-run

If you ever need to SSH into an instance and manually test, change, or re-run the configuration playbook without rebooting the server:

1. Connect to the EC2 instance using EC2 Instance Connect or SSH.
2. Navigate to the playbooks directory:
   ```bash
   cd /home/ubuntu/app/infrastructure/ansible
   ```
3. Re-run the playbook using `sudo` (since tasks modify system folders and service configurations):
   
   **For Backend:**
   ```bash
   sudo ansible-playbook -i "localhost," -c local playbook-backend.yml \
     --extra-vars "db_username=your_user db_password=your_pass db_address=rds_host db_name=rds_name gemini_api_key=your_key"
   ```

   **For Frontend:**
   ```bash
   sudo ansible-playbook -i "localhost," -c local playbook-frontend.yml \
     --extra-vars "vite_api_url=http://your_alb_dns/api/v1"
   ```
