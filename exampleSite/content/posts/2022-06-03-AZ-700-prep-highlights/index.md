+++
title = '📘 AZ-700 Prep Highlights'
slug = 'az-700-prep-highlights'
date = '2022-06-03 06:00:00Z'
draft = false
tags = [
  "Azure",
  "Azure Networking",
  "AZ-700",
  "Virtual Networks",
  "VNets",
  "Subnetting",
  "Network Security",
  "VNet Peering",
  "Hybrid Networking",
  "Azure DNS",
  "Public IPs",
  "Azure Load Balancer",
  "Traffic Routing",
  "Gateway Transit",
  "User Defined Routes",
  "Cloud Networking",
  "Azure Certification"
]
categories = [ 'Certifications & Training' ]
series = [ 'Workshops and Training' ]

layout = 'single'
[params]
    cover = true
    author = 'sujith'

description = "Discover key highlights and essential tips for preparing for the AZ-700 certification exam. Enhance your knowledge and boost your chances of success."
    
+++

This blog post captures my notes from the **AZ-700** course, which is designed to teach **Network Engineers** how to design, implement, and maintain **Azure networking solutions**. The course covers a wide range of networking topics, including:

- **Designing, implementing, and managing** core Azure networking infrastructure  
- **Hybrid networking** connections for on-premises integration  
- **Load balancing** strategies for optimizing traffic distribution  
- **Routing and private access** to Azure services  
- **Network security** and traffic filtering  
- **Monitoring and troubleshooting** network connectivity  

## **1. Virtual Networks (VNets)**

Azure **Virtual Networks (VNets)** are the backbone of networking in Azure, allowing resources to communicate securely.  

### **VNet Capabilities**  

Azure VNets support:  
✅ Communication with the internet  
✅ Communication between Azure resources  
✅ Secure connectivity to on-premises networks  
✅ Traffic filtering using **NSGs** (Network Security Groups)  
✅ Routing network traffic efficiently  

### **VNet Address Space**  

Azure VNets use **private IP address ranges** as defined in **RFC 1918**:  

| IP Range | Prefix |  
|----------|--------|  
| 10.0.0.0 - 10.255.255.255 | 10/8 |  
| 172.16.0.0 - 172.31.255.255 | 172.16/12 |  
| 192.168.0.0 - 192.168.255.255 | 192.168/16 |  

### **Subnet Allocation**  

Azure **reserves 5 IPs** per subnet:  
🔹 `x.x.x.0` → Network address  
🔹 `x.x.x.1` → Default gateway  
🔹 `x.x.x.2 & x.x.x.3` → Azure DNS mapping  
🔹 `x.x.x.255` → Broadcast address  

## **2. Scopes in Azure**  

In Azure, every resource must have a **unique name** within its defined scope. Scopes are hierarchical:  

1️⃣ **Global** (e.g., Storage Accounts)  
2️⃣ **Management Group**  
3️⃣ **Subscription**  
4️⃣ **Resource Group** (e.g., VNets)  
5️⃣ **Resource** (individual resource instances)  

## **3. Regions & Availability Zones**  

### **Regions & Subscriptions**  

- Resources in a **VNet must be in the same region**, but cross-region connectivity is possible.  
- VNets can be **linked across different subscriptions**.  

### **Availability Zones (AZs)**  

Availability Zones provide **high availability** by distributing resources across **physically separate data centers** within a region.  

🔹 **Zonal Services** → Resources pinned to a specific zone  
🔹 **Zone-Redundant Services** → Automatically replicated across zones  
🔹 **Non-Regional Services** → Resilient to zone-wide and region-wide failures  

## **4. Public IPs in Azure**  

Public IPs enable external communication for Azure resources. They can be **static** (unchanging) or **dynamic** (reassigned upon restart).  

| **Public IP Type** | **Allocation** | **Security** | **Zone Support** |  
|--------------------|--------------|-------------|----------------|  
| **Basic SKU** | Static / Dynamic | Open by default | ❌ No AZ support |  
| **Standard SKU** | Static only | Secure by default (NSG required) | ✅ Zone-redundant |  

## **5. DNS Resolution in Azure**  

Azure provides both **public and private DNS services** to resolve domain names.  

{{< image src="img/hybrid-dns-infra.png" caption="DNS" alt="DNS" >}}

### **Public DNS**  

Azure DNS manages **internet-facing** domain names and supports:  
🔹 **A / AAAA** records for IPv4/IPv6  
🔹 **CNAME** records for aliasing domains  

### **Private DNS**  

For internal name resolution within VNets, Azure supports:  
1️⃣ **Azure DNS Private Zones**  
2️⃣ **Azure-provided name resolution**  
3️⃣ **Custom DNS servers**  

🔹 Azure's built-in DNS resolver: `168.63.129.16`  

DNS forwarding allows **on-premises resources** to resolve Azure hostnames, ensuring seamless hybrid connectivity.  

📌 **Example: Conditional Forwarding**  
To resolve hostnames across VNets, use **custom DNS servers** with **conditional forwarding rules**.  

## **6. VNet Peering for Cross-Network Connectivity**  

Azure **VNet Peering** allows seamless communication between VNets without a VPN.  

| **Peering Type** | **Scope** | **Performance** |  
|-----------------|----------|--------------|  
| **Regional Peering** | Same Azure region | High bandwidth, low latency |  
| **Global Peering** | Cross-region | Uses Azure backbone |  

### **VNet Peering Benefits**  

✅ Secure private communication (no internet exposure)  
✅ No need for VPN gateways  
✅ **Supports NSGs** for access control  
✅ Works across **subscriptions and tenants**  

{{< image src="img/peering.jpg" caption="Peering" alt="Peering" >}}

## **7. Gateway Transit for Shared VPN Access**  

**Gateway Transit** allows one VNet to use another VNet’s **VPN gateway** for cross-premises connectivity.  

💡 **Use case**: A hub-and-spoke topology where a single gateway in the hub VNet provides VPN access to multiple spokes.  

{{< image src="img/gatewaytransit.png" alt="Gateway Transit" caption="Gateway Transit" >}}

## **8. Azure Traffic Routing**  

Azure manages traffic routing through:  

### **1️⃣ System Routes** (default routes created by Azure)  

🔹 Internet traffic → Sent via the default **Internet Gateway**  
🔹 Private traffic → Stays within the **VNet**  

### **2️⃣ Custom Routes (UDRs - User Defined Routes)**  

Use **route tables** to override system routes.  
💡 Example: Direct traffic to a **firewall appliance** instead of the default gateway.  

### **Default Route Table**  

| **Source** | **Destination** | **Next Hop** |  
|-----------|--------------|------------|  
| Default | 0.0.0.0/0 | Internet |  
| Default | 10.0.0.0/8 | None |  
| Default | 192.168.0.0/16 | None |  

---

## **Final Thoughts**  

This post provides a **comprehensive summary** of key **Azure networking concepts** from **AZ-700**. Understanding **VNets, peering, DNS, and routing** is essential for designing **scalable, secure, and high-performing** cloud networks.  

📌 **Key Takeaways:**  
✅ **Master VNet and subnet design** to optimize address space  
✅ **Use peering and gateway transit** for hybrid connectivity  
✅ **Leverage DNS solutions** to simplify name resolution  
✅ **Control traffic with NSGs & UDRs** for security and compliance  

🔥 If you're studying for **AZ-700**, focus on **hands-on labs** to reinforce concepts! 🚀  
