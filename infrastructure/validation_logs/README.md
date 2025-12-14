# Validation Logs

This directory contains outputs from validation tools run during infrastructure auditing.

## Files

- `terraform_init.txt` - Terraform initialization output
- `terraform_validate.txt` - Terraform validation results
- `terraform_fmt_after.txt` - Terraform formatting results
- `kubernetes_yamllint.txt` - Kubernetes YAML linting results
- `ansible_lint.txt` - Ansible linting results (if ansible-core is installed)

## Running Validations

See the main README.md for commands to reproduce these validations.
