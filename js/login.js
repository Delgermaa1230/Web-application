
// Хэлбэр солих функцүүд
function loginSwitch() {
    document.getElementById("register").style.right = "-520px";
    document.getElementById("login").style.left = "0px";
}

function registerSwitch() {
    document.getElementById("login").style.left = "-700px";
    document.getElementById("register").style.right = "0px";
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginData = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/students/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('student', JSON.stringify(data.student));
            window.location.href = './profile.html';
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
        alert('Нууц үг таарахгүй байна');
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
        const response = await fetch('http://localhost:3000/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            loginSwitch(); 
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Серверт холбогдоход алдаа гарлаа');
    }
});
