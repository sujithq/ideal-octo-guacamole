const fs = require('fs');
const path = require('path');

// List of vendors and files to copy
const filesToCopy = [
  { vendor: "aos", fileName: "dist/aos.js", destination: "assets/vendor/aos/js", source: "node_modules" },
  { vendor: "aos", fileName: "dist/aos.css", destination: "assets/vendor/aos/css", source: "node_modules" },
  { vendor: "bootstrap", fileName: "dist/js/bootstrap.bundle.min.js", destination: "assets/vendor/bootstrap/js", source: "node_modules" },
  { vendor: "prismjs", fileName: "components/prism-core.min.js", destination: "assets/vendor/prismjs/js", source: "node_modules" },
  { vendor: "prismjs", fileName: "plugins/autoloader/prism-autoloader.min.js", destination: "assets/vendor/prismjs/js", source: "node_modules" },
  { vendor: "prismjs", fileName: "themes/prism-okaidia.min.css", destination: "assets/vendor/prismjs/css", source: "node_modules" },
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
    console.error("\x1b[31mAll parameters (source, vendor, fileName, destination) are required.\x1b[0m");
    return;
  }
  console.log(`\x1b[33mCopying ${source}/${vendor}/${fileName} to ${destination} ...\x1b[0m`);
  // Ensure the source exists
  const vendorPath = path.join(source, vendor);
  if (!fs.existsSync(vendorPath)) {
    console.error(`\x1b[31mVendor path '${vendorPath}' does not exist.\x1b[0m`);
    return;
  } else {
    console.log(`\x1b[33mVendor path '${vendorPath}' exists.\x1b[0m`);
  }
  console.log(`\x1b[33mVendor path '${vendorPath}' exists.\x1b[0m`);

  const sourceFile = path.join(source, vendor, fileName);
  if (!fs.existsSync(sourceFile)) {
    console.error(`\x1b[31mSource file '${sourceFile}' does not exist.\x1b[0m`);
    return;
  }
  console.log(`\x1b[33mSource file '${sourceFile}' exists.\x1b[0m`);
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Copy the file
  const destinationFile = path.join(destination, path.basename(fileName));
  fs.copyFileSync(sourceFile, destinationFile);

  console.log(`\x1b[32mCopied '${sourceFile}' to '${destinationFile}'.\x1b[0m`);
}

// Loop through each entry and call copyNodeModuleFile
Promise.all(filesToCopy.map(entry => {
  console.log(`Processing: ${entry.vendor}/${entry.fileName}...`);
  return new Promise((resolve, reject) => {
    try {
      copyNodeModuleFile(entry.source, entry.vendor, entry.fileName, entry.destination);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
})).then(() => {
  console.log("\x1b[32mAll files copied successfully!\x1b[0m");
}).catch(error => {
  console.error(`\x1b[31mError copying files: ${error.message}\x1b[0m`);
});

/**
 * Copy a folder and its contents to destination directory
 * @param {string} source - Source directory
 * @param {string} destination - Destination directory
 */
function copyFolderRecursiveSync(source, destination) {
  if (!fs.existsSync(source)) {
    console.error(`\x1b[31mSource folder '${source}' does not exist.\x1b[0m`);
    return;
  }
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (let entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyFolderRecursiveSync(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
      console.log(`\x1b[32mCopied '${sourcePath}' to '${destinationPath}'.\x1b[0m`);
    }
  }
}


// Example usage of copyFolderRecursiveSync
copyFolderRecursiveSync('node_modules/prismjs/components', 'static/vendor/prismjs/js/components');
copyFolderRecursiveSync('node_modules/prismjs/themes', 'static/vendor/prismjs/css');

console.log("\x1b[32mAll files copied successfully!\x1b[0m");