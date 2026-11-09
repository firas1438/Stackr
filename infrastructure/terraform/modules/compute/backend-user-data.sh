#!/bin/bash
set -e

apt update -y
apt install -y ansible git

cd /home/ubuntu
git clone ${github_repo} app

cd app/infrastructure/ansible
ansible-playbook -i "localhost," -c local playbook-backend.yml --extra-vars "db_username=${db_username} db_password=${db_password} db_address=${db_address} db_name=${db_name} gemini_api_key=${gemini_api_key}"