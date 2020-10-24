browser.cookies.get({url: 'https://www.twitch.tv', name: 'auth-token'}).then(cookie => {
  if (cookie) {
    console.log('setting token from cookie');
    browser.storage.local.set({ user_token: cookie.value });
  }
  else {
    console.info('cookie not found, removing token');
    browser.storage.local.remove('user_token');
  }
});

browser.storage.local.get('bonus_counter').then(storage => {
  if (!storage.bonus_counter) {
    browser.storage.local.set({bonus_counter: {}});
  }
});

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request && request.action === 'ping') {
    console.info('pong');
  }

  browser.tabs.executeScript({
    file: 'content-script.js',
  });
  
})
