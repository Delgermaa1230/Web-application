class ContactTutor extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        const { id, image, lastName, firstName, ratings, numberOfRatings, description, ranking } = bagsh;
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
            </div>
            <form id="contact-form">
                <label for="message">
                    <h2>Таны мессеж</h2>
                </label>
                <textarea type="text" id="message" name="message"></textarea>
                <label for="phone">
                    <h2>Утас</h2>
                </label>
                <input type="tel" id="phone" name="phone">
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
