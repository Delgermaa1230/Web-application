// profile.html хуудасны мэдээллийг агуулж буй component
class ProfileInf extends HTMLElement {
    constructor() {
        super();
        this.studentData = null;
    }

    async connectedCallback() {
        await this.fetchLoginData();
        this.querySelector('#studentBtn').addEventListener('click', () => this.student());
        this.querySelector('#teacherBtn').addEventListener('click', () => this.teacher());
    }

    renderProfile() {
        const { image, first_name, last_name, email, phone, teacher_info } = this.studentData;
        const firstLetterOfLastName = last_name ? last_name.charAt(0) : '';
        this.innerHTML = `
        <section class="profile-header">
            <div class="BGCont">
            </div>
            <div class="Information">
                <div class="pH-left-info">
                    <div class="ProfPicCnt">
                        <img src="${image}" alt="" class="ProfPic">
                        <button class="profPicBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"/></svg>
                        </button>
                    </div>
                    <div class="text-info">
                        <h2>${firstLetterOfLastName}. ${first_name}</h2>
                        <p>Мэдээллийн технологи, электроникийн сургууль</p>
                    </div>
                </div>
            </div>
        </section>

        <!--Dashboard-->

        <div class="dashBoard">
            <div class="menuUnderline">
                <button id="studentBtn" class="studentBtn" onclick="this.getRootNode().host.student()">Сурч буй</button>
            </div>
            <div class="menuUnderline">
                <button id="teacherBtn" class="teacherBtn" onclick="this.getRootNode().host.teacher()">Зааж буй</button>
            </div>
        </div>

        <div class="main">
            <section class="Container" id="student">
                <div class="leftCont">
                    <h1>Танд Санал болгох</h1>
                    <div class="tutors-box" id="tutors">
                    </div>

                    <div class="PostsCont">
                        <h1>Таны үзэж буй хичээлүүд</h1>
                        <div class="post">
                            <h2>Веб аппликейшн</h2>
                            <div class="postLesson">
                                <div class="teacherPro">
                                    <img src="/imgs/img10.png" alt="">
                                    <h3>Б.Галдан</h3>

                                </div>
                                <div class="postInfo">
                                    <div class="postInfoLine">
                                        <p class="bigTag">хувиар: </p>
                                        <p>Мягмар 7:40</p>
                                        <p>Лхагва 7:40</p>
                                        <p>Баасан 7:40</p>
                                    </div>
                                    <div class="postInfoLine">
                                        <p class="bigTag">Орох байршил:</p>
                                        <p>Онлайн</p>
                                        <p>Танхим</p>
                                    </div>
                                    <div>
                                        <button class="important-button">Утасны дугаар</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rightCont">
                    <div class="form-container">
                        <h3>Ерөнхий мэдээлэл </h3>
                        <div class="fullName">
                            <div class="form-group">
                                <label for="firstname">Нэр</label>
                                <input type="text" id="firstname" value="${first_name}">
                            </div>
                            <div class="form-group">
                                <label for="lastname">Овог</label>
                                <input type="text" id="lastname" value="${last_name}">
                            </div>
                        </div>


                        <div class="form-group">
                            <label for="email">Имэйл хаяг</label>
                            <div class="input-with-icon">
                                <input type="email" id="email" value="${email}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="phone">Утасны дугаар</label>
                            <div class="input-with-icon">
                                <input type="tel" id="phone" value="${phone}">
                            </div>
                        </div>

                        <button class="important-button">Засварлах</button>
                        <br>
                        <h3>Нууц үг солих</h3>
                        <div class="form-group">
                            <label for="oldPass">Одоогийн нууц үг</label>
                            <div class="input-with-icon">
                                <input type="password" id="oldPass">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="Pass">Шинэ нууц үг</label>
                            <div class="input-with-icon">
                                <input type="password" id="Pass">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="rePass">Шинэ нууц үг давтах</label>
                            <div class="input-with-icon">
                                <input type="password" id="rePass">
                            </div>
                        </div>

                        <button class="important-button">Засварлах</button>
                    </div>
                </div>
            </section>
            <section class="Container" id="teacher">
                <div class="leftCont">
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progressBg">
                            </div>
                            <div class="progress" style="width: 10%;"></div>
                        </div>
                        <div class="progressName">
                            <div class="ProgressRank">
                                <p>Ботго</p>
                                <div class="bubbles"></div>
                                <p>0</p>
                            </div>
                            <div class="ProgressRank">
                                <p>Тором</p>
                                <div class="bubbles"></div>
                                <p>20</p>
                            </div>
                            <div class="ProgressRank">
                                <p>Лаг Тором</p>
                                <div class="bubbles"></div>
                                <p>50</p>
                            </div>
                            <div class="ProgressRank">
                                <p>Их багш</p>
                                <div class="bubbles"></div>
                                <p>100</p>
                            </div>
                        </div>
                    </div>
                    <div class="timetableCont">
                        <h2>Таны хувиар</h2>
                        <br>
                        <div class="timetable">
                            <div class="header">Цаг</div>
                            <div class="header">Да</div>
                            <div class="header">Мя</div>
                            <div class="header">Лха</div>
                            <div class="header">Пү</div>
                            <div class="header">Ба</div>

                            <div class="header">07:40 - 09:10</div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>

                            <div class="header">09:20 - 10:50</div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>

                            <div class="header">11:00 - 12:30</div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>

                            <div class="header">12:40 - 14:10</div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>

                            <div class="header">14:20 - 15:50</div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>

                            <div class="header">16:00 - 17:30</div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>

                            <div class="header">17:40 - 19:20</div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                            <div class="cell"></div>
                        </div>
                    </div>
                </div>

                <div class="rightCont">
                    <div class="CommonCont">
                        <h3>Танилцуулга</h3>
                        <p>
                            ${teacher_info}
                        </p>
                        <button class="important-button">
                            Танилцуулга солих
                        </button>
                    </div>

                    <div class="CommonCont">
                        <h3>
                            Заадаг чиглэлүүд
                        </h3>
                        <div class="subjects-tags">
                            <p>Алгоритм</p>
                            <p>Математик 1б</p>
                            <p>Програмчлалын хэл Си</p>
                            <p>Математик 1a</p>
                            <p>Математик 1B</p>

                        </div>
                        <button class="important-button">
                            Засварлах
                        </button>
                    </div>

                </div>
            </section>
        </div>
        `;
        this.querySelector('#studentBtn').addEventListener('click', () => this.student());
        this.querySelector('#teacherBtn').addEventListener('click', () => this.teacher());

    }

    async fetchLoginData() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const email = urlParams.get('email');
        const password = urlParams.get('password');
    
        if (!email || !password) {
            console.error('Email or password is missing from query parameters.');
            return;
        }
    
        const loginData = { email, password };
    
        try {
            const response = await fetch('http://localhost:3000/api/students/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
    
            if (response.ok) {
                const data = await response.json();
                this.studentData = data.student;
                this.renderProfile();
                this.student();
            } else {
                const errorData = await response.json();
                console.error('Login Error:', errorData.error);
                const errorMessageElement = document.getElementById('error-message-login');
                if (errorMessageElement) {
                    errorMessageElement.textContent = errorData.error;
                }
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            const errorMessageElement = document.getElementById('error-message-login');
            if (errorMessageElement) {
                errorMessageElement.textContent = 'Серверт холбогдоход алдаа гарлаа';
            }
        }
    }

    student() {
        document.getElementById('student').classList.add('active');
        document.getElementById('teacher').classList.remove('active');

        document.getElementById('studentBtn').classList.add('active');
        document.getElementById('teacherBtn').classList.remove('active');
    }

    teacher() {
        document.getElementById('teacher').classList.add('active');
        document.getElementById('student').classList.remove('active');
        document.getElementById('studentBtn').classList.remove('active');
        document.getElementById('teacherBtn').classList.add('active');
    }


}

customElements.define('profile-inf', ProfileInf);
