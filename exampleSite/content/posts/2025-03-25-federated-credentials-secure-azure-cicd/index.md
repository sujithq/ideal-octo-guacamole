+++
title = '📘 Using Federated Credentials to Secure Azure CI/CD Pipelines'
slug = 'federated-credentials-secure-azure-cicd'
date = '2025-03-25 06:00:00Z'
draft = false
tags = ["Azure", "GitHub Actions", "Azure DevOps", "Federated Identity", "Security", "CI/CD", "Authentication"]
categories = ["DevOps", "Security", "Azure"]
series = [ ]

layout = 'single'
[params]
    cover = true
    author = 'sujith'

description = "Learn how federated credentials improve security and simplify authentication in GitHub Actions and Azure DevOps pipelines, eliminating the need to store secrets in pipelines or repositories."
    
+++

## Why Use Federated Credentials in CI/CD Pipelines?

In DevOps, protecting credentials and preventing secret sprawl across CI/CD systems like GitHub Actions and Azure DevOps is crucial. Federated credentials provide a secure way to authenticate pipelines without storing sensitive information, reducing the risk of exposure and simplifying secret management.

Federated identity leverages external identity providers (such as Azure Active Directory) to authenticate users and applications securely. Rather than managing multiple secrets or tokens across platforms, federated identity centralizes authentication, providing significant security and operational benefits.

### Benefits of Using Federated Credentials in CI/CD Pipelines

#### 1️⃣ Eliminate Secrets in Pipelines

Federated credentials eliminate the need to store sensitive secrets directly within pipeline configurations, significantly reducing the attack surface.

#### 2️⃣ Centralized Identity Management

Using a centralized identity provider simplifies user and app authentication across multiple CI/CD platforms, reducing administrative overhead.

#### 3️⃣ Enhanced Security

Federated authentication allows leveraging advanced security measures such as Multi-Factor Authentication (MFA), conditional access, and identity protection offered by Azure AD.

#### 4️⃣ Simplified Secret Rotation

Federated identities use short-lived, auto-rotated tokens, simplifying credential rotation processes and reducing the risk of credential leaks.

#### 5️⃣ Improved Compliance and Auditability

Centralized identity providers offer robust auditing and compliance capabilities, making it easier to track authentication events and meet regulatory requirements.

#### 6️⃣ Reduced Administrative Effort

By avoiding direct secret management, teams save considerable time and reduce potential human errors in handling credentials.

#### 7️⃣ Better Collaboration

Federated identity streamlines collaboration across teams and organizations by enabling secure and seamless access management through unified authentication.

#### 8️⃣ Future-Proof Authentication

Federated identity solutions scale efficiently and adapt easily to evolving security requirements and organizational growth.

---

## Implementing Federated Identity in GitHub and Azure DevOps

### GitHub Actions Integration

Federated identity can be integrated directly into GitHub Actions workflows through Azure AD's OIDC provider. This allows pipelines to securely authenticate to Azure without maintaining any secrets in GitHub.

Below are clear guidelines to integrate federated credentials using either an **Azure AD App Registration** or an **Azure Managed Identity**. Each method includes complete scripts and GitHub workflows.

#### GitHub - Method 1: Azure AD App Registration

##### GitHub - Create Azure AD Application with Federated Credential

This script automates the setup of an **Azure AD App Registration** with federated identity, enabling **GitHub Actions** workflows to securely authenticate to Azure without storing any secrets.

**Detailed Steps:**

**1️⃣ Define Variables**

These variables should be customized with your details:

- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID for resource access.
- `GH_ORG`: GitHub organization or username.
- `GH_REPO`: GitHub repository name.
- `GH_BRANCH`: Repository branch authorized for authentication (typically `main`).

**2️⃣ Create Azure AD Application and Assign RBAC Role**

```bash
result=$(az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/$AZURE_SUBSCRIPTION_ID")

AAD_CLIENT_ID=$(echo $result | jq -r '.appId')
AAD_TENANT_ID=$(echo $result | jq -r '.tenant')
```

- Uses Azure CLI to create an Azure AD **Service Principal (App Registration)**.
- Automatically assigns the `Contributor` role scoped to your Azure subscription.
- Captures key identifiers:
  - `AAD_CLIENT_ID`: Application Client ID for authentication.
  - `AAD_TENANT_ID`: Azure AD Tenant ID.

**3️⃣ Prepare Federated Credential Configuration**

```bash
cat <<EOF > params.json
{
  "name": "${GH_ORG}-${GH_REPO}-federation",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:${GH_ORG}/${GH_REPO}:ref:refs/heads/${GH_BRANCH}",
  "description": "Federation for GitHub Actions (${GH_ORG}/${GH_REPO})",
  "audiences": ["api://AzureADTokenExchange"]
}
EOF
```

This JSON configuration defines the federated identity:

- **name:** A descriptive identifier for the federated credential.
- **issuer:** The trusted issuer of the OIDC token from GitHub Actions.
- **subject:** Restricts authentication specifically to your GitHub repository and branch, ensuring tight security boundaries.
- **description:** A helpful descriptor for easy management.
- **audiences:** The intended Azure token exchange audience.

**4️⃣ Create the Federated Credential**

```bash
az ad app federated-credential create --id $AAD_CLIENT_ID --parameters @params.json
```

- Links the federated credential configuration with your Azure AD Application.
- Enables GitHub Actions workflows to securely authenticate to Azure via short-lived OIDC tokens, eliminating the need for storing secrets.

**5️⃣ Output GitHub Secrets**

```bash
printf "Add the following secrets to your GitHub repository:\n"
printf "AZURE_CLIENT_ID=%s\n" "$AAD_CLIENT_ID"
printf "AZURE_TENANT_ID=%s\n" "$AAD_TENANT_ID"
printf "AZURE_SUBSCRIPTION_ID=%s\n" "$AZURE_SUBSCRIPTION_ID"
```

- Outputs critical (non-sensitive) identifiers required for configuring GitHub repository secrets.
- These identifiers are safe to store as secrets or variables, as they contain no direct credential secrets (e.g., passwords or tokens).

**✅ Complete script**

```bash
# Variables
AZURE_SUBSCRIPTION_ID="<your-subscription-id>"
GH_ORG="<your-github-org>"
GH_REPO="<your-github-repo>"
GH_BRANCH="main"

# Create Azure AD App Registration with RBAC
result=$(az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/$AZURE_SUBSCRIPTION_ID")

AAD_CLIENT_ID=$(echo $result | jq -r '.appId')
AAD_TENANT_ID=$(echo $result | jq -r '.tenant')

# Federated Credential Parameters
cat <<EOF > params.json
{
  "name": "${GH_ORG}-${GH_REPO}-federation",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:${GH_ORG}/${GH_REPO}:ref:refs/heads/${GH_BRANCH}",
  "description": "Federation for GitHub Actions (${GH_ORG}/${GH_REPO})",
  "audiences": ["api://AzureADTokenExchange"]
}
EOF

# Create Federated Credential
az ad app federated-credential create --id $AAD_CLIENT_ID --parameters @params.json

# Output required values
printf "Add the following secrets to your GitHub repository:\n"
printf "AZURE_CLIENT_ID=%s\n" "$AAD_CLIENT_ID"
printf "AZURE_TENANT_ID=%s\n" "$AAD_TENANT_ID"
printf "AZURE_SUBSCRIPTION_ID=%s\n" "$AZURE_SUBSCRIPTION_ID"
```

##### GitHub Actions Workflow (App Registration)

This GitHub Actions workflow demonstrates how to securely authenticate to Azure using an **Azure AD App Registration** with a federated credential, leveraging OpenID Connect (OIDC).

**Pipeline Overview**

- **Workflow Name:**  
  `Azure AD App Federated Credential`

- **Trigger:**  
  Executes on each push to the `main` branch.

- **Runner:**  
  Uses GitHub's hosted Ubuntu runner (`ubuntu-latest`).

**Step 1: Checkout Code**

```yaml
- uses: actions/checkout@v4
```

- Retrieves the latest source code from your repository.

**2️⃣ Authenticate to Azure with OIDC**

```yaml
- uses: azure/login@v2
  with:
    client-id: ${{ secrets.AZURE_CLIENT_ID }}
    tenant-id: ${{ secrets.AZURE_TENANT_ID }}
    subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

- Authenticates the workflow to Azure using OIDC, obtaining an Azure token without ever storing secrets directly in the pipeline.
- Uses the Azure AD App Registration's federated credential configured earlier.
- Essential GitHub secrets (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`) were set up previously.

**Security Note:**
- The `id-token: write` permission is crucial, as it enables the workflow to request an OIDC token securely.

**3️⃣ Display Subscription Info**

```yaml
- name: Display Subscription Info
  uses: azure/cli@v1
  with:
    inlineScript: |
      az account show --query "name" -o tsv
```

- Runs an Azure CLI command to confirm successful authentication by displaying the active Azure subscription name.
- Demonstrates a basic Azure CLI operation within the authenticated context, indicating readiness for further Azure operations.

**✅ Complete script**

```yml
name: Azure AD App Federated Credential

permissions:
  id-token: write
  contents: read

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Display Subscription Info
        uses: azure/cli@v1
        with:
          inlineScript: |
            az account show --query "name" -o tsv
```

#### GitHub - Method 2: Azure Managed Identity

##### Create Managed Identity with Federated Credential

This script automates the setup of an **Azure Managed Identity** with a federated credential, allowing GitHub Actions workflows to authenticate securely to Azure without storing any secrets.

**Detailed Steps:**

**Step 1: Define Variables**

You must customize these variables:

- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription identifier.
- `AZURE_RG`: Name for the Azure resource group to host the managed identity.
- `AZURE_LOCATION`: Azure region to deploy the managed identity (e.g., `westeurope`).
- `ID_NAME`: Name for the Azure Managed Identity resource.
- `GH_ORG`: GitHub organization or user name.
- `GH_REPO`: GitHub repository name.
- `GH_BRANCH`: Repository branch permitted to authenticate (typically `main`).

**2️⃣ Create Resource Group**

```bash
az group create --resource-group $AZURE_RG --location $AZURE_LOCATION
```

- Creates a resource group in Azure, acting as a container for resources such as the managed identity.

**3️⃣ Create Managed Identity**

```bash
result=$(az identity create --name $ID_NAME --resource-group $AZURE_RG)

AAD_CLIENT_ID=$(echo $result | jq -r '.clientId')
AAD_PRINCIPAL_ID=$(echo $result | jq -r '.principalId')
AAD_TENANT_ID=$(echo $result | jq -r '.tenantId')
```

- Creates a **User-Assigned Managed Identity**, capturing the following identifiers:
  - `AAD_CLIENT_ID`: Application Client ID used for authentication.
  - `AAD_PRINCIPAL_ID`: Principal ID used for assigning Azure RBAC roles.
  - `AAD_TENANT_ID`: Tenant ID for your Azure Active Directory instance.

**4️⃣ Assign RBAC Role to Managed Identity**

```bash
az role assignment create --role "Contributor" --assignee-object-id $AAD_PRINCIPAL_ID --scope /subscriptions/$AZURE_SUBSCRIPTION_ID
```

- Grants the Managed Identity the **Contributor** role at the subscription level.
- Enables it to perform actions within your Azure subscription securely.

**5️⃣ Create Federated Credential**

```bash
az identity federated-credential create \
  --name "${GH_ORG}-${GH_REPO}-federation" \
  --identity-name $ID_NAME \
  --resource-group $AZURE_RG \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${GH_ORG}/${GH_REPO}:ref:refs/heads/${GH_BRANCH}" \
  --audiences "api://AzureADTokenExchange"
```

- Establishes a federated identity between Azure and GitHub Actions using OIDC:
  - `issuer`: GitHub Actions OIDC token issuer URL.
  - `subject`: Restricts authentication to your specific GitHub repository and branch.
  - `audiences`: Configured audience that Azure expects for authentication via token exchange.

This federated credential allows your GitHub Actions workflow to authenticate with Azure automatically without directly storing sensitive credentials.

**6️⃣ Output Required GitHub Secrets**

```bash
printf "Add the following secrets to your GitHub repository:\n"
printf "AZURE_CLIENT_ID=%s\n" "$AAD_CLIENT_ID"
printf "AZURE_TENANT_ID=%s\n" "$AAD_TENANT_ID"
printf "AZURE_SUBSCRIPTION_ID=%s\n" "$AZURE_SUBSCRIPTION_ID"
```

- Displays critical values that must be added as GitHub repository secrets:
  - `AZURE_CLIENT_ID`
  - `AZURE_TENANT_ID`
  - `AZURE_SUBSCRIPTION_ID`

These variables do not store sensitive passwords or secrets directly—only identifiers necessary for the authentication process.

**✅ Complete script**

```bash
# Variables
AZURE_SUBSCRIPTION_ID="<your-subscription-id>"
AZURE_RG="rg-gh-oidc"
AZURE_LOCATION="westeurope"
ID_NAME="id-gh-oidc"
GH_ORG="<your-github-org>"
GH_REPO="<your-github-repo>"
GH_BRANCH="main"

# Create Resource Group
az group create --resource-group $AZURE_RG --location $AZURE_LOCATION

# Create Managed Identity
result=$(az identity create --name $ID_NAME --resource-group $AZURE_RG)

AAD_CLIENT_ID=$(echo $result | jq -r '.clientId')
AAD_PRINCIPAL_ID=$(echo $result | jq -r '.principalId')
AAD_TENANT_ID=$(echo $result | jq -r '.tenantId')

# Assign RBAC role to Managed Identity
az role assignment create --role "Contributor" --assignee-object-id $AAD_PRINCIPAL_ID --scope /subscriptions/$AZURE_SUBSCRIPTION_ID

# Create Federated Credential
az identity federated-credential create \
  --name "${GH_ORG}-${GH_REPO}-federation" \
  --identity-name $ID_NAME \
  --resource-group $AZURE_RG \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${GH_ORG}/${GH_REPO}:ref:refs/heads/${GH_BRANCH}" \
  --audiences "api://AzureADTokenExchange"

# Output required values
printf "Add the following secrets to your GitHub repository:\n"
printf "AZURE_CLIENT_ID=%s\n" "$AAD_CLIENT_ID"
printf "AZURE_TENANT_ID=%s\n" "$AAD_TENANT_ID"
printf "AZURE_SUBSCRIPTION_ID=%s\n" "$AZURE_SUBSCRIPTION_ID"
```

##### GitHub Actions Workflow (Managed Identity)

```yml
name: Azure Managed Identity Federated Credential

permissions:
  id-token: write
  contents: read

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Display Subscription Info
        uses: azure/cli@v1
        with:
          inlineScript: |
            az account show --query "name" -o tsv
```

---

### Azure DevOps Pipelines Integration

Federated identity integration with Azure DevOps pipelines allows secure, secretless authentication to Azure resources using Azure AD's built-in OIDC support. This prevents credential leaks and reduces the spread of secrets across your DevOps pipelines.

Below are clear guidelines to integrate federated credentials using either an **Azure AD App Registration** or an **Azure Managed Identity**. Each method includes complete scripts and Azure DevOps pipelines.

#### Azure DevOps - Method 1: Azure AD App Registration

##### Azure DevOps - Create Azure AD Application with Federated Credential

This script automates the creation and configuration of an **Azure DevOps Service Connection** using OpenID Connect (OIDC) federation with an **Azure AD App Registration**. This enables Azure DevOps Pipelines to authenticate securely to Azure without storing secrets in the pipeline.

**Detailed Steps:**

**1. Variables Initialization**

You must customize these variables according to your environment:

- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID.
- `AZDO_ORGANIZATION_NAME`: Azure DevOps organization name (e.g., `myorg`).
- `AZDO_PROJECT_NAME`: Azure DevOps project name.
- `AZDO_SERVICE_ENDPOINT_NAME`: Name for the Azure DevOps Service Connection.

---

**2. Azure Subscription Name Retrieval**

```bash
result=$(az account show -s $AZURE_SUBSCRIPTION_ID)
AZURE_SUBSCRIPTION_NAME=$(echo $result | jq -r '.name')
```

- Fetches the Azure subscription details.
- Captures the subscription name to be used in subsequent configurations.


**3. Azure DevOps CLI Configuration**

```bash
AZDO_BASE_URL="https://dev.azure.com/$AZDO_ORGANIZATION_NAME"  
az devops configure --defaults organization=$AZDO_BASE_URL
```

- Sets the Azure DevOps CLI default organization context for subsequent commands.

**4. Azure DevOps Project Creation**

```bash
if ! az devops project list | jq -e --arg PROJECT_NAME "$AZDO_PROJECT_NAME" '.[] | select(.name == $PROJECT_NAME)' > /dev/null; then
  az devops project create --name $AZDO_PROJECT_NAME --description $AZDO_PROJECT_NAME --visibility private
fi
```

- Checks if the Azure DevOps project already exists.
- Creates the project if it doesn't exist (with private visibility).

**5. Azure AD Application (Service Principal) Creation**

```bash
result=$(az ad sp create-for-rbac --role="Contributor" \
   --scopes="/subscriptions/$AZURE_SUBSCRIPTION_ID" \
   --name app-$AZDO_ORGANIZATION_NAME-azdo-oidc)

AAD_CLIENT_ID=$(echo $result | jq -r '.appId')
AAD_TENANT_ID=$(echo $result | jq -r '.tenant')
```

- Creates an Azure AD **Service Principal** with the Contributor role scoped to your Azure subscription.
- Captures necessary identifiers (`AAD_CLIENT_ID` and `AAD_TENANT_ID`) for authentication.

**6. Azure DevOps Service Endpoint Configuration**

The script creates a JSON file (`params.azdo.json`) that defines an Azure RM (Resource Manager) service endpoint with federated authentication parameters:

- `authorization.scheme`: Set as `WorkloadIdentityFederation` to use OIDC.
- Provides details like subscription ID, subscription name, tenant ID, and service principal client ID.

```json
{
  "data": {
    "subscriptionId": "...",
    "subscriptionName": "..."
  },
  "authorization": {
    "parameters": {
      "serviceprincipalid": "...",
      "tenantid": "..."
    },
    "scheme": "WorkloadIdentityFederation"
  },
  ...
}
```

**7. Azure DevOps Service Endpoint Creation or Retrieval**

```bash
if ! az devops service-endpoint list --project $AZDO_PROJECT_NAME | jq -e --arg SE_NAME "$AZDO_SERVICE_ENDPOINT_NAME" '.[] | select(.name == $SE_NAME)' > /dev/null; then
  result=$(az devops service-endpoint create \
      --service-endpoint-configuration params.azdo.json \
      --organization $AZDO_BASE_URL \
      --project $AZDO_PROJECT_NAME \
      --detect true)

  SERVICE_ENDPOINT_ID=$(echo $result | jq -r '.id')                                                                                                                                 
else  
  SERVICE_ENDPOINT_ID=$(az devops service-endpoint list \
    --project $AZDO_PROJECT_NAME | jq -r \
    --arg NAME "$AZDO_SERVICE_ENDPOINT_NAME" '.[] | select(.name==$NAME) | .id')

  result=$(az devops service-endpoint show \
      --project $AZDO_PROJECT_NAME \
      --id $SERVICE_ENDPOINT_ID)
fi
```

- Checks if the Service Endpoint already exists in the project.
- Creates the endpoint if it doesn’t exist, or retrieves existing endpoint details.
- Captures key identifiers like `SERVICE_ENDPOINT_ID`.

**8. Retrieve Issuer and Subject from Service Endpoint**

```bash
SERVICE_ENDPOINT_ISSUER=$(echo $result | jq -r '.authorization.parameters.workloadIdentityFederationIssuer')                                                                      
SERVICE_ENDPOINT_SUBJECT=$(echo $result | jq -r '.authorization.parameters.workloadIdentityFederationSubject')
```

- Retrieves the **Issuer URL** and **Subject claim** from the Service Endpoint configuration, needed for Azure AD federated credential setup.

**9. Federated Credential Creation or Update**

The script prepares two JSON configuration files for Azure AD federated credential:

- **params.create.json** (used for initial creation)
- **params.update.json** (used for subsequent updates)

Both files specify the following properties:

- `name`: Credential identifier.
- `issuer`: Token issuer URL from Azure DevOps.
- `subject`: Subject claim that uniquely identifies the Azure DevOps Service Endpoint.
- `audiences`: Specifies `"api://AzureADTokenExchange"` as the audience for OIDC.

```json
{
  "name": "...",
  "issuer": "...",
  "subject": "...",
  "description": "...",
  "audiences": ["api://AzureADTokenExchange"]
}
```

Then it checks whether the federated credential already exists:

```bash
if ! az ad app federated-credential list --id $AAD_CLIENT_ID | jq -e --arg NAME "$PARAMS_NAME" '.[] | select(.name == $NAME)' > /dev/null; then
  az ad app federated-credential create --id $AAD_CLIENT_ID --parameters params.create.json
else
  FEDERATED_CREDENTIAL_ID=$(az ad app federated-credential list --id $AAD_CLIENT_ID | jq -r -e --arg NAME "$PARAMS_NAME" '.[] | select(.name == $NAME) | .id')
  az ad app federated-credential update --id $AAD_CLIENT_ID --federated-credential-id $FEDERATED_CREDENTIAL_ID --parameters params.update.json
fi
```

- Creates a new federated credential linking Azure DevOps and Azure AD, or updates the existing one if needed.

**✅ Complete script**

```bash
# Variables

# Azure Subscription Id
AZURE_SUBSCRIPTION_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
# Azure DevOps Organization Name
AZDO_ORGANIZATION_NAME="<myorg>"
# Azure DevOps Project Name
AZDO_PROJECT_NAME="<myproject>"                                  
# Azure DevOps Service Account Name
AZDO_SERVICE_ENDPOINT_NAME="<mysvcconnection>"                      

# Azure Subscription Name
result=$(az account show -s $AZURE_SUBSCRIPTION_ID)
AZURE_SUBSCRIPTION_NAME=$(echo $result | jq -r '.name') 

# Azure DevOps base URL
AZDO_BASE_URL="https://dev.azure.com/$AZDO_ORGANIZATION_NAME"  

# Set Azure DevOps defaults
result=$(az devops configure --defaults organization=$AZDO_BASE_URL)

# Create DevOps Project
if ! az devops project list | jq -e --arg PROJECT_NAME "$AZDO_PROJECT_NAME" '.[] | select(.name == $PROJECT_NAME)' > /dev/null; then
  result=$(az devops project create --name $AZDO_PROJECT_NAME --description $AZDO_PROJECT_NAME --visibility private)
fi

# Create App Registration
result=$(az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/$AZURE_SUBSCRIPTION_ID" --name app-$AZDO_ORGANIZATION_NAME-azdo-oidc)

# Get AAD Application Id
AAD_CLIENT_ID=$(echo $result | jq -r '.appId')
AAD_TENANT_ID=$(echo $result | jq -r '.tenant')

# Create Service Endpoint Configuration params file params.azdo.json
cat <<EOF > params.azdo.json
{
  "data": {
    "subscriptionId": "${AZURE_SUBSCRIPTION_ID}",
    "subscriptionName": "$AZURE_SUBSCRIPTION_NAME"
  },
  "authorization": {
    "parameters": {
        "serviceprincipalid": "${AAD_CLIENT_ID}",
        "tenantid": "${AAD_TENANT_ID}"
    },
    "scheme": "WorkloadIdentityFederation"
  },
  "description": "${AZDO_SERVICE_ENDPOINT_NAME}",
  "name": "${AZDO_SERVICE_ENDPOINT_NAME}",
  "serviceEndpointProjectReferences": [
    {
      "description": "${AZDO_SERVICE_ENDPOINT_NAME}",
      "name": "${AZDO_SERVICE_ENDPOINT_NAME}",
      "projectReference": {
        "name": "${AZDO_PROJECT_NAME}"
      }
    }
  ],
  "type": "azurerm",
  "url": "https://management.azure.com/"
}
EOF

# Create Or Get Service Endpoint

if ! az devops service-endpoint list --project $AZDO_PROJECT_NAME | jq -e --arg SE_NAME "$AZDO_SERVICE_ENDPOINT_NAME" '.[] | select(.name == $SE_NAME)' > /dev/null; then
  result=$(az devops service-endpoint create --service-endpoint-configuration params.azdo.json --organization $AZDO_BASE_URL --project $AZDO_PROJECT_NAME --detect true)
  # Service Endpoint Id
  SERVICE_ENDPOINT_ID=$(echo $result | jq -r '.id')                                                                                                                                 
else  
  # Service Endpoint Id
  SERVICE_ENDPOINT_ID=$(az devops service-endpoint list --project $AZDO_PROJECT_NAME | jq -r --arg NAME "$AZDO_SERVICE_ENDPOINT_NAME" '.[] | select(.name==$NAME) | .id')
  result=$(az devops service-endpoint show --project $AZDO_PROJECT_NAME --id $SERVICE_ENDPOINT_ID)
fi

# Service Endpoint Issuer
SERVICE_ENDPOINT_ISSUER=$(echo $result | jq -r '.authorization.parameters.workloadIdentityFederationIssuer')                                                                      
# Service Endpoint Subject
SERVICE_ENDPOINT_SUBJECT=$(echo $result | jq -r '.authorization.parameters.workloadIdentityFederationSubject')                                                                    


# Create Federated Credential Configuration params file params.json
PARAMS_NAME="$AZDO_PROJECT_NAME-federated-identity"
PARAMS_ISSUER="${SERVICE_ENDPOINT_ISSUER}"
PARAMS_SUBJECT="${SERVICE_ENDPOINT_SUBJECT}"
PARAMS_DESCRIPTION="Federation for Service Connection $AZDO_SERVICE_ENDPOINT_NAME in $AZDO_BASE_URL/$AZDO_PROJECT_NAME/_settings/adminservices?resourceId=$SERVICE_ENDPOINT_ID"

cat <<EOF > params.create.json
{
  "name": "${PARAMS_NAME}",
  "issuer": "${SERVICE_ENDPOINT_ISSUER}",
  "subject": "${PARAMS_SUBJECT}",
  "description": "${PARAMS_DESCRIPTION}",
  "audiences": [
    "api://AzureADTokenExchange"
  ]
}
EOF

cat <<EOF > params.update.json
{
  "issuer": "${SERVICE_ENDPOINT_ISSUER}",
  "subject": "${PARAMS_SUBJECT}",
  "description": "${PARAMS_DESCRIPTION}",
  "audiences": [
    "api://AzureADTokenExchange"
  ]
}
EOF

# Create Or Update Federated Credential
if ! az ad app federated-credential list --id $AAD_CLIENT_ID | jq -e --arg NAME "$PARAMS_NAME" '.[] | select(.name == $NAME)' > /dev/null; then
  result=$(az ad app federated-credential create --id $AAD_CLIENT_ID --parameters params.create.json) 
else
  FEDERATED_CREDENTIAL_ID=$(az ad app federated-credential list --id $AAD_CLIENT_ID | jq -r -e --arg NAME "$PARAMS_NAME" '.[] | select(.name == $NAME) | .id')
  result=$(az ad app federated-credential update --id $AAD_CLIENT_ID --federated-credential-id $FEDERATED_CREDENTIAL_ID --parameters params.update.json) 
fi

```

##### Azure DevOps - YAML Pipeline (App Registration)

This script automates the following tasks:

- Cloning an Azure DevOps Git repository.
- Adding a pipeline YAML definition.
- Committing and pushing pipeline changes.
- Creating a pipeline in Azure DevOps that leverages a federated identity service connection.

**Detailed Steps:**

**1. Clone Azure DevOps Repository**

```bash
git clone https://$AZDO_ORGANIZATION_NAME@dev.azure.com/$AZDO_ORGANIZATION_NAME/$AZDO_PROJECT_NAME/_git/$AZDO_PROJECT_NAME
cd $AZDO_PROJECT_NAME
```

- Clones your Azure DevOps repository locally using HTTPS authentication.
- Navigates into the cloned repository folder.

**2. Set Variables for Pipeline**

```bash
PIPELINE_DIR="pipelines"
IDENTITY_TYPE="sp"
```

- `PIPELINE_DIR`: Directory to store pipeline YAML files.
- `IDENTITY_TYPE`: Identifier (e.g., "sp" for service principal) used to name the pipeline YAML file clearly.

**3. Create Pipeline Directory**

```bash
if [ ! -d "$PIPELINE_DIR" ]; then
    mkdir $PIPELINE_DIR
fi
```

- Checks if the directory for pipelines exists, creating it if necessary.

**4. Generate Azure DevOps Pipeline YAML**

Creates a pipeline YAML file at `pipelines/sp.yaml`:

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: AzureCLI@2
  inputs:
    azureSubscription: '${AZDO_SERVICE_ENDPOINT_NAME}'
    scriptType: 'pscore'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az account show --query id -o tsv
```

- **Trigger**: Runs on every commit to the `main` branch.
- **Agent pool**: Uses a hosted Ubuntu image (`ubuntu-latest`).
- **Task**: Executes an Azure CLI command:
  - Uses the Azure service connection (`AZDO_SERVICE_ENDPOINT_NAME`) with federated identity.
  - Displays the Azure subscription ID to verify connectivity.

**5. Commit and Push Pipeline YAML**

```bash
git config --global user.name $GIT_USER
git config --global user.email $GIT_EMAIL

if ! git diff --quiet HEAD -- "./$PIPELINE_DIR/$IDENTITY_TYPE.yaml" ; then
  git add ./$PIPELINE_DIR/$IDENTITY_TYPE.yaml
  git commit -m "📊 Add or Update pipeline."
  git push origin main
else
  echo "Nothing to commit."
fi
```

- Sets Git global user configuration (required for commits).
- Checks if the pipeline YAML file has changed:
  - If changed, commits and pushes updates.
  - If unchanged, skips the commit.

**6. Configure Azure DevOps CLI and Create Pipeline**

```bash
az devops configure --defaults organization=$AZDO_BASE_URL

az pipelines create \
    --name "$IDENTITY_TYPE-pipeline" \
    --description "This is a sample pipeline to use federated identity" \
    --repository $AZDO_PROJECT_NAME \
    --repository-type tfsgit \
    --branch main \
    --yaml-path $PIPELINE_DIR/$IDENTITY_TYPE.yaml \
    --project $AZDO_PROJECT_NAME
```

- Configures Azure DevOps CLI defaults for subsequent commands.
- Creates the Azure DevOps pipeline with the specified configuration:
  - `name`: Pipeline name (`sp-pipeline`).
  - `description`: Human-readable pipeline description.
  - `repository`: The Azure DevOps Git repository hosting the pipeline YAML.
  - `branch`: Branch to monitor (`main`).
  - `yaml-path`: Path to the pipeline YAML file.
  - `project`: Azure DevOps project name.

**✅ Complete scripts**

```bash
git clone https://$AZDO_ORGANIZATION_NAME@dev.azure.com/$AZDO_ORGANIZATION_NAME/$AZDO_PROJECT_NAME/_git/$AZDO_PROJECT_NAME
```

```bash
cd $AZDO_PROJECT_NAME

PIPELINE_DIR="pipelines"
IDENTITY_TYPE="sp"

# Create directory if not exists
if [ ! -d "$PIPELINE_DIR" ]; then
    mkdir $PIPELINE_DIR
fi

# Store pipeline
cat <<EOF > $PIPELINE_DIR/$IDENTITY_TYPE.yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: AzureCLI@2
  inputs:
    azureSubscription: '${AZDO_SERVICE_ENDPOINT_NAME}'
    scriptType: 'pscore'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az account show --query id -o tsv
EOF

# Commit pipeline
git config --global user.name $GIT_USER
git config --global user.email $GIT_EMAIL

if ! git diff --quiet HEAD -- "./$PIPELINE_DIR/$IDENTITY_TYPE.yaml" ; then
  git add ./$PIPELINE_DIR/$IDENTITY_TYPE.yaml
  git commit -m "📊 Add or Update pipeline."
  git push origin main
else
  echo "Nothing to commit."
fi
```

```bash
az devops configure --defaults organization=$AZDO_BASE_URL

az pipelines create \
    --name "$IDENTITY_TYPE-pipeline" \
    --description "This is a sample pipeline to use federated identity" \
    --repository $AZDO_PROJECT_NAME \
    --repository-type tfsgit \
    --branch main \
    --yaml-path $PIPELINE_DIR/$IDENTITY_TYPE.yaml \
    --project $AZDO_PROJECT_NAME

```

> **Note:** Ensure the pipeline has the setting **"Allow scripts to access the OAuth token"** enabled (`System.AccessToken`) under pipeline options.

---

#### Azure DevOps - Method 2: Azure Managed Identity

##### Azure DevOps - Create Managed Identity with Federated Credential


This script sets up an end-to-end secure integration between **Azure DevOps pipelines** and **Azure** using **User-Assigned Managed Identity** combined with **Federated Identity (OIDC)**. This allows Azure DevOps pipelines to securely authenticate to Azure without storing secrets directly.

**Detailed Steps:**

**Step 1: Define Variables**

Variables you customize at the top of the script:

- **Azure Subscription Info:**
  - `AZURE_SUBSCRIPTION_ID`: ID of your Azure subscription.
  - `AZURE_LOCATION`: Azure region (e.g., `westeurope`).

- **Azure DevOps Info:**
  - `AZDO_ORGANIZATION_NAME`: Your Azure DevOps organization name.
  - `AZDO_PROJECT_NAME`: Your Azure DevOps project name.
  - `AZDO_SERVICE_ENDPOINT_NAME`: Name of the Azure DevOps Service Connection.

- **Git Config (used later for pipeline commits):**
  - `GIT_USER`: Your Git username.
  - `GIT_EMAIL`: Your Git email.

**2️⃣ Azure Resource Group and Managed Identity Creation**

The script creates a resource group and managed identity for authentication:

```bash
az group create --location $AZURE_LOCATION --name $AZURE_RG

result=$(az identity create --name $ID_NAME --resource-group $AZURE_RG)

MI_ID=$(echo $result | jq -r '.id')                       
AAD_CLIENT_ID=$(echo $result | jq -r '.clientId')         
AAD_PRINICIPAL_ID=$(echo $result | jq -r '.principalId')  
AAD_TENANT_ID=$(echo $result | jq -r '.tenantId')         
```

- A **Resource Group** is created to host the Managed Identity.
- A **User-Assigned Managed Identity** is created:
  - `AAD_CLIENT_ID`: Used to authenticate from Azure DevOps.
  - `AAD_PRINICIPAL_ID`: Needed for Azure RBAC assignments.
  - `AAD_TENANT_ID`: Azure AD Tenant identifier.

**3️⃣ Assign RBAC Role to Managed Identity**

Assign the Managed Identity the `Contributor` role on the specified Azure subscription:

```bash
az role assignment create \
  --role "Contributor" \
  --assignee-object-id $AAD_PRINICIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --scope /subscriptions/$AZURE_SUBSCRIPTION_ID
```

This grants the Managed Identity permissions to perform Azure operations in your subscription.

**4️⃣ Azure DevOps Configuration**

Set Azure DevOps CLI defaults and ensure the project exists:

```bash
az devops configure --defaults organization=$AZDO_BASE_URL

if ! az devops project list | jq -e --arg PROJECT_NAME "$AZDO_PROJECT_NAME" '.value[] | select(.name == $PROJECT_NAME)' > /dev/null; then
  az devops project create \
    --name $AZDO_PROJECT_NAME \
    --description $AZDO_PROJECT_NAME \
    --visibility private
fi
```

- Configures Azure DevOps CLI context.
- Creates the Azure DevOps project if it doesn’t already exist.

**5️⃣ Create Azure DevOps Service Endpoint with Federated Identity**

A service endpoint configuration (`params.azdo.json`) is created using Managed Identity and OIDC federation:

- Authentication uses the scheme: `"WorkloadIdentityFederation"`.
- References the Managed Identity’s `clientId` and `tenantId`.

The script checks if the Service Endpoint exists, creates it if not:

```bash
if ! az devops service-endpoint list --project $AZDO_PROJECT_NAME | jq -e --arg SE_NAME "$AZDO_SERVICE_ENDPOINT_NAME" '.[] | select(.name == $SE_NAME)' > /dev/null; then
  result=$(az devops service-endpoint create \
    --service-endpoint-configuration params.azdo.json \
    --organization $AZDO_BASE_URL \
    --project $AZDO_PROJECT_NAME \
    --detect true)
  SERVICE_ENDPOINT_ID=$(echo $result | jq -r '.id')                                                                                                                                 
else  
  SERVICE_ENDPOINT_ID=$(az devops service-endpoint list \
    --project $AZDO_PROJECT_NAME | jq -r \
    --arg NAME "$AZDO_SERVICE_ENDPOINT_NAME" '.[] | select(.name==$NAME) | .id')
  
  result=$(az devops service-endpoint show \
    --project $AZDO_PROJECT_NAME \
    --id $SERVICE_ENDPOINT_ID)
fi
```

**6️⃣ Extracting Federated Credential Information**

From the Service Endpoint, it retrieves critical parameters needed for OIDC federation:

```bash
SERVICE_ENDPOINT_ISSUER=$(echo $result | jq -r '.authorization.parameters.workloadIdentityFederationIssuer')                                                                      
SERVICE_ENDPOINT_SUBJECT=$(echo $result | jq -r '.authorization.parameters.workloadIdentityFederationSubject')
```

- **Issuer**: The trusted OIDC token issuer URL from Azure DevOps.
- **Subject**: Unique identifier scoped specifically to your Azure DevOps service endpoint.

7️⃣ Create or Update Azure Managed Identity Federated Credential**

Using the issuer and subject obtained above, the script creates or updates the federated credential for the Managed Identity:

```bash
if ! az identity federated-credential list --identity-name $ID_NAME --resource-group $AZURE_RG | jq -e --arg NAME "$PARAMS_NAME" '.[] | select(.name == $NAME)' > /dev/null; then
  az identity federated-credential create \
    --identity-name $ID_NAME \
    --name $PARAMS_NAME \
    --resource-group $AZURE_RG \
    --audiences "api://AzureADTokenExchange" \
    --issuer $SERVICE_ENDPOINT_ISSUER \
    --subject $SERVICE_ENDPOINT_SUBJECT
else
  az identity federated-credential update \
    --identity-name $ID_NAME \
    --name $PARAMS_NAME \
    --resource-group $AZURE_RG \
    --audiences "api://AzureADTokenExchange" \
    --issuer $SERVICE_ENDPOINT_ISSUER \
    --subject $SERVICE_ENDPOINT_SUBJECT
fi
```

- Links the Managed Identity securely with Azure DevOps using OIDC federation.
- Ensures Azure DevOps Pipelines can authenticate securely without stored credentials.

**✅ Complete script**

```bash
# Variables

GIT_USER="Sujith Quintelier"
GIT_EMAIL="squintelier@company.com"

# Azure Subscription Id
AZURE_SUBSCRIPTION_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  
# Azure location
AZURE_LOCATION="westeurope"                                   
# Azure DevOps Project Name
AZDO_PROJECT_NAME="<myproject>"                                  
# Azure DevOps Organization Name
AZDO_ORGANIZATION_NAME="<myorg>"                           
# Azure DevOps Service Account Name
AZDO_SERVICE_ENDPOINT_NAME="<mysvcconnection>"                      

# Azure Resource Group
AZURE_RG="rg-$AZDO_PROJECT_NAME"                                         
# Managed Identity Name
ID_NAME="id-$AZDO_PROJECT_NAME"                                          
# squintelier|xpirit
AZDO_BASE_URL="https://dev.azure.com/$AZDO_ORGANIZATION_NAME"  # Azure DevOps base URL
# Azure Subscription Name
result=$(az account show -s $AZURE_SUBSCRIPTION_ID)
AZURE_SUBSCRIPTION_NAME=$(echo $result | jq -r '.name') 

# Set Azure DevOps defaults
result=$(az devops configure --defaults organization=$AZDO_BASE_URL)

# Create DevOps Project
if ! az devops project list | jq -e --arg PROJECT_NAME "$AZDO_PROJECT_NAME" '.value[] | select(.name == $PROJECT_NAME)' > /dev/null; then
  result=$(az devops project create --name $AZDO_PROJECT_NAME --description $AZDO_PROJECT_NAME --visibility private)
fi

# Create Resource Group
result=$(az group create --location $AZURE_LOCATION --name $AZURE_RG)

# Create Managed Identity
result=$(az identity create --name $ID_NAME --resource-group $AZURE_RG)

# Managed Identity Id
MI_ID=$(echo $result | jq -r '.id')                       
# AAD Application Id
AAD_CLIENT_ID=$(echo $result | jq -r '.clientId')         
# AAD Principal Id
AAD_PRINICIPAL_ID=$(echo $result | jq -r '.principalId')  
# AAD Tenant Id
AAD_TENANT_ID=$(echo $result | jq -r '.tenantId')         

# Role Assignment
#
# With Graph Permissions (uncomment below)
# az role assignment create --role "Contributor" --assignee $MI_ID --scope /subscriptions/$AZURE_SUBSCRIPTION_ID
# 
# Without Graph Permissions (uncomment below)
az role assignment create --role "Contributor" --assignee-object-id $AAD_PRINICIPAL_ID --assignee-principal-type ServicePrincipal --scope /subscriptions/$AZURE_SUBSCRIPTION_ID

# Create Service Endpoint Configuration params file params.azdo.json
cat <<EOF > params.azdo.json
{
  "data": {
    "subscriptionId": "${AZURE_SUBSCRIPTION_ID}",
    "subscriptionName": "$AZURE_SUBSCRIPTION_NAME"
  },
  "authorization": {
    "parameters": {
        "serviceprincipalid": "${AAD_CLIENT_ID}",
        "tenantid": "${AAD_TENANT_ID}"
    },
    "scheme": "WorkloadIdentityFederation"
  },
  "description": "${AZDO_SERVICE_ENDPOINT_NAME}",
  "name": "${AZDO_SERVICE_ENDPOINT_NAME}",
  "serviceEndpointProjectReferences": [
    {
      "description": "${AZDO_SERVICE_ENDPOINT_NAME}",
      "name": "${AZDO_SERVICE_ENDPOINT_NAME}",
      "projectReference": {
        "name": "${AZDO_PROJECT_NAME}"
      }
    }
  ],
  "type": "azurerm",
  "url": "https://management.azure.com/"
}
EOF

# Create Or Get Service Endpoint

if ! az devops service-endpoint list --project $AZDO_PROJECT_NAME | jq -e --arg SE_NAME "$AZDO_SERVICE_ENDPOINT_NAME" '.[] | select(.name == $SE_NAME)' > /dev/null; then
  result=$(az devops service-endpoint create --service-endpoint-configuration params.azdo.json --organization $AZDO_BASE_URL --project $AZDO_PROJECT_NAME --detect true)
  # Service Endpoint Id
  SERVICE_ENDPOINT_ID=$(echo $result | jq -r '.id')                                                                                                                                 
else  
  # Service Endpoint Id
  SERVICE_ENDPOINT_ID=$(az devops service-endpoint list --project $AZDO_PROJECT_NAME | jq -r --arg NAME "$AZDO_SERVICE_ENDPOINT_NAME" '.[] | select(.name==$NAME) | .id')
  result=$(az devops service-endpoint show --project $AZDO_PROJECT_NAME --id $SERVICE_ENDPOINT_ID)
fi

# Service Endpoint Issuer
SERVICE_ENDPOINT_ISSUER=$(echo $result | jq -r '.authorization.parameters.workloadIdentityFederationIssuer')                                                                      
# Service Endpoint Subject
SERVICE_ENDPOINT_SUBJECT=$(echo $result | jq -r '.authorization.parameters.workloadIdentityFederationSubject')                                                                    

# Create Federated Credential Configuration params file params.json
PARAMS_NAME="$AZDO_PROJECT_NAME-federated-identity"
PARAMS_ISSUER="${SERVICE_ENDPOINT_ISSUER}"
PARAMS_SUBJECT="${SERVICE_ENDPOINT_SUBJECT}"
PARAMS_DESCRIPTION="Federation for Service Connection $AZDO_SERVICE_ENDPOINT_NAME in $AZDO_BASE_URL/$AZDO_PROJECT_NAME/_settings/adminservices?resourceId=$SERVICE_ENDPOINT_ID"

# Create Or Update Federated Credential
if ! az identity federated-credential list --identity-name $ID_NAME --resource-group $AZURE_RG | jq -e --arg NAME "$PARAMS_NAME" '.[] | select(.name == $NAME)' > /dev/null; then
  result=$(az identity federated-credential create --identity-name $ID_NAME --name $PARAMS_NAME  --resource-group $AZURE_RG --audiences "api://AzureADTokenExchange" --issuer $SERVICE_ENDPOINT_ISSUER --subject $PARAMS_SUBJECT)
else
  result=$(az identity federated-credential update --identity-name $ID_NAME --name $PARAMS_NAME  --resource-group $AZURE_RG --audiences "api://AzureADTokenExchange" --issuer $SERVICE_ENDPOINT_ISSUER --subject $PARAMS_SUBJECT)
fi

```

##### Azure DevOps YAML Pipeline (Managed Identity)

```bash

git clone https://$AZDO_ORGANIZATION_NAME@dev.azure.com/$AZDO_ORGANIZATION_NAME/$AZDO_PROJECT_NAME/_git/$AZDO_PROJECT_NAME
```

```bash
cd $AZDO_PROJECT_NAME

PIPELINE_DIR="pipelines"
IDENTITY_TYPE="mi"

# Create directory if not exists
if [ ! -d "$PIPELINE_DIR" ]; then
    mkdir $PIPELINE_DIR
fi

# Store pipeline
cat <<EOF > $PIPELINE_DIR/$IDENTITY_TYPE.yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: AzureCLI@2
  inputs:
    azureSubscription: '${AZDO_SERVICE_ENDPOINT_NAME}'
    scriptType: 'pscore'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az account show --query id -o tsv
EOF

# Commit pipeline
git config --global user.name $GIT_USER
git config --global user.email $GIT_EMAIL

if ! git diff --quiet HEAD -- "./$PIPELINE_DIR/$IDENTITY_TYPE.yaml" ; then
  git add ./$PIPELINE_DIR/$IDENTITY_TYPE.yaml
  git commit -m "📊 Add or Update pipeline."
  git push origin main
else
  echo "Nothing to commit."
fi
```

```bash
az devops configure --defaults organization=$AZDO_BASE_URL

az pipelines create \
    --name "$IDENTITY_TYPE-pipeline" \
    --description "This is a sample pipeline to use federated identity" \
    --repository $AZDO_PROJECT_NAME \
    --repository-type tfsgit \
    --branch main \
    --yaml-path $PIPELINE_DIR/$IDENTITY_TYPE.yaml \
    --project $AZDO_PROJECT_NAME

```

> **Important:**  
>
> - Ensure **"Allow scripts to access the OAuth token"** is enabled to access the federated token in pipeline tasks.
> - `$(System.AccessToken)` provides the pipeline identity token securely without storing any secrets.

---

## Best Practices

- **Use Azure AD Federated Credentials:** Configure pipelines to authenticate via Azure AD federated credentials rather than storing secrets directly.
- **Enforce Least Privilege:** Assign minimal necessary permissions to identities used by pipelines.
- **Regular Audits:** Frequently audit access logs and credential configurations to ensure ongoing security.

---

## Conclusion

Implementing federated identity within your CI/CD pipelines enhances security, reduces complexity, and prevents secret sprawl. Leveraging Azure AD integration with GitHub Actions and Azure DevOps pipelines provides a robust, scalable, and secure approach to managing authentication without compromising operational efficiency.
