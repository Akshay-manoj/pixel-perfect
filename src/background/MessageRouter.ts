import { MESSAGE_ACTIONS, type MessageAction } from '@shared/constants/messages.constants';

type MessageHandler = (
  payload: unknown,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
) => boolean | void;

/** Routes Chrome runtime messages to registered handlers */
export class MessageRouter {
  private handlers: Map<MessageAction, MessageHandler> = new Map();

  /** Register a handler for a specific message action */
  register(action: MessageAction, handler: MessageHandler): void {
    this.handlers.set(action, handler);
  }

  /** Start listening for Chrome runtime messages */
  listen(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const handler = this.handlers.get(message.action);
      if (handler) {
        return handler(message.payload, sender, sendResponse);
      }
      return false;
    });
  }

  /** Get all registered action names */
  getRegisteredActions(): MessageAction[] {
    return Array.from(this.handlers.keys());
  }
}
