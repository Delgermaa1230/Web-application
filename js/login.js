
// Хэлбэр солих функцүүд
function loginSwitch() {
    document.querySelector('.form-box').classList.remove('register-open');
}

function registerSwitch() {
    document.querySelector('.form-box').classList.add('register-open');
}

function afterLogin() {
    const next = new URLSearchParams(window.location.search).get('next');
    const target = next ? new URL(next, window.location.href) : new URL('./profile.html', window.location.href);
    window.location.href = target.origin === window.location.origin && target.pathname.startsWith('/pages/')
        ? target.href : './profile.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginData = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };

    try {
        const response = await fetch('/api/students/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.removeItem('student');
            afterLogin();
        } else {
            document.getElementById('error-message-login').textContent = data.error;
        }
    } catch (error) {
        document.getElementById('error-message-login').textContent = 'Серверт холбогдоход алдаа гарлаа';
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('register-password').value;
    const retypePassword = document.getElementById('register-retype-password').value;

    if (password !== retypePassword) {
        document.getElementById('error-message-register').textContent = 'Нууц үг таарахгүй байна.';
        return;
    }

    const registerData = {
        first_name: document.getElementById('register-fname').value,
        last_name: document.getElementById('register-lname').value,
        email: document.getElementById('register-email').value,
        password: password,
        phone: document.getElementById('register-phone').value
    };

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();
        if (response.ok) {
            afterLogin();
        } else {
            document.getElementById('error-message-register').textContent = data.error;
        }
    } catch (error) {
        document.getElementById('error-message-register').textContent = 'Серверт холбогдоход алдаа гарлаа.';
    }
});
