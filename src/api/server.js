import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 7070;
const wsServer = new WebSocketServer({ server });
const MESSAGES_FILE = './messages.json';
const CLIENT_URL = process.env.CLIENT_URL || '';

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'dist')));
app.use('/api/avatars', express.static(path.join(process.cwd(), 'src/api/avatars')));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

const reservedLogins = new Map();
const clients = new Map(); // { nickname = { socket, avatar } }
let messages = [];
const avatars = [
  `${CLIENT_URL}/api/avatars/free-icon-hacker-924915.png`,
  `${CLIENT_URL}/api/avatars/free-icon-ninja-435061.png`,
  `${CLIENT_URL}/api/avatars/free-icon-positive-1397175.png`
];

// Загрузка истории сообщений
try {
    messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    console.log('История сообщений загружена:', messages.length);
} catch {
    messages = [];
}

// Очередь для безопасной записи сообщений
let writeQueue = [];
let writing = false;
function saveMessages() {
    if (writing || writeQueue.length === 0) return;
    writing = true;

    const dataToWrite = JSON.stringify(messages, null, 2);
    fs.promises.writeFile(MESSAGES_FILE, dataToWrite)
        .catch(err => console.error('Ошибка записи сообщений:', err))
        .finally(() => {
            writing = false;
            writeQueue = [];
            saveMessages(); // проверяем, не накопилось ли новых сообщений
        });
}

function addMessage(message) {
    messages.push(message);
    writeQueue.push(message);
    saveMessages();
}

function reserveLogin(nickname) {
    if (reservedLogins.has(nickname)) clearTimeout(reservedLogins.get(nickname));
    const timer = setTimeout(() => reservedLogins.delete(nickname), 60 * 60 * 1000);
    reservedLogins.set(nickname, timer);
    console.log('Reserve login:', nickname);
}

function usersToClient() {
    const userList = [...clients.entries()].map(([nickname, clientData]) => ({
        nickname,
        avatar: clientData.avatar
    }));
    const message = JSON.stringify({ type: 'users', users: userList });

    for (const clientData of clients.values()) {
        if (clientData.socket.readyState === WebSocket.OPEN) {
            try { clientData.socket.send(message) }
            catch (err) { console.error('Ошибка отправки списка пользователей:', err); }
        }
    }
}

wsServer.on('connection', client => {
    console.log('New WS client connected');

    client.on('message', msg => {
        let data;
        try { data = JSON.parse(msg) } 
        catch { return client.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' })); }

        if (data.type === 'login') {
            const nickname = data.nickname.trim();
            if (reservedLogins.has(nickname) || clients.has(nickname)) {
                return client.send(JSON.stringify({ type: 'error', message: 'Никнейм занят' }));
            }

            reserveLogin(nickname);
            const avatar = avatars[Math.floor(Math.random() * avatars.length)];
            clients.set(nickname, { socket: client, avatar });
            client.nickname = nickname;

            client.send(JSON.stringify({ type: 'ok', login: nickname, avatar }));
            client.send(JSON.stringify({ type: 'history', messages }));
            usersToClient();
            console.log('User logged in:', nickname);
        }

        if (data.type === 'chat') {
            if (!client.nickname || !clients.has(client.nickname)) {
                return client.send(JSON.stringify({ type: 'error', message: 'Вы не авторизованы' }));
            }

            const message = {
                type: 'chat',
                nickname: client.nickname,
                message: data.message,
                timestamp: Date.now()
            };

            addMessage(message);

            // Безопасная рассылка
            for (const clientData of clients.values()) {
                if (clientData.socket.readyState === WebSocket.OPEN) {
                    try { clientData.socket.send(JSON.stringify(message)); }
                    catch (err) {
                        console.error('Ошибка отправки WS-сообщения клиенту', err);
                    }
                }
            }
        }

        if (data.type === 'users') usersToClient();
    });

    client.on('close', () => {
        if (client.nickname) {
            clients.delete(client.nickname);
            usersToClient();
            console.log(client.nickname, 'disconnected');
        }
    });

    client.on('error', err => {
        console.error('WS client error:', err);
        if (client.nickname) {
            clients.delete(client.nickname);
            usersToClient();
        }
    });
});

server.listen(port, () => console.log(`Server listening on ${port}`));