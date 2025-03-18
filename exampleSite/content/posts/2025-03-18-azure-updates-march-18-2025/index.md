+++
title = "🔄 Azure updates for March 18, 2025"
slug = "azure-updates-march-18-2025"
date = '2025-03-18 07:00:00Z'
draft = false
tags = [
  "Azure",
  "AKS",
  "Azure Kubernetes Service",
  "Kubenet",
  "Azure Spring Apps",
  "Retirement",
  "Migration",
  "Cloud",
  "Kubernetes",
  "Azure Container Apps"
]
categories = [
  "Azure Updates",
  "Cloud Computing",
  "Kubernetes",
  "Service Retirement"
]
series = [
  "Azure Updates"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    
description = "Stay up to date with the latest Azure changes. This edition covers the retirement of Kubenet networking for Azure Kubernetes Service and Azure Spring Apps, including key dates, migration recommendations, and required actions."

+++

## **Introduction: Azure Changelog – Latest Updates & Enhancements**  

Welcome to the Azure Changelog, your go-to source for the latest updates and enhancements in Microsoft Azure. In this edition, we will cover the most recent changes and improvements made to Azure services, tools, and features. Stay informed about the latest developments in the Azure ecosystem to optimize your cloud experience.

### Kubenet Networking for Azure Kubernetes Service Retires on March 31, 2028  

Azure Kubernetes Service (AKS) will officially retire **kubenet networking** on **March 31, 2028**. After this date, workloads using kubenet will no longer be supported, so it's essential to migrate in advance to avoid disruptions.  

Microsoft recommends transitioning to **Azure Container Networking Interface (CNI) overlay**, which offers the same IP address overlay architecture as kubenet while providing improved scalability and new capabilities. Follow the [upgrade guide](https://learn.microsoft.com/azure/aks/upgrade-aks-ipam-and-dataplane) to ensure a smooth migration before the deadline.

### Azure Spring Apps Retirement: Service Ends on March 31, 2028  

Microsoft has announced the **retirement of Azure Spring Apps**, including the **Basic, Standard, and Enterprise plans**, with a **final retirement date of March 31, 2028**.  

#### Key Dates  

- **March 17, 2025** – Azure Spring Apps enters a **three-year sunset period**. New customers will no longer be able to sign up.  
- **March 31, 2028** – All Azure Spring Apps plans will be **fully retired**, and instances will no longer be accessible.  

#### Migration Recommendations  

To ensure continued performance, scalability, and cost efficiency, Microsoft recommends migrating workloads to **[Azure Container Apps](https://azure.microsoft.com/en-us/products/container-apps/?msockid=2d9407b2d07368ad23631375d1ac693e)** or **[Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/products/kubernetes-service/)** before the retirement date.  

#### Required Action  

To prevent service disruptions, **plan and execute your migration** before March 31, 2028. Microsoft provides **migration tools, expert resources, and technical support** to assist with the transition.  

For detailed migration guidance, review the **[official retirement document](https://aka.ms/asaretirement)**.
