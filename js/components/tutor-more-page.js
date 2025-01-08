class TutorMorePage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        const { id, image, lastName, firstName, ratings, numberOfRatings, description, ranking, moreDescription, teachingDescription, price, lessons, feedback, possibleHours } = bagsh;
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
                    <time-table class="timetable" schedule-data='${JSON.stringify(possibleHours)}' ></time-table>
                </section>
                <section class="comment-box">
                    <h2>Сэтгэгдэл</h2>
                </section>
            </section>
        `;
        
        this.renderLessons(lessons);
        this.renderComments(feedback);
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

    renderComments(feedback) {
        const box = document.querySelector('.comment-box')
        
        feedback.forEach(c => {
            const celement = document.createElement("comment-element");
            celement.setAttribute('comment-data', JSON.stringify(c))
            box.appendChild(celement);
        });
    }
}

customElements.define('tutor-morepage', TutorMorePage);
