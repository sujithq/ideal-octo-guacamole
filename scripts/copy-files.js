const fs = require('fs');
const path = require('path');

// List of vendors and files to copy
const filesToCopy = [
  { vendor: "aos", fileName: "dist/aos.js", destination: "assets/vendor/aos/js", source: "node_modules" },
  { vendor: "aos", fileName: "dist/aos.css", destination: "assets/vendor/aos/css", source: "node_modules" },
  { vendor: "bootstrap", fileName: "dist/js/bootstrap.bundle.min.js", destination: "assets/vendor/bootstrap/js", source: "node_modules" },
  { vendor: "swiper", fileName: "swiper-bundle.min.js", destination: "assets/vendor/swiper/js", source: "node_modules" },
  { vendor: "swiper", fileName: "swiper-bundle.min.css", destination: "assets/vendor/swiper/css", source: "node_modules" },
  { vendor: "bootstrap-icons", fileName: "font/fonts/bootstrap-icons.woff", destination: "static/scss/fonts", source: "node_modules" },
  { vendor: "bootstrap-icons", fileName: "font/fonts/bootstrap-icons.woff2", destination: "static/scss/fonts", source: "node_modules" }
];

/**
 * Copy a file from node_modules to destination directory
 * @param {string} source - Source directory
 * @param {string} vendor - Vendor name
 * @param {string} fileName - File name/path within vendor directory
 * @param {string} destination - Destination directory
 */
function copyNodeModuleFile(source, vendor, fileName, destination) {
  // Ensure all parameters are provided
  if (!vendor || !fileName || !source || !destination) {
    console.error("\x1b[31mSource, Vendor, FileName and Destination parameters are required.\x1b[0m");
    return;
  } else {
    console.log(`\x1b[33mCopying ${source}/${vendor}/${fileName} to ${destination} ...\x1b[0m`);
  }

  // Ensure the source exists
  const vendorPath = path.join(source, vendor);
  if (!fs.existsSync(vendorPath)) {
    console.error(`\x1b[31mVendor path '${vendorPath}' does not exist.\x1b[0m`);
    return;
  } else {
    console.log(`\x1b[33mVendor path '${vendorPath}' exists.\x1b[0m`);
  }

  const sourceFile = path.join(source, vendor, fileName);
  if (!fs.existsSync(sourceFile)) {
    console.error(`\x1b[31mSource file '${sourceFile}' does not exist.\x1b[0m`);
    return;
  } else {
    console.log(`\x1b[33mSource file '${sourceFile}' exists.\x1b[0m`);
  }

  // Ensure the destination exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Copy the file
  const destinationFile = path.join(destination, path.basename(fileName));
  fs.copyFileSync(sourceFile, destinationFile);

  console.log(`\x1b[32mCopied '${sourceFile}' to '${destination}'.\x1b[0m`);
}

// Loop through each entry and call copyNodeModuleFile
filesToCopy.forEach(entry => {
  console.log(`Processing: ${entry.vendor}/${entry.fileName}...`);
  copyNodeModuleFile(entry.source, entry.vendor, entry.fileName, entry.destination);
});

console.log("\x1b[32mAll files copied successfully!\x1b[0m");