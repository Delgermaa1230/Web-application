// Load data from a JSON file
async function loadData() {
    const response = await fetch("../data/teacher.json");
    const data = await response.json();
    return data.teachers;
}

// Variables
let tutorData = [];
loadData().then(data => tutorData = data);

// DOM Elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerRetypePassword = document.getElementById("register-retype-password");
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

// Login Validation
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    const user = tutorData.find(tutor => tutor.email === email && tutor.password === password);

    if (user) {
        errorMessageLogin.textContent = "";
        window.location.href = './profile.html'
    } else {
        errorMessageLogin.textContent = "Мэйл эсвэл нууц үг буруу байна.";
    }
});

// Password Validation Helper
function isPasswordValid(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasUppercase && hasNumber;
}


// Register Validation
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = registerEmail.value.trim();
    const password = registerPassword.value.trim();
    const retypePassword = registerRetypePassword.value.trim();

    if (!isPasswordValid(password)) {
        alert("Нууц үг 8с баггүй нэг том үсэг тоо ашиглана уу");
        return;
    }

    if (password !== retypePassword) {
        alert("Нууц үг зөрсөн байна");
        return;
    }

    // Simulate adding the user to the JSON data (you would handle this server-side)
    const existingUser = tutorData.find(tutor => tutor.email === email);
    if (existingUser) {
        alert("Мэйл бүртгэлтэй байна");
    } else {
        tutorData.push({ email, password });
        alert("Амжилттай");
        loginSwitch();
    }
});
