// багшийн дэлгэрэнгүй мэдээллийг харуулах component
class TutorMorePage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        if (!bagsh) {
            console.error('TutorMorePage: Missing or invalid "data-bagsh" attribute.');
            return;
        }

        const { description, moreDescription, teachingDescription, lessons, comments, possibleHours } = bagsh;

        this.innerHTML = `
            <div class="sticky-part-wrapper">
                <sticky-box data-bagsh='${JSON.stringify(bagsh)}' data-show-contact ></sticky-box>
            </div>
            <section class="information-column">
                <div class="subjects-tags" id="lesson-container">
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
                    <time-table class="timetable" schedule-data='${JSON.stringify(possibleHours)}'></time-table>
                </section>
                <section class="comment-box">
                    <h2>Сэтгэгдэл</h2>
                </section>
            </section>
        `;

        this.renderLessons(lessons);
        this.renderComments(comments);
    }

    // Багшийн зааж буй хичээлүүдийн render хийж буй function
    renderLessons(lessons) {
        const ul = document.createElement('ul');
        ul.setAttribute('lessons-data', JSON.stringify(lessons));

        lessons.forEach((lesson) => {
            const li = document.createElement('li');
            li.textContent = lesson.lesson_name;
            ul.appendChild(li);
        });

        this.querySelector('.subjects-tags').appendChild(ul);
    }

    // Багш дээр ирсэн сэтгэгдэлүүдийг comment-element component ашиглан
    // render хийж буй function
    renderComments(comments) {
        const box = this.querySelector('.comment-box');

        comments.forEach((c) => {
            const commentElement = document.createElement('comment-element');
            commentElement.setAttribute('comment-data', JSON.stringify(c));
            box.appendChild(commentElement);
        });
    }
}

customElements.define('tutor-morepage', TutorMorePage);
