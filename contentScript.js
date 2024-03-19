// contentScript.js
console.log("Content script loaded!");
// Extract the content from the current page
const pageContent = document.body.innerText;

chrome.runtime.sendMessage({ action: 'updatePageContent', content: pageContent });
console.log('Message sent from content script to popup script');
