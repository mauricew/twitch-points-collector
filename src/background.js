browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Hello from the background')

  chrome.cookies.get({url: 'https://www.twitch.tv', name: 'auth-token'}, function(cookie) {
    console.log('setting token')
    if (cookie) {
      chrome.storage.local.set({ user_token: cookie.value });
    }
    else {
      chrome.storage.local.remove('user_token');
    }
  })

  browser.tabs.executeScript({
    file: 'content-script.js',
  });
})
