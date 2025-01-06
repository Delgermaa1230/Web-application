class TutorMorePage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        const { id, image, lastName, firstName, ratings, numberOfRatings, description, ranking, moreDescription, teachingDescription, price, lessons } = bagsh;
        const firstLetterOfLastName = lastName.charAt(0);
        
        this.innerHTML = `
            <div class="sticky-part-wrapper">
                <section class="teacher-sticky-box">
                    <div class="student-number">
                        <p>Цол :</p>
                        <span><b>${ranking}</b></span>
                    </div>
                    <div class="image"><img src="${image}" alt="teacher"></div>
                    <h2>${firstLetterOfLastName}. ${firstName}</h2>
                    <div class="rating">
                        <span><b>${ratings}</b></span>
                        <span><i class="fa fa-star"></i></span>
                        <p>(${numberOfRatings} санал)</p>
                    </div>
                    <div class="wage">
                        <p>Төлбөр</p>
                        <span>${price}₮/цаг</span>
                    </div>
                    <button class="important-button"><a href="./contactTeacher.html?id=${id}">Холбогдох</a></button>
                </section>
            </div>
            <section class="information-column">
                <div class="subjects-tags" id="lesson-container">
                    <!-- Lessons will be rendered here -->
                </div>
                <h1>${description}</h1>
                <div class="teaching-location">
                    <ul>
                        <li>Online</li>
                    </ul>
                </div>
                <section class="about-lesson-box">
                    <h2>Багшийн тухай</h2>
                    <p>${moreDescription}</p>
                </section>
                <section class="about-lesson-box">
                    <h2>Хичээлийн тухай</h2>
                    <p>${teachingDescription}</p>
                </section>
                <section class="available-schedule-box">
                    <h2>Боломжит цаг</h2>
                    <div>
                <h2>Цаг сонгох</h2>
                <div class="timetable">
                    <div class="header">Цаг</div>
                    <div class="header">Даваа</div>
                    <div class="header">Мягмар</div>
                    <div class="header">Лхагва</div>
                    <div class="header">Пүрэв</div>
                    <div class="header">Баасан</div>

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
                </section>
                <section class="comment-box">
                    <h2>Сэтгэгдэл</h2>
                    <section class="comment">
                        <div class="comment-owner">
                            <img src="/imgs/img3.png" alt="user">
                            <h3>Нямаа Батпүрэв</h3>
                        </div>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                    </section>
                    <section class="comment">
                        <div class="comment-owner">
                            <img src="/imgs/img2.png" alt="user">
                            <h3>Нямаа Батпүрэв</h3>
                        </div>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit...</p>
                    </section>
                </section>
            </section>
        `;
        
        this.renderLessons(lessons);
    }

    renderLessons(lessons) {
        const ul = document.createElement("ul");
        ul.setAttribute("lessons-data", `${lessons}`);
        
        lessons.forEach(lesson => {
            const li = document.createElement("li");
            li.textContent = lesson;
            ul.appendChild(li);
        });
        
        this.querySelector('.subjects-tags').appendChild(ul);
    }
}

customElements.define('tutor-morepage', TutorMorePage);
