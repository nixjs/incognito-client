/* eslint-disable no-undef */
chrome.browserAction.setPopup({ popup: '' });

chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'index.html' });
});
