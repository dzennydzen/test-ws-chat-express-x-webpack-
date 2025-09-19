import { getCurrentUser } from './auth.js';
import formatDate from './formatDate.js';

export default function renderMessage(data, cont = document.querySelector('.chat-container .messages')) {
    const message = document.createElement('li');
    const whoseMsg = data.nickname === getCurrentUser();
    message.classList.add('message', whoseMsg ? 'message--mine' : 'message--other');
    
    const meta = document.createElement('div');
    meta.className = 'message__meta';
    
    const author = document.createElement('span');
    author.className = 'message__author';
    const authorText = whoseMsg ? 'You' : data.nickname;
    author.textContent = authorText;
    
    const time = document.createElement('time');
    time.className = 'message__time';
    const isoStr = new Date(data.timestamp).toISOString();
    time.datetime = isoStr;
    time.textContent = formatDate(data.timestamp);
    
    const msgBody = document.createElement('div');
    msgBody.className = 'message__body';
    msgBody.textContent = data.message;
    
    meta.append(author, time);
    message.append(meta, msgBody);
    
    cont.append(message);
    cont.scrollTop = cont.scrollHeight;
}

