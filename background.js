
console.log('Background script is running.');

// Handle popup interactions
chrome.browserAction.onClicked.addListener(function (tab) {
  // Toggle the popup visibility
  chrome.browserAction.setPopup({
    tabId: tab.id,
    popup: (tab.url && tab.url.startsWith('https://example.com')) ? 'popup.html' : ''
  });
});
