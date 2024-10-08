/* Builds the extension using web-ext 
 * while respecting browser specificities */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

// Get browser type from the command-line arguments
const browser = process.argv[2];
if (!browser || !['firefox', 'chrome'].includes(browser)) {
    console.error('Please specify a valid browser: "firefox" or "chrome".');
    process.exit(1);
}

// Specify path for generate manifest script
const manifestScriptPath = path.join(__dirname, '../manifest/generate-manifest.js');

// Specify directory to store artifacts
const artifactsDir = `./build/${browser}/web-ext-artifacts`;
const artifactsArgs = `--artifacts-dir ${artifactsDir}`;

// Read the ignore file paths from file
const ignoreFilePath = path.join(__dirname, 'exclude-files.txt');
const ignoreFiles = readFileSync(ignoreFilePath, 'utf-8')
    .split('\n')
    .filter((line) => line.trim() !== '') // Filter empty lines
    .map((file) => file.trim());

// Build the ignore files argument for web-ext
const ignoreArgs = ignoreFiles.map((file) => `--ignore-files ${file}`).join(' ');

try {
    // Generate the browser-specific manifest
    execSync(`bun run ${manifestScriptPath} ${browser}`, { stdio: 'inherit' });

    // Build the JavaScript with Bun
    execSync('bun build src/index.js --outfile dist/index.js', { stdio: 'inherit' });

    // Run web-ext build with the ignore files argument
    const webExtCommand = `web-ext build --overwrite-dest ${artifactsArgs} ${ignoreArgs}`;
    console.log(`Running: ${webExtCommand}`);
    execSync(webExtCommand, { stdio: 'inherit' });

    console.log(`${browser} extension build completed.`);
} catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
}
