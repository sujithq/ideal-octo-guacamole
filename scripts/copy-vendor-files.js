const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let source = 'node_modules';
let vendor = null;
let fileName = null;
let destination = 'assets';

// Process command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-Source' || args[i] === '--Source') {
    source = args[i + 1];
    i++;
  } else if (args[i] === '-Vendor' || args[i] === '--Vendor') {
    vendor = args[i + 1];
    i++;
  } else if (args[i] === '-FileName' || args[i] === '--FileName') {
    fileName = args[i + 1];
    i++;
  } else if (args[i] === '-Destination' || args[i] === '--Destination') {
    destination = args[i + 1];
    i++;
  }
}

// Ensure vendor and filename are provided
if (!vendor || !fileName) {
  console.error('\x1b[31mVendor and FileName parameters are required.\x1b[0m');
  process.exit(1);
}

// Ensure the source exists
const vendorPath = path.join(source, vendor);
if (!fs.existsSync(vendorPath)) {
  console.error(`\x1b[31mVendor path '${vendorPath}' does not exist.\x1b[0m`);
  process.exit(1);
}

// Find the file in the vendor directory recursively
function findFile(dir, fileName) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const found = findFile(filePath, fileName);
      if (found) return found;
    } else if (file === fileName) {
      return filePath;
    }
  }
  return null;
}

const filePath = findFile(vendorPath, fileName);

if (!filePath) {
  console.error(`\x1b[31mFile '${fileName}' not found in '${vendorPath}'.\x1b[0m`);
  process.exit(1);
}

const ext = path.extname(filePath);

const fullDestination = path.join(destination, vendor, ext.substring(1));

// Ensure the destination exists
if (!fs.existsSync(fullDestination)) {
  fs.mkdirSync(fullDestination, { recursive: true });
}

// Copy the file
fs.copyFileSync(filePath, path.join(fullDestination, fileName));

console.log(`\x1b[32mCopied '${filePath}' to '${fullDestination}'.\x1b[0m`);