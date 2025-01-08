class ProfileInf extends HTMLElement {
    constructor() {
        super();
        this.studentData = null;
    }

    async connectedCallback() {
        await this.fetchLoginData(); 
        const {description, email, first_name, image, last_name, lesson_info, mode, number_of_ratings, phone, rank, retings, teacher_info} = this.studentData;
        const firstLetterOfLastName = last_name.charAt(0);
        this.innerHTML = `
        <section class="profile-header">
            <div class="BGCont">
                <img src="" alt="Background Image" class="BGimage">
            </div>
            <div class="Information">
                <div class="pH-left-info">
                    <div class="ProfPicCnt">
                        <img src="${image}" alt="" class="ProfPic">
                        <button class="profPicBtn">
                            <i class="fa fa-camera" style="color: white;" aria-label="change pro"></i>
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
                <a href="" id="studentBtn" class="studentBtn" onclick="student()">Сурч буй</a>
            </div>
            <div class="menuUnderline">
                <a href="" id="teacherBtn" class="teacherBtn" onclick="teacher()">Зааж буй</a>
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
    }

    async fetchLoginData() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const email = urlParams.get('email');
        const password = urlParams.get('password');
        const loginData = { email, password };

        console.log(loginData);

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
                this.studentData = data.student; 
            } else {
                document.getElementById('error-message-login').textContent = data.error;
            }
        } catch (error) {
            document.getElementById('error-message-login').textContent = 'Серверт холбогдоход алдаа гарлаа';
        }
    }
}

customElements.define('profile-inf', ProfileInf);
