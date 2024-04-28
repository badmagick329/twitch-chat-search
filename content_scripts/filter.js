browser.runtime.onMessage.addListener(filterMessages);
browser.runtime.onMessage.addListener(reset);
browser.runtime.onMessage.addListener(filterUsers);

let hasSevenTv = null;

function filterMessages(request, sender, sendResponse) {
  if (!request.message) {
    return;
  }
  _filterMessages(request.message);
}

function reset(request, sender, sendResponse) {
  if (!request.reset) {
    return;
  }
  _reset();
}

function filterUsers(request, sender, sendResponse) {
  if (!request.username) {
    return;
  }
  _filterUsers(request.username);
}

function _filterMessages(text) {
  const messages = _retrieveMessages();
  for (const message of messages) {
    if (_messageHasText(message, text)) {
      message.style.backgroundColor = "green";
    } else {
      message.style.backgroundColor = "";
    }
  }
}

function _filterUsers(username) {
  const messages = _retrieveMessages();
  for (const message of messages) {
    if (_isUserMessage(message, username)) {
      message.style.backgroundColor = "green";
    } else {
      message.style.backgroundColor = "";
    }
  }
}

function _isUserMessage(message, username) {
  try {
    const usernameFromChat = _retrieveUsername(message);
    return usernameFromChat.toLowerCase() === username.toLowerCase();
  } catch (e) {}
  return false;
}

function _reset() {
  const messages = _retrieveMessages();
  messages.forEach((message) => {
    message.style.backgroundColor = "";
  });
}

function _messageHasText(message, text) {
  try {
    const messageTexts = _retrieveMessageTexts(message);
    for (const messageText of messageTexts) {
      if (messageText.textContent.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
    }
    return false;
  } catch (e) {}
  return false;
}

function _retrieveMessages() {
  if (hasSevenTv === null) {
    hasSevenTv =
      document.querySelector(".seventv-chat-message-background") !== null;
  }
  console.log("hasSevenTv", hasSevenTv);
  return hasSevenTv
    ? document.querySelectorAll(".seventv-chat-message-background")
    : document.querySelectorAll(".chat-line__message");
}

function _retrieveMessageTexts(message) {
  if (hasSevenTv === null) {
    hasSevenTv =
      document.querySelector(".seventv-chat-message-background") !== null;
  }
  console.log("hasSevenTv", hasSevenTv);
  return hasSevenTv
    ? message
        .querySelector(".seventv-chat-message-body")
        .querySelectorAll(".text-token")
    : message.querySelectorAll(".text-fragment");
}

function _retrieveUsername(message) {
  if (hasSevenTv === null) {
    hasSevenTv =
      document.querySelector(".seventv-chat-message-background") !== null;
  }
  console.log("hasSevenTv", hasSevenTv);
  return hasSevenTv
    ? message.querySelector(".seventv-chat-user-username").textContent
    : message.dataset.aUser;
}
