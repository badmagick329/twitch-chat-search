const messageSearchInput = document.querySelector("#message-search-input");
const userSearchInput = document.querySelector("#user-search-input");
const resetButton = document.querySelector("#reset-button");
const responseMessage = document.querySelector("#response-message");
const defaultText =
  "Enter text to search for chat messages by a username or any other word.";
const DEBOUNCE_TIMEOUT = 300;
let debounceTimer;

function handleResponse(message) {
  if (message.response) {
    responseMessage.textContent = createResponseMessage(message.response);
  } else if (message.reset) {
    messageSearchInput.value = "";
    userSearchInput.value = "";
    responseMessage.textContent = defaultText;
  }
}

function handleError(error) {
  responseMessage.textContent = "An error occurred";
}

function getActiveTab() {
  return browser.tabs.query({ active: true, currentWindow: true });
}

resetButton.onclick = function () {
  getActiveTab().then((tabs) => {
    const sending = browser.tabs.sendMessage(tabs[0].id, { reset: true });
    sending.then(handleResponse, handleError);
  });
};

messageSearchInput.addEventListener("input", (e) => {
  if (e.target.value === "") {
    sendReset();
    return;
  }
  if (userSearchInput.value !== "") {
    userSearchInput.value = "";
  }

  debounce(() => {
    getActiveTab().then((tabs) => {
      const sending = browser.tabs.sendMessage(tabs[0].id, {
        message: e.target.value,
      });
      sending.then(handleResponse, handleError);
    });
  })();
});

userSearchInput.addEventListener("input", (e) => {
  if (e.target.value === "") {
    sendReset();
    return;
  }
  if (messageSearchInput.value !== "") {
    messageSearchInput.value = "";
  }

  debounce(() => {
    getActiveTab().then((tabs) => {
      const sending = browser.tabs.sendMessage(tabs[0].id, {
        username: e.target.value,
      });
      sending.then(handleResponse, handleError);
    });
  })();
});

function sendReset() {
  getActiveTab().then((tabs) => {
    const sending = browser.tabs.sendMessage(tabs[0].id, { reset: true });
    sending.then(handleResponse, handleError);
  });
}

function createResponseMessage(response) {
  switch (response) {
    case 0:
      return "No messages found";
    case 1:
      return "1 message found and highlighted";
    default:
      return `${response} messages found and highlighted`;
  }
}

function debounce(func) {
  return (...args) => {
    if (!debounceTimer) {
      func.apply(this, args);
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = undefined;
      func.apply(this, args);
    }, DEBOUNCE_TIMEOUT);
  };
}
