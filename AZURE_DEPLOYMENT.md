# 🚀 Azure Deployment Guide for AutoDrive AI

This guide provides comprehensive instructions for deploying AutoDrive AI to Microsoft Azure using multiple deployment methods.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Option 1: Azure Static Web Apps (Recommended)](#option-1-azure-static-web-apps-recommended)
- [Deployment Option 2: Azure Container Instances](#option-2-azure-container-instances)
- [Deployment Option 3: Azure App Service](#option-3-azure-app-service)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Steps](#post-deployment-steps)
- [Monitoring and Management](#monitoring-and-management)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

1. **Azure Account**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one
2. **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
3. **GitHub Account**: For automated deployments via GitHub Actions
4. **Anthropic API Key**: Get it from [Anthropic Console](https://console.anthropic.com/)
5. **Node.js 16+**: For local testing

### Install Azure CLI

**Windows:**
```powershell
winget install -e --id Microsoft.AzureCLI
```

**macOS:**
```bash
brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Login to Azure

```bash
az login
az account show  # Verify your subscription
```

---

## Option 1: Azure Static Web Apps (Recommended)

Azure Static Web Apps is the **recommended approach** for React applications. It provides:
- ✅ Global CDN distribution
- ✅ Automatic SSL certificates
- ✅ Custom domains
- ✅ Staging environments for PRs
- ✅ Free tier available

### Step 1: Create Static Web App via Azure Portal

1. Navigate to [Azure Portal](https://portal.azure.com/)
2. Click **"Create a resource"** → Search for **"Static Web App"**
3. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `autodrive-ai` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Deployment details**:
     - **Source**: GitHub
     - **Organization**: Your GitHub username
     - **Repository**: `AutoDrive-ai`
     - **Branch**: `master` or `main`
   - **Build Details**:
     - **Build Presets**: React
     - **App location**: `/`
     - **Api location**: *(leave empty)*
     - **Output location**: `build`

4. Click **"Review + create"** → **"Create"**

### Step 2: Configure GitHub Secrets

After creation, Azure will automatically add a workflow file to your repository. You need to add the Anthropic API key:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add the following secrets:
   - **Name**: `REACT_APP_ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key

### Step 3: Deploy

The deployment happens automatically:
- Push to `master`/`main` branch triggers production deployment
- Pull requests create staging environments

```bash
git add .
git commit -m "Configure Azure deployment"
git push origin master
```

### Step 4: Monitor Deployment

1. Go to **GitHub Actions** tab in your repository
2. Watch the deployment workflow
3. Once complete, visit the URL provided by Azure (e.g., `https://autodrive-ai.azurestaticapps.net`)

---

## Option 2: Azure Container Instances

For containerized deployments using Docker.

### Step 1: Build and Push Docker Image

```bash
# Login to Azure Container Registry
az acr create --resource-group autodrive-rg --name autodriveacr --sku Basic
az acr login --name autodriveacr

# Build and push the Docker image
docker build -t autodriveacr.azurecr.io/autodrive-ai:latest .
docker push autodriveacr.azurecr.io/autodrive-ai:latest
```

### Step 2: Create Container Instance

```bash
# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name autodriveacr --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name autodriveacr --query passwords[0].value -o tsv)

# Create container instance
az container create \
  --resource-group autodrive-rg \
  --name autodrive-ai-container \
  --image autodriveacr.azurecr.io/autodrive-ai:latest \
  --registry-login-server autodriveacr.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --dns-name-label autodrive-ai \
  --ports 80 \
  --environment-variables \
    REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
```

### Step 3: Access Your Application

```bash
# Get the FQDN
az container show --resource-group autodrive-rg --name autodrive-ai-container --query ipAddress.fqdn -o tsv
```

Visit `http://[your-fqdn]`

---

## Option 3: Azure App Service

For traditional web app hosting with scaling capabilities.

### Step 1: Create App Service Plan

```bash
# Create resource group
az group create --name autodrive-rg --location eastus

# Create App Service plan (Linux)
az appservice plan create \
  --name autodrive-plan \
  --resource-group autodrive-rg \
  --sku B1 \
  --is-linux
```

### Step 2: Create Web App

```bash
# Create web app with Node.js runtime
az webapp create \
  --resource-group autodrive-rg \
  --plan autodrive-plan \
  --name autodrive-ai-app \
  --runtime "NODE|18-lts"
```

### Step 3: Configure Deployment from GitHub

```bash
# Configure GitHub deployment
az webapp deployment source config \
  --name autodrive-ai-app \
  --resource-group autodrive-rg \
  --repo-url https://github.com/yourusername/AutoDrive-ai \
  --branch master \
  --manual-integration
```

### Step 4: Configure App Settings

```bash
# Set environment variables
az webapp config appsettings set \
  --resource-group autodrive-rg \
  --name autodrive-ai-app \
  --settings \
    REACT_APP_ANTHROPIC_API_KEY=your_api_key_here \
    WEBSITE_NODE_DEFAULT_VERSION=18-lts \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### Step 5: Access Your App

```bash
az webapp browse --name autodrive-ai-app --resource-group autodrive-rg
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
REACT_APP_ENV=production
REACT_APP_API_ENDPOINT=https://api.anthropic.com/v1/messages
REACT_APP_MODEL_NAME=claude-sonnet-4-20250514
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use Azure Key Vault** for production secrets:

```bash
# Create Key Vault
az keyvault create \
  --name autodrive-keyvault \
  --resource-group autodrive-rg \
  --location eastus

# Store secret
az keyvault secret set \
  --vault-name autodrive-keyvault \
  --name anthropic-api-key \
  --value "your-api-key"

# Grant access to your app
az webapp identity assign \
  --resource-group autodrive-rg \
  --name autodrive-ai-app

# Reference in app settings
az webapp config appsettings set \
  --resource-group autodrive-rg \
  --name autodrive-ai-app \
  --settings \
    REACT_APP_ANTHROPIC_API_KEY="@Microsoft.KeyVault(SecretUri=https://autodrive-keyvault.vault.azure.net/secrets/anthropic-api-key/)"
```

---

## Post-Deployment Steps

### 1. Configure Custom Domain (Optional)

**For Static Web Apps:**
```bash
az staticwebapp hostname set \
  --name autodrive-ai \
  --resource-group autodrive-rg \
  --hostname www.yourdomain.com
```

**For App Service:**
```bash
az webapp config hostname add \
  --webapp-name autodrive-ai-app \
  --resource-group autodrive-rg \
  --hostname www.yourdomain.com
```

### 2. Enable SSL/HTTPS

Azure automatically provides SSL certificates for:
- `*.azurestaticapps.net` (Static Web Apps)
- `*.azurewebsites.net` (App Service)

For custom domains, Azure provides free managed certificates.

### 3. Configure CORS (if needed)

```bash
az webapp cors add \
  --resource-group autodrive-rg \
  --name autodrive-ai-app \
  --allowed-origins "https://yourdomain.com"
```

### 4. Set Up Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app autodrive-insights \
  --location eastus \
  --resource-group autodrive-rg

# Link to your app
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app autodrive-insights \
  --resource-group autodrive-rg \
  --query instrumentationKey -o tsv)

az webapp config appsettings set \
  --resource-group autodrive-rg \
  --name autodrive-ai-app \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY
```

---

## Monitoring and Management

### View Logs

**Static Web Apps:**
```bash
az staticwebapp show --name autodrive-ai --resource-group autodrive-rg
```

**App Service:**
```bash
# Stream live logs
az webapp log tail --name autodrive-ai-app --resource-group autodrive-rg

# Download logs
az webapp log download --name autodrive-ai-app --resource-group autodrive-rg
```

### Scaling

**App Service (Manual):**
```bash
az appservice plan update \
  --name autodrive-plan \
  --resource-group autodrive-rg \
  --sku P1V2
```

**App Service (Auto-scale):**
```bash
az monitor autoscale create \
  --resource-group autodrive-rg \
  --resource autodrive-plan \
  --resource-type Microsoft.Web/serverFarms \
  --name autoscale-plan \
  --min-count 1 \
  --max-count 5 \
  --count 1
```

### Cost Management

**View costs:**
```bash
az consumption usage list \
  --start-date 2025-01-01 \
  --end-date 2025-01-31
```

**Set budget alerts:**
```bash
az consumption budget create \
  --amount 50 \
  --budget-name autodrive-budget \
  --category cost \
  --time-grain monthly \
  --time-period start=2025-01-01
```

---

## Troubleshooting

### Issue: Build Fails

**Solution:** Check the build logs in GitHub Actions or Azure Portal.

```bash
# View deployment logs
az webapp log deployment show \
  --name autodrive-ai-app \
  --resource-group autodrive-rg
```

### Issue: API Key Not Working

**Solution:** Verify environment variables are set correctly.

```bash
# List all app settings
az webapp config appsettings list \
  --name autodrive-ai-app \
  --resource-group autodrive-rg
```

### Issue: CORS Errors

**Solution:** Add your domain to CORS allowed origins.

```bash
az webapp cors add \
  --resource-group autodrive-rg \
  --name autodrive-ai-app \
  --allowed-origins "*"  # Use specific domain in production
```

### Issue: Slow Performance

**Solutions:**
1. Enable CDN for Static Web Apps (automatic)
2. Use Application Insights to identify bottlenecks
3. Implement caching headers (already configured in `nginx.conf`)
4. Scale up your App Service plan

### Common Error Messages

| Error | Solution |
|-------|----------|
| `Deployment failed` | Check GitHub Actions logs, verify build succeeds locally |
| `502 Bad Gateway` | App is starting, wait 2-3 minutes or check logs |
| `API rate limit exceeded` | Review Anthropic API usage, implement rate limiting |
| `CORS policy error` | Configure CORS settings as shown above |

---

## Cost Estimates

### Static Web Apps (Recommended)
- **Free tier**: $0/month (100 GB bandwidth, custom domains, SSL)
- **Standard tier**: $9/month (unlimited bandwidth, SLA)

### App Service
- **B1 tier**: ~$13/month (1 core, 1.75 GB RAM)
- **P1V2 tier**: ~$85/month (1 core, 3.5 GB RAM, production workloads)

### Container Instances
- **1 vCPU, 1.5 GB**: ~$35/month (pay-per-second)

### Additional Costs
- **Application Insights**: First 5 GB/month free
- **Key Vault**: $0.03 per 10,000 operations
- **Bandwidth**: First 100 GB outbound free

---

## Support and Resources

- **Azure Documentation**: [docs.microsoft.com/azure](https://docs.microsoft.com/azure)
- **Azure Static Web Apps Docs**: [docs.microsoft.com/azure/static-web-apps](https://docs.microsoft.com/azure/static-web-apps)
- **Anthropic API Docs**: [docs.anthropic.com](https://docs.anthropic.com)
- **Azure Support**: [azure.microsoft.com/support](https://azure.microsoft.com/support)

---

## Quick Reference Commands

### Deploy to Static Web Apps (CLI)
```bash
# One-time setup
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy --app-location ./ --output-location build
```

### Update Environment Variables
```bash
# Static Web Apps
az staticwebapp appsettings set \
  --name autodrive-ai \
  --setting-names REACT_APP_ANTHROPIC_API_KEY=new_value

# App Service
az webapp config appsettings set \
  --resource-group autodrive-rg \
  --name autodrive-ai-app \
  --settings REACT_APP_ANTHROPIC_API_KEY=new_value
```

### Delete Resources
```bash
# Delete entire resource group (careful!)
az group delete --name autodrive-rg --yes --no-wait

# Delete specific app
az staticwebapp delete --name autodrive-ai --resource-group autodrive-rg
```

---

**Deployment Complete! 🎉**

Your AutoDrive AI application is now running on Azure. Visit your deployment URL and start exploring!

For questions or issues, please open an issue on GitHub or contact Azure support.
