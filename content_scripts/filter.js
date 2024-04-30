class UIReader {
  constructor() {
    this.hasSevenTv = null;
  }

  messages() {
    if (this.hasSevenTv === null) {
      this.hasSevenTv =
        document.querySelector(".seventv-chat-message-background") !== null;
    }
    return this.hasSevenTv
      ? document.querySelectorAll(".seventv-chat-message-background")
      : document.querySelectorAll(".chat-line__message");
  }

  textsInMessage(message) {
    if (this.hasSevenTv === null) {
      this.hasSevenTv =
        document.querySelector(".seventv-chat-message-background") !== null;
    }
    return this.hasSevenTv
      ? message
          .querySelector(".seventv-chat-message-body")
          .querySelectorAll(".text-token")
      : message.querySelectorAll(".text-fragment");
  }

  username(message) {
    if (this.hasSevenTv === null) {
      this.hasSevenTv =
        document.querySelector(".seventv-chat-message-background") !== null;
    }
    return this.hasSevenTv
      ? message.querySelector(".seventv-chat-user-username").textContent
      : message.dataset.aUser;
  }
}

class HighlightedMessages {
  constructor() {
    this.allMessages = [];
    this.highlightCount = 0;
  }

  byUser(allMessages, username) {
    this.allMessages = allMessages;
    return this._highlightMessagesUsing(username, this._isUserMessage);
  }

  byText(allMessages, text) {
    this.allMessages = allMessages;
    return this._highlightMessagesUsing(text, this._messageHasText);
  }

  reset(allMessages) {
    this.allMessages = allMessages;
    this.highlightCount = 0;
    for (const message of this.allMessages) {
      message.style.backgroundColor = "";
    }
  }

  _highlightMessagesUsing(text, func) {
    this.highlightCount = 0;
    for (const message of this.allMessages) {
      if (func(message, text)) {
        message.style.backgroundColor = "green";
        this.highlightCount++;
      } else {
        message.style.backgroundColor = "";
      }
    }
  }

  _isUserMessage(message, username) {
    try {
      const usernameFromChat = uiReader.username(message);
      return usernameFromChat.toLowerCase() === username.toLowerCase();
    } catch (e) {}
    return false;
  }

  _messageHasText(message, text) {
    try {
      const messageTexts = uiReader.textsInMessage(message);
      for (const messageText of messageTexts) {
        if (
          messageText.textContent.toLowerCase().includes(text.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    } catch (e) {}
    return false;
  }
}

browser.runtime.onMessage.addListener(messageHandler);

const uiReader = new UIReader();
const highlightedMessages = new HighlightedMessages();

function messageHandler(request, sender, sendResponse) {
  if (request.reset) {
    highlightedMessages.reset(uiReader.messages());
    return Promise.resolve({ reset: true });
  }

  if (request.message) {
    highlightedMessages.byText(uiReader.messages(), request.message);
  } else if (request.username) {
    highlightedMessages.byUser(uiReader.messages(), request.username);
  }
  return Promise.resolve({ response: highlightedMessages.highlightCount });
}
