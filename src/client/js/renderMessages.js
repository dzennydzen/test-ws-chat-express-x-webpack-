import renderMessage from './renderMessage.js';

export default function renderMessages(history) {
    history.forEach(msg => renderMessage(msg))

    console.log('History is downloaded')
}

