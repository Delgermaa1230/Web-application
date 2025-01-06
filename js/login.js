// Login and registration handling
const API_URL = 'http://localhost:3000';

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const errorMessageLogin = document.getElementById("error-message-login");

// Form Switch Functions
function loginSwitch() {
    document.getElementById("register").style.right = "-520px";
    document.getElementById("login").style.left = "0px";
}

function registerSwitch() {
    document.getElementById("login").style.left = "-700px";
    document.getElementById("register").style.right = "0px";
}

// Password Validation Helper
function isPasswordValid(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasUppercase && hasNumber;
}

// Login Handler
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
        const response = await fetch(`${API_URL}/students/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            errorMessageLogin.textContent = "";
            // Store user data if needed
            localStorage.setItem('student', JSON.stringify(data.student));
            window.location.href = './profile.html';
        } else {
            errorMessageLogin.textContent = data.error;
        }
    } catch (error) {
        errorMessageLogin.textContent = "Серверт холбогдоход алдаа гарлаа";
    }
});

// Register Handler
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("register-fname").value.trim();
    const lastName = document.getElementById("register-lname").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const retypePassword = document.getElementById("register-retype-password").value.trim();

    if (!isPasswordValid(password)) {
        alert("Нууц үг 8-с багагүй, нэг том үсэг, тоо ашиглана уу");
        return;
    }

    if (password !== retypePassword) {
        alert("Нууц үг зөрсөн байна");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                phone
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Амжилттай бүртгэгдлээ
            loginSwitch(); // Switch to login form
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert("Серверт холбогдоход алдаа гарлаа");
    }
});