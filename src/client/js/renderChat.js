export default function renderChat() {
    const body = document.body;
    
    const chatCont = document.createElement('div');
    chatCont.className = 'chat-container';

    const usersCont = document.createElement('aside');
    usersCont.className = 'active-users_block';

    const chatBlock = document.createElement('section');
    chatBlock.className = 'chat_block';

    const chatTitle = document.createElement('h1');
    chatTitle.textContent = 'Чат торговли';

    const messages = document.createElement('ul');
    messages.className = 'messages';

    const msgForm = document.createElement('form');
    msgForm.className = 'message-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'inputMessage'
    input.className = 'message-input';
    input.placeholder = 'Введи свое бимбо-сообщение...'
    input.required = true;

    const btn = document.createElement('button');
    btn.className = 'message-btn'
    btn.type = 'submit';
    btn.name = 'btnMessage';
    btn.textContent = 'Отправить 💅🏻';

    msgForm.append(input, btn);
    chatBlock.append(chatTitle, messages, msgForm);
    chatCont.append(usersCont, chatBlock);
    body.append(chatCont);

    return msgForm;
}


/*<form class="message-form">      <!-- форма ввода нового сообщения -->
    <input type="text" class="message-input" placeholder="Введите сообщение..." required />
    <button type="submit">Отправить</button>
</form> */