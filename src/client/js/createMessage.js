import sendMessage from './sendMessage.js';

export default function createMessage(input) {
    const text = input.value.trim();
    
    if (!text) {
        console.log('Сообщение не может быть пустым');
        return;
    }

    sendMessage(text);
    input.value = '';
    input.focus();
}


