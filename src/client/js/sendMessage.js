import { getWs } from './wsConnection.js';

export default function sendMessage(text) {
    const ws = getWs();

    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'chat',
            message: text
        }));

        console.log('Новое сообщение успешно отправлено! (sendMessage)');
        return;
    }

    console.log('Не отправилась твоя чухня (sendMessage)');
}