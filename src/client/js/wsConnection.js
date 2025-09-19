import { setCurrentUser } from './auth.js';
import renderMessage from './renderMessage.js';
import renderUsers from './renderUsers.js';

let ws = null;

export function connectWs() {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      ws = new WebSocket('ws://localhost:7070');

      ws.addEventListener('open', () => {
        console.log('WS соединение установлено (open)');
        resolve(ws);
      });

      ws.addEventListener('error', (err) => reject(err));

      ws.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        console.log("WS сообщение:", data);

        if (data.type === 'chat') {
          renderMessage(data);
        }

        if (data.type === 'users') {
          renderUsers(data.users);
          console.log('Юзеры: ', data.users);
        }
      });

    } else {
      resolve(ws);
    }
  });
}

export function getWs() {
  return ws;
}

export function handleLogin(ws, nickname) {
    return new Promise((resolve, reject) => {
        function handler(e) {
            const data = JSON.parse(e.data);

            switch (data.type) {
                case 'ok':
                    ws.removeEventListener('message', handler);
                    setCurrentUser(data.login);
                    resolve(data.login);
                    break;
                case 'error':
                    ws.removeEventListener('message', handler);
                    reject(new Error(data.message));
                    break;
            };
        };

        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ type: 'login', nickname }));
    })
}

export function handleHistory(ws) {
    return new Promise((resolve, reject) => {
        function handler(e) {
            const data = JSON.parse(e.data);

            if (data.type === 'history') {
              ws.removeEventListener('message', handler);
              resolve(data.messages);
            }
        }

        ws.addEventListener('message', handler);
    })
}
