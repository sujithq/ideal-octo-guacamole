+++
title = '🚀 How to Retrieve Stale Branches Across All Repositories in a GitHub Organization'
date = 2025-02-14T01:00:00-00:00
draft = false
tags = [
  "GitHub",
  "GitHub CLI",
  "Automation",
  "Bash Scripting",
  "DevOps",
  "Repository Management",
  "Stale Branches",
  "Git",
  "Scripting",
  "GitHub API",
  "Branch Cleanup",
  "GitHub Organization",
  "Security",
  "Collaboration",
  "Productivity"
]
categories = [ 'Professional Experience' ]
series = [ 'GitHub and DevOps' ]
layout = 'single'
[params]
    cover = true
    author = 'sujith'
+++

Keeping your GitHub repositories clean is crucial for maintainability. Over time, branches pile up, making it difficult to track what’s relevant. If you’re managing multiple repositories in an organization, manually identifying stale branches can be a hassle.  

Luckily, with the **GitHub CLI (`gh`)**, you can automate this process and generate a **report of all non-main branches along with their last authors**.  

This guide walks you through a **Bash script** that:  
✅ Retrieves all repositories in an organization  
✅ Lists branches, excluding `main`, `master`, and `azure-master`  
✅ Identifies the last commit author for each branch  
✅ Groups the results by author for better visibility  

---

## 🔧 Prerequisites  

Before running the script, make sure:  
- You have **GitHub CLI (`gh`)** installed and authenticated (`gh auth login`).  
- You have **appropriate permissions** to list repositories and fetch branch details in your organization.  
- You're running a **Unix-based system** (Linux/macOS or WSL for Windows).  

---

## 📜 The Script  

Here’s the complete Bash script to **scan all repositories** in your GitHub organization and generate a **stale branch report**:  

```bash
# Set Variables
org="<Replace with your GitHub Organization name>"
raw_output_file="branches.txt"
report_file="report.txt"

# Clear previous output
> "$raw_output_file"

# Get the repositories as JSON and extract names
repos=$(gh repo list "$org" --json name --jq '.[].name')

# Function to get branch author safely
get_author() {
    local org=$1
    local repo=$2
    local branch=$3
    local author

    # Try fetching author name
    author=$(gh api "/repos/$org/$repo/branches/$branch" --jq '.commit.commit.author.name' 2>/dev/null)

    # If author is empty, return "Unknown"
    if [[ -z "$author" ]]; then
        author="Unknown"
    fi

    # Write to output file
    echo "  - Author: $author" >> "$raw_output_file"
}

# Loop through each repository
for repo in $repos; do
    echo "- repo: $repo" >> "$raw_output_file"
    
    # Get all branches in the repository
    branches=$(gh api "/repos/$org/$repo/branches" --jq '.[].name')

    # Loop through each branch
    for branch in $branches; do
        # Skip master, azure-master, and main
        if [[ "$branch" == "master" || "$branch" == "azure-master" || "$branch" == "main" ]]; then
            continue
        fi

        echo " - Branch: $branch" >> "$raw_output_file"
        # Fetch branch author
        get_author "$org" "$repo" "$branch"
    done
done

declare -A author_repos  # Declare an associative array

# Ensure the array is cleared before each run
unset author_repos
declare -A author_repos

# Clear previous report
> "$report_file"

# Read and process output file
while IFS= read -r line; do
    if [[ $line == "- repo: "* ]]; then
        repo=$(echo "$line" | awk '{print $3}')
    elif [[ $line == " - Branch: "* ]]; then
        branch=$(echo "$line" | awk '{print $3}')
    elif [[ $line == "  - Author: "* ]]; then
        author=$(echo "$line" | sed 's/  - Author: //')  # Extract author name

        # Store branch under author
        author_repos["$author"]+=$'\n'"- $repo -> $branch"
    fi
done < "$raw_output_file"

# Print grouped results
for author in "${!author_repos[@]}"; do
    echo "Author: $author" >> "$report_file"
    echo "${author_repos[$author]}" >> "$report_file"
    echo >> "$report_file"
done

cat "$report_file"
```

---

## 📊 Example Output  

Once executed, the script produces a **report grouped by author**, making it easy to find out **who owns stale branches**:

```
Author: Alice
- repo1 -> feature/login-page
- repo2 -> hotfix/payment-fix

Author: Bob
- repo3 -> refactor/api-updates
- repo1 -> test/legacy-integration

Author: Unknown
- repo4 -> bugfix/session-timeout
```

---

## 🔥 Why This Matters  

1. **Easier Maintenance** – Identify branches that can be deleted or merged.  
2. **Better Collaboration** – Reach out to authors to confirm branch status.  
3. **Improved Performance** – Reducing unnecessary branches speeds up repository operations.  

You can extend this script further to:  
✅ Filter branches by **last commit date**  
✅ Automatically **delete stale branches** (with `gh api -X DELETE`)  
✅ Generate a **GitHub issue or PR** listing stale branches  

Would love to hear how you customize this for your workflow! 🚀