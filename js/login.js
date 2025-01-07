const API_URL = 'http://localhost:3000/api';

// Элементийг DOM-оос авах
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const errorMessageLogin = document.getElementById("error-message-login");

// Хэлбэр солих функцүүд
function loginSwitch() {
    document.getElementById("register").style.right = "100%";
    document.getElementById("login").style.left = "0px";
}

function registerSwitch() {
    document.getElementById("login").style.left = "100%";
    document.getElementById("register").style.right = "0px";
}

// Нууц үг шалгах туслагч функц
function isPasswordValid(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasUppercase && hasNumber;
}

// Нэвтрэх үйлдэл
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
        const response = await fetch(`${API_URL}/students/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Нэвтрэлтийн амжилт
            errorMessageLogin.textContent = "";
            localStorage.setItem('student', JSON.stringify(data.student));
            alert(data.message); // Амжилтын мэдээлэл
            window.location.href = './profile.html'; // Профайл руу шилжих
        } else {
            // Алдааны мэдээлэл харуулах
            errorMessageLogin.textContent = data.error || "Нэвтрэхэд алдаа гарлаа.";
        }
    } catch (error) {
        // Сервертэй холбогдох алдаа
        errorMessageLogin.textContent = "Серверт холбогдоход алдаа гарлаа.";
    }
});

// Бүртгэх үйлдэл
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("register-fname").value.trim();
    const lastName = document.getElementById("register-lname").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const retypePassword = document.getElementById("register-retype-password").value.trim();

    // Нууц үг баталгаажуулах
    if (!isPasswordValid(password)) {
        alert("Нууц үг 8 тэмдэгтээс багагүй, нэг том үсэг, тоо ашиглана уу.");
        return;
    }

    if (password !== retypePassword) {
        alert("Нууц үг зөрсөн байна.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Бүртгэлийн амжилт
            alert(data.message || "Амжилттай бүртгэгдлээ.");
            loginSwitch(); // Нэвтрэх хэлбэр рүү шилжих
        } else {
            // Алдааны мэдээлэл харуулах
            alert(data.error || "Бүртгэл хийхэд алдаа гарлаа.");
        }
    } catch (error) {
        // Сервертэй холбогдох алдаа
        alert("Серверт холбогдоход алдаа гарлаа.");
    }
});
