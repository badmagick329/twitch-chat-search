browser.runtime.onMessage.addListener(filterMessages);
browser.runtime.onMessage.addListener(reset);
browser.runtime.onMessage.addListener(filterUsers);

function filterMessages(request, sender, sendResponse) {
  if (!request.message) {
    return;
  }
  console.log("received message", request.message);
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
  console.log("received username", request.username);
  _filterUsers(request.username);
}

function _filterMessages(text) {
  const messages = document.querySelectorAll(
    ".seventv-chat-message-background",
  );
  for (const message of messages) {
    if (_messageHasText(message, text)) {
      message.style.backgroundColor = "green";
    } else {
      message.style.backgroundColor = "";
    }
  }
}

function _filterUsers(username) {
  const messages = document.querySelectorAll(
    ".seventv-chat-message-background",
  );
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
    const usernameElement = message.querySelector(
      ".seventv-chat-user-username",
    );
    return usernameElement.textContent.toLowerCase() === username.toLowerCase();
  } catch (e) {}
  return false;
}

function _reset() {
  const messages = document.querySelectorAll(
    ".seventv-chat-message-background",
  );
  messages.forEach((message) => {
    message.style.backgroundColor = "";
  });
}

function _messageHasText(message, text) {
  try {
    const messageTexts = message
      .querySelector(".seventv-chat-message-body")
      .querySelectorAll(".text-token");
    for (const messageText of messageTexts) {
      if (messageText.textContent.toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
    }
    return false;
  } catch (e) {}
  return false;
}
