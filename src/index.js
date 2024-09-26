// Function to transform the URL from github.com to github.dev
function openInDev(url, openInNewTab = true) {
    const devUrl = url.replace("github.com", "github.dev");

    if (openInNewTab) {
        chrome.tabs.create({ url: devUrl });
    } else {
        chrome.tabs.update({ url: devUrl });
    }
}

// Create context menu for when right-clicking on the page
chrome.contextMenus.create({
    id: "openInDevPage",
    title: "Open in .dev!",
    contexts: ["page"],
    documentUrlPatterns: ["*://github.com/*/*"]
});

// Create context menu for when right-clicking a link
chrome.contextMenus.create({
    id: "openInDevLink",
    title: "Open in .dev!",
    contexts: ["link"],
    targetUrlPatterns: ["*://github.com/*/*"]
});

// Handle clicks on the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openInDevPage") {
        // Open current page in github.dev
        openInDev(tab.url);
    } else if (info.menuItemId === "openInDevLink") {
        // Open clicked link in a new tab in github.dev
        openInDev(info.linkUrl);
    }
});
