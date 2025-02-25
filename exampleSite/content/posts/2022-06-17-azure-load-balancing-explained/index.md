+++
title = '🔍 Azure Load Balancing Explained: Choosing the Right Option'
date = '2022-06-17 06:00:00Z'
draft = false
tags = [
  "Azure",
  "Azure Load Balancer",
  "Azure Traffic Manager",
  "Azure Application Gateway",
  "Azure Front Door",
  "Load Balancing",
  "Networking",
  "Cloud Infrastructure",
  "Global Traffic Routing",
  "Layer 4 vs Layer 7",
  "High Availability",
  "Scalability",
  "Performance Optimization",
  "DNS Routing",
  "Web Application Security"
]
categories = [
  'Professional Experience',
  'Technical Skills',
  # 'Certifications & Training',
  # 'Projects & Contributions',
  # 'Speaking & Training',
  'Publications & Writing',
  # 'Education',
  # 'Community Engagement'
]
series = [
  'Azure in Practice',
  # 'Azure DevOps in Practice',
  # 'Infrastructure as Code (IaC) Essentials',
  'Optimizing Cloud Deployments',
  # 'Building & Deploying .NET Apps',
  # 'GitHub & DevOps',
  'Performance & Scaling in the Cloud',
  # 'Advent of Code Solutions',
  # 'Hugo Website Development',
  # 'PowerShell for DevOps',
  # 'Workshops & Training'
]

layout = 'single'
[params]
    cover = true
    author = 'sujith'
    
+++

# **Azure Load Balancing Explained: Choosing the Right Option**

## **What is Load Balancing?**  

Load balancing is the **even distribution of network traffic** across a group of backend computing resources or servers. The primary goals of load balancing are:  

✅ **Optimizing resource utilization**  
✅ **Maximizing throughput & performance**  
✅ **Minimizing response time**  
✅ **Ensuring high availability**  
✅ **Preventing overload on a single resource**  

In **Azure**, there are multiple load-balancing options, each designed for different **traffic types and use cases**.  

---

## **🔍 Azure Load Balancing Options**  

| **Service** | **Scope** | **Recommended for** | **Layer** |  
|------------|----------|--------------------|----------|  
| **Azure Load Balancer** | Regional | Non-HTTP(S) workloads | Layer 4 |  
| **Traffic Manager** | Global | DNS-based traffic routing | Layer 7 (DNS) |  
| **Azure Application Gateway** | Regional | HTTP(S) web traffic | Layer 7 |  
| **Azure Front Door** | Global | Web applications, API acceleration | Layer 7 |  

{{< image src="img/load-balancing-decision-tree.png" alt="Load Balancing Decision Tree" caption="Load Balancing Decision Tree" >}}

Now, let’s explore each of these services in detail.  

---

## **🌍 Azure Load Balancer (ALB)**  

{{< image src="img/azure-load-balancer.png" alt="Azure Load Balancer" caption="Azure Load Balancer" >}}

**Azure Load Balancer** is a **Layer 4 (TCP/UDP)** load-balancing service designed for **high-performance and ultra-low-latency traffic**. It efficiently distributes inbound and outbound traffic while ensuring high availability across **Availability Zones**.  

### **Types of Azure Load Balancers**  

| **Type** | **Purpose** |  
|----------|------------|  
| **Public Load Balancer** | Distributes **internet-facing** traffic across VMs in a VNet. |  
| **Internal Load Balancer** | Distributes **private network traffic** within Azure. |  

{{< image src="img/alb-public-internal.png" alt="ALB Public vs Internal" caption="ALB Public vs Internal" >}}

### **Availability Zone Configurations**  

| **Mode** | **Behavior** |  
|---------|------------|  
| **Zone Redundant** | Uses a single IP, surviving zone failures. |  
| **Zonal** | Restricts traffic to a specific zone. |  

{{< image src="img/alb-zone-redundant.png" alt="ALB Zone Redundant" caption="ALB Zone Redundant" >}}  

### **Standard vs. Basic Load Balancer**  

| **Feature** | **Standard** | **Basic** |  
|------------|------------|--------|  
| Backend pool size | **1000** VMs | **300** VMs |  
| Health probes | TCP, HTTP, HTTPS | TCP, HTTP |  
| Secure by default | ✅ **Yes** | ❌ No |  
| HA Ports | ✅ Available | ❌ Not available |  
| SLA | ✅ **99.99%** | ❌ Not available |  

---

## **🌐 Azure Traffic Manager (ATM)**  

{{< image src="img/azure-traffic-manager.png" alt="Azure Traffic Manager" caption="Azure Traffic Manager" >}}  


**Traffic Manager** is a **DNS-based global load balancer**, designed to distribute traffic across **multiple Azure regions**. It **does not directly route traffic**—instead, it resolves requests to the nearest **healthy backend**.  

### **How It Works**  

1️⃣ A client requests a domain (e.g., `app.contoso.com`).  
2️⃣ The DNS system redirects to `contoso.trafficmanager.net`.  
3️⃣ Traffic Manager selects a backend using **health checks & routing rules**.  
4️⃣ The client receives the IP of the closest, available backend and connects directly.  

{{< image src="img/tm-setup.png" alt="Azure Traffic Manager Setup" caption="Azure Traffic Manager Setup" >}}  


### **Routing Methods**  

| **Routing Method** | **Use Case** |  
|------------------|-------------|  
| **Priority** | Primary backend with failover options. |  
| **Weighted** | Distribute traffic based on weights. |  
| **Performance** | Route traffic to the closest backend. |  
| **Geographic** | Route traffic based on user location. |  
| **MultiValue** | Return multiple healthy endpoints. |  
| **Subnet** | Route based on user IP ranges. |  

{{< image src="img/tm-weighted.png" alt="Traffic Manager Routing" caption="Traffic Manager Routing" >}}  

**Traffic Manager is ideal for:**  
✔️ **Failover between Azure regions**  
✔️ **Multi-region deployments**  
✔️ **Hybrid cloud environments**  

---

## **🔹 Azure Application Gateway (APG)**  

{{< image src="img/azure-application-gateway.png" alt="Azure Application Gateway" caption="Azure Application Gateway" >}}  


**Application Gateway** is a **Layer 7 load balancer** designed specifically for **HTTP(S) traffic**. It provides advanced **web traffic routing**, **SSL offloading**, and **Web Application Firewall (WAF) integration**.  

### **Key Features**  

✅ **Path-based routing** → Direct requests to different backends based on URL paths.  
✅ **Session affinity** → Keep users connected to the same backend server.  
✅ **SSL Termination** → Offload SSL decryption to reduce backend CPU usage.  
✅ **Autoscaling** → Dynamically scale based on traffic load.  

{{< image src="img/apg-general.png" alt="Application Gateway Flow" caption="Application Gateway Flow" >}}  

**Best for:**  
✔️ **Web applications** that require advanced traffic routing.  
✔️ **Security-conscious deployments** using **WAF protection**.  

---

## **🌎 Azure Front Door (AFD)**  

{{< image src="img/azure-front-door.png" alt="Azure Front Door" caption="Azure Front Door" >}}  

**Azure Front Door** is a **global Layer 7** service that combines **load balancing, caching, acceleration, and security** into one solution. It ensures **high availability and low-latency** for web applications.  

### **Key Capabilities**  

✅ **Global HTTP(S) load balancing** → Route traffic to the nearest healthy region.  
✅ **SSL offloading & URL rewriting** → Enhance security & performance.  
✅ **Caching & acceleration** → Reduce latency via **Edge locations**.  
✅ **DDoS Protection & WAF** → Secure web apps from threats.  

💡 **Front Door vs. Traffic Manager:**  
🔹 **Front Door** → Routes traffic in **real-time** based on latency.  
🔹 **Traffic Manager** → Routes via **DNS resolution**, which is slower due to caching.  

**Best for:**  
✔️ **Global applications** that need low latency.  
✔️ **Web APIs** requiring intelligent traffic routing.  

---

## **🌍 Global vs. Regional Load Balancing**  

| **Service** | **Scope** | **Use Case** |  
|------------|----------|------------|  
| **Azure Front Door** | **Global** | HTTP(S) traffic acceleration & load balancing. |  
| **Traffic Manager** | **Global** | DNS-based traffic routing. |  
| **Application Gateway** | **Regional** | Web application load balancing. |  
| **Azure Load Balancer** | **Regional** | Non-HTTP(S) workloads. |  

### **💡 When to Choose Which?**  

| **Scenario** | **Recommended Service** |  
|------------|---------------------|  
| Distribute **global HTTP(S) traffic** | **Azure Front Door** |  
| Route traffic between **regions via DNS** | **Traffic Manager** |  
| Load balance **internal traffic** within Azure | **Azure Load Balancer** |  
| Optimize **web application performance** | **Azure Application Gateway** |  

---

## **📌 Final Thoughts**  

Azure offers **multiple load balancing solutions**, each designed for specific **traffic types, regions, and use cases**. Whether you're **building a global web application** or **optimizing regional traffic**, choosing the **right service** is key to maximizing **performance, availability, and security**.  

💡 **Summary:**  
✔️ **Use Front Door** for global **web acceleration**.  
✔️ **Use Traffic Manager** for **DNS-based failover**.  
✔️ **Use Application Gateway** for **web app security & routing**.  
✔️ **Use Azure Load Balancer** for **high-performance, low-latency workloads**.  
