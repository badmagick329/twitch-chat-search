let messageSearchInput = document.querySelector("#message-search-input");
let userSearchInput = document.querySelector("#user-search-input");
let resetButton = document.querySelector("#reset-button");

function getActiveTab() {
  return browser.tabs.query({ active: true, currentWindow: true });
}

messageSearchInput.onchange = function (e) {
  getActiveTab().then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { message: e.target.value });
  });
};

resetButton.onclick = function () {
  getActiveTab().then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { reset: true });
  });
};

userSearchInput.onchange = function (e) {
  getActiveTab().then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { username: e.target.value });
  });
};
