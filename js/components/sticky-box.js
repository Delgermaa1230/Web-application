// contactTeacher.html болон teacherInfo.html хуудсанд буй 
// багшийн ерөнхий мэддээллийг агуулсан component
class StickyBox extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        const showContact = this.hasAttribute('data-show-contact');   

        const { id, image, firstName, firstLetterOfLastName, ratings, numberOfRatings, ranking, price } = bagsh;

        this.innerHTML = `
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
                ${showContact ? `<button class="important-button"><a href="./contactTeacher.html?id=${id}">Холбогдох</a></button>` : ''}
            </section>`;
    }
}

customElements.define('sticky-box', StickyBox);
