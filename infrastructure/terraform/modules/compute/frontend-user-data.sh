#!/bin/bash
set -e

apt update -y
apt install -y ansible git

cd /home/ubuntu
git clone ${github_repo} app

cd app/infrastructure/ansible
ansible-playbook -i "localhost," -c local playbook-frontend.yml --extra-vars "vite_api_url=${api_url}"
