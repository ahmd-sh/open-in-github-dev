import { copyFileSync } from 'fs';

// See package.json for scripts
const targetBrowser = process.argv[2];

const manifestMap = {
    chrome: 'manifest.chrome.json',
    firefox: 'manifest.firefox.json',
};

const selectedManifest = manifestMap[targetBrowser];

if (!selectedManifest) {
    console.error('Unsupported browser! Use "chrome" or "firefox".');
    process.exit(1);
}

try {
    copyFileSync(selectedManifest, 'manifest.json');
    console.log(`Successfully generated manifest for ${targetBrowser}`);
} catch (err) {
    console.error(`Failed to generate manifest: ${err.message}`);
    process.exit(1);
}
