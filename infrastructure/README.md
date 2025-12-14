# QuantumBallot Infrastructure

Complete infrastructure-as-code setup for the QuantumBallot project, including Terraform, Kubernetes, Ansible, and CI/CD configurations.

## Prerequisites

### Required Tools

Install the following tools before working with this infrastructure:

```bash
# Terraform (>= 1.6.0)
wget https://releases.hashicorp.com/terraform/1.6.6/terraform_1.6.6_linux_amd64.zip
unzip terraform_1.6.6_linux_amd64.zip
sudo mv terraform /usr/local/bin/
terraform version

# kubectl (>= 1.20)
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client

# Ansible (>= 2.9)
pip3 install ansible ansible-lint

# YAML linting
sudo apt-get install yamllint
# OR: pip3 install yamllint

# Kustomize (>= 4.0)
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
sudo mv kustomize /usr/local/bin/

# Optional: tflint for Terraform linting
curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash

# Optional: tfsec for Terraform security scanning
curl -s https://raw.githubusercontent.com/aquasecurity/tfsec/master/scripts/install_linux.sh | bash
```

### Cloud Provider Access

- AWS CLI configured with appropriate credentials
- IAM permissions for creating resources (EC2, ECS, S3, CloudFront, VPC, etc.)

## Directory Structure

```
infrastructure/
├── README.md                    # This file
├── terraform/                   # Terraform IaC
│   ├── providers.tf             # Provider and version constraints
│   ├── environments/
│   │   ├── dev/                 # Development environment
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── terraform.tfvars.example
│   │   └── prod/                # Production environment
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── terraform.tfvars.example
│   └── modules/
│       ├── backend/             # Backend API module
│       └── frontend_web/        # Web frontend module
├── kubernetes/                  # Kubernetes manifests
│   ├── base/                    # Base configurations
│   │   ├── namespace.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── backend-service.yaml
│   │   ├── backend-secret.example.yaml  # Secret template
│   │   └── kustomization.yaml
│   └── overlays/                # Environment-specific overlays
│       ├── dev/
│       └── prod/
├── ansible/                     # Ansible playbooks
│   ├── ansible.cfg
│   ├── site.yml                 # Main playbook
│   ├── inventory.example        # Inventory template
│   ├── .vault.example           # Vault template
│   ├── hosts                    # Actual inventory (placeholder)
│   └── roles/                   # Ansible roles
├── ci-cd/                       # CI/CD workflows
│   ├── main.yml
│   ├── backend-api.yml
│   ├── web-frontend.yml
│   └── documentation.yml
└── validation_logs/             # Validation outputs
    ├── terraform_fmt_after.txt
    ├── terraform_validate.txt
    ├── kubernetes_validate.txt
    └── ansible_lint.txt
```

## Quick Start

### 1. Terraform Setup

```bash
cd terraform/environments/dev

# Create your variables file from example
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your actual values
nano terraform.tfvars

# Initialize Terraform (local backend)
terraform init -backend=false

# Validate configuration
terraform validate

# Format code
terraform fmt -recursive

# Plan deployment (dry run)
terraform plan -out=dev.tfplan

# Apply (creates resources)
# terraform apply dev.tfplan
```

### 2. Kubernetes Deployment

```bash
cd kubernetes

# Create secret from example
cp base/backend-secret.example.yaml base/backend-secret.yaml
# Edit backend-secret.yaml with actual values
nano base/backend-secret.yaml

# Validate manifests
yamllint base/
kustomize build overlays/dev | kubectl apply --dry-run=client -f -

# Apply to cluster (dev environment)
kubectl apply -k overlays/dev

# Check deployment status
kubectl get all -n quantumballot
```

### 3. Ansible Configuration

```bash
cd ansible

# Create inventory from example
cp inventory.example inventory
# Edit inventory with your server IPs
nano inventory

# Create vault for secrets
ansible-vault create .vault
# Add sensitive variables to vault

# Run playbook in check mode (dry run)
ansible-playbook -i inventory site.yml --check

# Run actual deployment
# ansible-playbook -i inventory site.yml --ask-vault-pass
```

## Validation Commands

### Terraform Validation

```bash
cd terraform
terraform fmt -recursive -check     # Check formatting
terraform fmt -recursive            # Fix formatting
terraform init -backend=false       # Initialize without remote backend
terraform validate                  # Validate syntax
```

### Kubernetes Validation

```bash
cd kubernetes
yamllint base/                      # YAML syntax check
yamllint overlays/

# Validate with kustomize
kustomize build base
kustomize build overlays/dev

# Validate with kubectl (requires cluster access)
kubectl apply --dry-run=client -k overlays/dev
```

### Ansible Validation

```bash
cd ansible
ansible-lint .                      # Lint playbooks
yamllint .                          # YAML syntax
ansible-playbook -i inventory.example site.yml --syntax-check
```

### CI/CD Validation

```bash
cd ci-cd
yamllint *.yml

# For GitHub Actions workflows
# Use actionlint: https://github.com/rhysd/actionlint
```

## Environment Variables

### Terraform

Set these before running Terraform:

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
```

### Ansible

Set these for Ansible playbooks:

```bash
export DB_HOST="your-db-host"
export DB_NAME="quantumballot"
export DB_USER="dbuser"
export DB_PASSWORD="secure-password"
export GRAFANA_ADMIN_PASSWORD="grafana-password"
```

## Security Best Practices

1. **Never commit secrets** - Use `.gitignore` for:
   - `terraform.tfvars`
   - `*.tfstate`
   - `*.tfstate.backup`
   - `ansible/.vault`
   - `kubernetes/**/secret.yaml` (non-example)

2. **Use secret management** - In production:
   - AWS Secrets Manager for Terraform
   - Kubernetes Secrets with encryption at rest
   - Ansible Vault for configuration management

3. **Restrict access** - Follow least privilege:
   - IAM roles for AWS resources
   - RBAC for Kubernetes
   - Bastion hosts for SSH access

4. **Encrypt state** - Use remote state with encryption:
   - S3 backend with encryption enabled
   - DynamoDB for state locking

## Troubleshooting

### Terraform Issues

**Problem**: `Error: No valid credential sources found`
**Solution**: Configure AWS credentials via environment variables or `~/.aws/credentials`

**Problem**: `Error: Backend initialization required`
**Solution**: Run `terraform init` before other commands

### Kubernetes Issues

**Problem**: `error: You must be logged in to the server`
**Solution**: Configure kubectl with `aws eks update-kubeconfig` or your cluster config

**Problem**: Image pull errors
**Solution**: Ensure ECR authentication is set up and image exists

### Ansible Issues

**Problem**: `Host key verification failed`
**Solution**: Add `host_key_checking = False` to `ansible.cfg` or add hosts to `known_hosts`

**Problem**: Permission denied
**Solution**: Ensure SSH keys are configured and user has sudo privileges

## CI/CD Integration

The CI/CD workflows in `ci-cd/` directory integrate with GitHub Actions and include:

- Automated testing and validation
- Terraform plan on pull requests
- Kubernetes manifest validation
- Ansible playbook linting
- Documentation deployment

### Required GitHub Secrets

Configure these secrets in your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `KUBE_CONFIG` (base64 encoded)
- `ANSIBLE_VAULT_PASSWORD`

## Additional Resources

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Ansible Documentation](https://docs.ansible.com/)
- [QuantumBallot Project Docs](../docs/)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review validation logs in `validation_logs/`
3. Open an issue in the GitHub repository

## License

See [LICENSE](../LICENSE) file in the repository root.
