import { getCurrentUser } from './auth.js';

export default function renderUsers(usersArr, usersCont = document.querySelector('.active-users_block')) {
    usersCont.innerHTML = '';

    usersArr.forEach(u => {
        const userBlock = document.createElement('div');
        userBlock.className = 'user_block';
        userBlock.dataset.nickname = u.nickname;

        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = u.avatar;
        avatar.alt = 'avatar';

        const nick = document.createElement('span');
        nick.textContent = u.nickname === getCurrentUser() ? 'You' : u.nickname;

        if (nick.textContent === 'You') {
            nick.className = 'user-nick--mine'
        }

        userBlock.append(avatar, nick);
        usersCont.append(userBlock)
    })

    console.log('Юзеры отрисованы')
}