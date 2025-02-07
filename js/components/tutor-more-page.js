class TutorMorePage extends HTMLElement {
    constructor() {
        super();
        this.bagsh = {}; 
    }

    static get observedAttributes() {
        return ['data-bagsh'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-bagsh' && oldValue !== newValue) {
            this.bagsh = JSON.parse(newValue);
            this.render();
        }
    }

    connectedCallback() {
        this.bagsh = JSON.parse(this.getAttribute('data-bagsh') || '{}');
        this.render();
    }

    render() {
        const { description, moreDescription, teachingDescription, lessons, comments, possibleHours, mode } = this.bagsh;

        this.innerHTML = `
            <div class="sticky-part-wrapper">
                <sticky-box data-bagsh='${JSON.stringify(this.bagsh)}' data-show-contact></sticky-box>
            </div>
            <section class="information-column">
                <div class="subjects-tags" id="lesson-container"></div>
                <h1>${description}</h1>
                <div class="teaching-location">
                    <ul>
                        <li>${mode}</li>
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

    renderLessons(lessons) {
        const lessonContainer = this.querySelector('.subjects-tags');
        if (!lessonContainer) return;
        lessonContainer.innerHTML = ''; // Clear existing content
        
        const ul = document.createElement('ul');
        ul.setAttribute('lessons-data', JSON.stringify(lessons));

        lessons.forEach((lesson) => {
            const li = document.createElement('li');
            li.textContent = lesson.lesson_name;
            ul.appendChild(li);
        });

        lessonContainer.appendChild(ul);
    }

    renderComments(comments) {
        const commentBox = this.querySelector('.comment-box');
        if (!commentBox) return;
        commentBox.innerHTML = '<h2>Сэтгэгдэл</h2>'; // Reset comments

        comments.forEach((c) => {
            const commentElement = document.createElement('comment-element');
            commentElement.setAttribute('comment-data', JSON.stringify(c));
            commentBox.appendChild(commentElement);
        });
    }
}

customElements.define('tutor-morepage', TutorMorePage);
