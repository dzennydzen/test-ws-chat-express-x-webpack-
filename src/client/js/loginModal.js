const loginModal = document.querySelector('.login-dialog');
const loginForm = document.getElementById('loginForm');
const loginInput = loginForm.elements[0];
const loginBtn = loginForm.elements[1];

export function showLogin(cb) {
  loginModal.classList.remove('hidden');
  loginInput.value = '';
  loginBtn.disabled = false;
  loginInput.focus();

  function handler(e) {
    e.preventDefault();
    const nickname = loginInput.value.trim();
    if (!nickname) return;

    cb(nickname);

    loginBtn.disabled = true;
    loginInput.value = '';
    loginForm.removeEventListener('submit', handler);
  }

  loginForm.addEventListener('submit', handler);
}

export function hideLogin() {
  loginModal.classList.add('hidden');
}

export function showLoginError(message) {
  loginBtn.disabled = false;
  alert(message);
}