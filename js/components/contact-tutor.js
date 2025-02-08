class ContactTutor extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        const { id, image, firstName, firstLetterOfLastName, ratings, numberOfRatings, description, ranking, possibleHours, price } = bagsh;

        this.innerHTML = `
        <div class="sticky-part-wrapper">
            <sticky-box data-bagsh='${JSON.stringify(bagsh)}'></sticky-box>
        </div>
        <div class="contact-forms" style="display: flex; flex-direction: column; align-items: center;">
    <div>
        <h2>Цаг сонгох</h2>
        <time-table class="timetable" schedule-data='${JSON.stringify(possibleHours)}'></time-table>
    </div>
    <form id="contact-form">
        <label for="message">
            <h2>Таны мессеж</h2>
        </label>
        <textarea type="text" id="message" name="message"></textarea>
    </form>
    <button class="important-button" onclick="window.location.href='./login.html'" style="align-self:center;">Баталгаажуулах</button>
</div>

        `;
    }
}

customElements.define('contact-tutor', ContactTutor);

