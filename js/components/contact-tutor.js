class ContactTutor extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        const { id, image, lastName, firstName, ratings, numberOfRatings, description, ranking, possibleHours } = bagsh;
        const firstLetterOfLastName = lastName.charAt(0);
        this.innerHTML = `
        <div class="sticky-part-wrapper">
            <section class="teacher-sticky-box">
                <div class="student-number">
                    <p>Цол</p>
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
                    <span>10'000₮/цаг</span>
                </div>
            </section>
        </div>
        <div class="contact-forms">
            <div>
                <h2>Цаг сонгох</h2>
                <time-table class="timetable" schedule-data='${JSON.stringify(possibleHours)}' ></time-table>
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

        this.querySelectorAll(".cell").forEach(cell => {
            cell.addEventListener("click", function () {
                this.classList.toggle("selected");
            });
        });

        const form = this.querySelector('#contact-form');
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            alert('Form submitted!');
        });

        this.querySelectorAll('.cell.selected').forEach(cell => {
                formData.selectedTimes.push(cell.textContent.trim());
            });

            fetch('http://localhost:3000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Data submitted successfully!');
            })
            .catch(error => {
                alert('Error submitting data: ' + error.message);
            });
    }
}

customElements.define('contact-tutor', ContactTutor);
