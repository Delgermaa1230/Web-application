class ContactTutor extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        const { id, image, lastName, firstName, ratings, numberOfRatings, description, ranking } = bagsh;
        const firstLetterOfLastName = lastName.charAt(0);
        this.innerHTML =`
        <div cass="sticky-part-wrapper">
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

                    <div class="header">9:00am - 10:00am</div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>

                    <div class="header">10:00am - 11:00am</div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>

                    <div class="header">11:00am - 12:00am</div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                </div>
            </div>
            <form action="">
                <label for="message">
                    <h2>Таны мессеж</h2>
                </label>
                <textarea type="text" id="message" name="message"></textarea>
                <label for="phone">
                    <h2>Утас</h2>
                </label>
                <input type="tel" id="phone" name="phone">
                <br>
                <br>
                <button class="important-button" type="submit"><a href="">Баталгаажуулах</a></button>
            </form>
        </div>
        `;
    }
        

}

customElements.define('contact-tutor', ContactTutor);