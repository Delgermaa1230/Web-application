class TutorMorePage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML =`
            <div class="subjects-tags">
                <ul>
                    <li>Алгоритм</li>
                    <li>Математик 1б</li>
                    <li>Програмчлалын хэл Си</li>
                </ul>
            </div>
            <h1>Матын хамгийн шилдаг багш! - Ер нь бол алноо Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h1>
            <div class="teaching-location">
                <ul>
                    <li>Online</li>
                </ul>
            </div>
            <section class="about-lesson-box">
                <h2>Багшийн тухай</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere numquam tenetur omnis, a consequatur
                    similique quam beatae nostrum vero iste tempora minima id quaerat atque, ipsa optio cupiditate
                    quidem fuga</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas quam iusto libero minima sit cumque eos
                    itaque dolorem facere qui, nesciunt distinctio labore fuga quo eligendi ullam. Enim, magnam. Odio.
                </p>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur laudantium mollitia consectetur
                     praesentium iusto voluptates, placeat repellendus vel laboriosam.</p>
            </section>
            <section class="about-lesson-box">
                <h2>Хичээлийн тухай</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere numquam tenetur omnis, a consequatur
                    similique quam beatae nostrum vero iste tempora minima id quaerat atque, ipsa optio cupiditate
                    quidem fuga</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas quam iusto libero minima sit cumque eos
                    itaque dolorem facere qui, nesciunt distinctio labore fuga quo eligendi ullam. Enim, magnam. Odio.
                </p>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur laudantium mollitia consectetur
                    praesentium iusto voluptates, placeat repellendus vel laboriosam.</p>
            </section>
            <section class="available-schedule-box">
                <h2>Боломжит цаг</h2>
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
            </section>
            <section class="comment-box">
                <h2>Сэтгэгдэл</h2>
                <section class="comment">
                    <div class="comment-owner">
                        <img src="/imgs/img3.png" alt="user">
                        <h3>Нямаа Батпүрэв</h3>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas accusantium, veritatis eius ducimus
                        dolorem explicabo cumque tempora eveniet culpa illum molestias, odit alias aliquam nulla ea
                        optio nihil laudantium porro!</p>
                </section>
                <section class="comment">
                    <div class="comment-owner">
                        <img src="/imgs/img2.png" alt="user">
                        <h3>Нямаа Батпүрэв</h3>
                    </div>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem quasi odit est quisquam ex
                        repellat
                        quos quod optio cupiditate similique? Doloremque est tenetur hic neque?</p>
                </section>
            </section>
        `;
    }
}

customElements.define('tutor-morepage', TutorMorePage);