import './style/style.css';
import { hideLogin, showLogin, showLoginError } from './js/loginModal.js';
import { connectWs, handleHistory, handleLogin } from './js/wsConnection.js';

import renderMessages from './js/renderMessages.js';
import renderChat from './js/renderChat.js';
import createMessage from './js/createMessage.js';

async function init() {
  let ws;

  try {
    ws = await connectWs();
    console.log('WebSocket connected, state:', ws.readyState);
  } catch (err) {
    console.error('Connection error:', err);
    showLoginError("Не удалось подключиться к серверу");
    return;
  }

  while (true) {
    const nickname = await new Promise(resolve => {
      showLogin(resolve);
    });

    try {
      if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
        console.log('Reconnecting WebSocket...');
        ws = await connectWs();
      }

      console.log('Attempting login with:', nickname);
      await handleLogin(ws, nickname);
      console.log('Login successful, requesting history...');
      
      const history = await handleHistory(ws);
      console.log('History received:', history.length, 'messages');
      
      hideLogin();

      const sendForm = renderChat();
      sendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        createMessage(e.currentTarget.elements.inputMessage);
      })

      renderMessages(history);
      break;
    } catch (err) {
      console.error('Login error:', err);
      showLoginError(err.message);
    }
  }
}


init();