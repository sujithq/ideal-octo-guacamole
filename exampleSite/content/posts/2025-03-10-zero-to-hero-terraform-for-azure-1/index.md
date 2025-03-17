+++
title = '🖥️ From Zero to Hero: Terraform for Azure - Part 1'
slug = "zero-to-hero-terraform-for-azure-1"
date = '2025-03-10 06:00:00Z'
draft = false
tags = [
  "Terraform",
  "Azure",
  "az-cli",
  "IaC",
  "Cloud Infrastructure",
  "Beginners Guide"
]
categories = [
  "Cloud",
  "Infrastructure as Code (IaC)",
  "DevOps"
]
series = [
  'Zero to Hero: Terraform for Azure'
]

layout = 'single'
[params]
    cover = true
    author = 'sujith'
    
description = "Kickstart your journey with Terraform for Azure. This first part of the series covers the basics and sets the foundation for automating your Azure infrastructure."


+++

## **Introduction**

Terraform is a powerful Infrastructure as Code (IaC) tool that enables you to define, provision, and manage Azure resources using declarative configuration files. This blog series, _Zero to Hero: Terraform for Azure_, will take you through Terraform from the basics to advanced topics, using hands-on examples tailored for Azure.

In this first post, we’ll focus on setting up your development environment and deploying your first resource on Azure using Terraform.

## **Prerequisites**

Before we start, you need:

- An [Azure account](https://azure.microsoft.com/en-us/free/) (a free account works fine)
- Basic knowledge of Azure (nice to have, but not required)

We’ll cover multiple setup options:

1. **Local installation** (best for long-term development)
2. **Using Docker** (best for isolated environments)

---

## **1. Setting Up the Development Environment**

### **Option 1: Local Installation**

For local development, you need to install:

1. **Terraform**
   - [Download Terraform](https://developer.hashicorp.com/terraform/downloads) for your OS.
   - Verify installation:

     ```sh
     terraform version
     ```

2. **Azure CLI**

   - Install Azure CLI for authentication and resource management:
     - Windows:

       ```powershell
       winget install --id Microsoft.AzureCLI -e
       ```

     - macOS:

       ```sh
       brew install azure-cli
       ```

     - Linux (Debian-based):

       ```sh
       curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
       ```

   - Verify installation:

     ```sh
     az version
     ```

3. **Visual Studio Code**
   - Install [VS Code](https://code.visualstudio.com/download).
   - Install the **Terraform extension** from the Marketplace.

### **Option 2: Using Docker**

If you prefer an isolated environment, you can use Terraform inside a Docker container.

1. Install [Docker](https://www.docker.com/products/docker-desktop).
2. Run Terraform inside a container:

   ```sh
   docker run --rm -it hashicorp/terraform:latest version
   ```

3. To work with local files, mount a volume:

   ```sh
   docker run --rm -it -v $(pwd):/app -w /app hashicorp/terraform:latest init
   ```

---

## **2. Authenticating with Azure**

To deploy resources, Terraform needs to authenticate with Azure.

### **Login using Azure CLI**

1. Open a terminal and log in:

   ```sh
   az login
   ```

2. If using multiple subscriptions, set the desired one:

   ```sh
   az account set --subscription "<subscription-id>"
   ```

### **Using a Service Principal (For Automation)**

For automation in CI/CD pipelines:

```sh
az ad sp create-for-rbac --name terraform-sp --role Contributor --scopes /subscriptions/<subscription-id> --sdk-auth
```

Copy the JSON output for use in Terraform.

---

## **3. Writing Your First Terraform Configuration**

Let’s create a simple Terraform script to deploy an Azure Storage Account.

### **Step 1: Initialize a Terraform Project**

1. Create a new directory:

   ```sh
   mkdir terraform-azure && cd terraform-azure
   ```

2. Create a new Terraform file:

   ```sh
   touch main.tf
   ```

### **Step 2: Define the Terraform Configuration**

Open `main.tf` in VS Code and add the following:

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "terraform-rg"
  location = "West Europe"
}
```

### **Step 3: Initialize Terraform**

Run:

```sh
terraform init
```

### **Step 4: Preview Changes**

```sh
terraform plan
```

### **Step 5: Apply the Configuration**

```sh
terraform apply -auto-approve
```

Once completed, your resource group will be created in Azure.

---

## **4. Cleaning Up and Next Steps**

To remove the deployed resources:

```sh
terraform destroy -auto-approve
```

### **Next Steps**

In the next post, we’ll explore **Terraform state management** and remote backends.

Stay tuned for more hands-on Terraform learning! 🚀
