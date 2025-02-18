class StickyBox extends HTMLElement {
    constructor() {
        super();
        this._bagsh = null;
        this._showContact = false;
    }

    static get observedAttributes() {
        return ['data-bagsh', 'data-show-contact'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'data-bagsh') {
                this.bagsh = JSON.parse(newValue);
            } else if (name === 'data-show-contact') {
                this.showContact = newValue !== null;
            }
        }
    }

    get bagsh() {
        return this._bagsh;
    }

    set bagsh(value) {
        this._bagsh = value;
        this.render();
    }

    get showContact() {
        return this._showContact;
    }

    set showContact(value) {
        this._showContact = value;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this._bagsh) return;

        const { id, image, firstName, firstLetterOfLastName, ratings, numberOfRatings, ranking, price } = this._bagsh;

        this.innerHTML = `
            <section class="teacher-sticky-box">
                <div class="student-number">
                    <p>Цол : <span><b>${ranking}</b></span></p>
                    <love-button did="${id}" ></love-button>
                </div>
                <div class="image"><img src="${image}" alt="teacher"></div>
                <h2>${firstLetterOfLastName}. ${firstName}</h2>
                <div class="rating">
                    <span><b>${ratings}</b></span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EAC452">
                        <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Z"/>
                        <path d="M233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                    </svg>
                    <p>(${numberOfRatings} санал)</p>
                </div>
                <div class="wage">
                    <p>Төлбөр</p>
                    <span>${price}₮/цаг</span>
                </div>
                ${this._showContact ? `<button class="important-button" onclick="location.href='./contactTeacher.html?id=${id}'">Холбогдох</button>` : ''}
            </section>`;
    }
}

customElements.define('sticky-box', StickyBox);
