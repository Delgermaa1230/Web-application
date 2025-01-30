// contactTeacher.html хуудсанд багшийн мэдээллийг хауулах компонент
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
        <div class="contact-forms">
            <div>
                <h2>Цаг сонгох</h2>
                <time-table class="timetable" schedule-data='${JSON.stringify(possibleHours)}'></time-table>
            </div>
            <form id="contact-form">
                <label for="message">
                    <h2>Таны мессеж</h2>
                </label>
                <textarea type="text" id="message" name="message"></textarea>
                <br><br>
                <button class="important-button" type="submit">Баталгаажуулах</button>
            </form>
        </div>
        `;

    }
}

customElements.define('contact-tutor', ContactTutor);
