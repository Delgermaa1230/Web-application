import { escapeHtml } from '../modules/escapeHtml.js';

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
        const { description, moreDescription, lessons, comments, mode, id, available } = this.bagsh;
        const modeLabel = { online: 'Онлайн', classroom: 'Танхим', hybrid: 'Онлайн болон танхим' }[mode] || mode;

        this.innerHTML = `
            <div class="sticky-part-wrapper">
                <sticky-box data-show-contact></sticky-box>
            </div>
            <section class="information-column">
                <h1>${escapeHtml(description)}</h1>
                <div class="teaching-location">
                    <ul>
                        <li>${escapeHtml(modeLabel)}</li>
                    </ul>
                </div>
                <section class="about-lesson-box">
                    <h2>Багшийн тухай</h2>
                    <p>${escapeHtml(moreDescription)}</p>
                </section>
                <section class="about-lesson-box">
                    <h2>Заах хичээлүүд</h2>
                    <div class="lesson-details app-stack"></div>
                </section>
                <section class="available-schedule-box">
                    <h2>Цаг захиалах</h2>
                    ${available ? `<a class="important-button" href="./contactTeacher.html?id=${escapeHtml(id)}">Холбогдох</a>` : ''}
                </section>
                <section class="comment-box">
                    <h2>Сэтгэгдэл</h2>
                </section>
            </section>
        `;

        this.querySelector('sticky-box').setAttribute('data-bagsh', JSON.stringify(this.bagsh));
        this.renderLessons(lessons);
        this.renderComments(comments);
    }

    renderLessons(lessons) {
        const lessonContainer = this.querySelector('.lesson-details');
        if (!lessonContainer) return;
        lessonContainer.replaceChildren();
        for (const lesson of lessons || []) {
            const card = document.createElement('article');
            card.className = 'lesson-detail';
            const heading = document.createElement('h3');
            heading.textContent = `${lesson.course_code ? lesson.course_code + ' · ' : ''}${lesson.lesson_name}`;
            const details = document.createElement('p');
            details.textContent = lesson.description || 'Хичээлийн тайлбар оруулаагүй байна.';
            const meta = document.createElement('p');
            meta.className = 'app-muted';
            meta.textContent = `${Number(lesson.price) === 0 ? 'Үнэгүй' : `${Number(lesson.price).toLocaleString('mn-MN')}₮`} / ${lesson.duration_minutes} мин · ${
                { online: 'Онлайн', classroom: 'Танхим', hybrid: 'Онлайн болон танхим' }[lesson.mode] || lesson.mode}`;
            card.append(heading, details, meta);
            lessonContainer.append(card);
        }
    }

    renderComments(comments) {
        const commentBox = this.querySelector('.comment-box');
        if (!commentBox) return;
        commentBox.innerHTML = '<h2>Сэтгэгдэл</h2>'; 

        if (!comments?.length) {
            const empty = document.createElement('p');
            empty.className = 'app-muted';
            empty.textContent = 'Энэ багшид баталгаатай сэтгэгдэл хараахан алга.';
            commentBox.append(empty);
            return;
        }

        comments.forEach((c) => {
            const commentElement = document.createElement('comment-element');
            commentElement.setAttribute('comment-data', JSON.stringify(c));
            commentBox.appendChild(commentElement);
        });
    }
}

customElements.define('tutor-morepage', TutorMorePage);
