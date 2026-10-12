import { escapeHtml } from '../modules/escapeHtml.js';

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

        const { id, image, firstName, firstLetterOfLastName, ratings, numberOfRatings, price, available } = this._bagsh;
        const defaultAvatar = !image || image.includes('profile-icon-design-free-vector.jpg');

        this.innerHTML = `
            <section class="teacher-sticky-box">
                <div class="image">${defaultAvatar
                    ? `<div class="tutor-avatar" aria-label="${escapeHtml(firstName)}">${escapeHtml(firstName?.[0] || '?')}</div>`
                    : `<img src="${escapeHtml(image)}" alt="${escapeHtml(firstName)}">`}</div>
                <h2>${escapeHtml(firstLetterOfLastName)}. ${escapeHtml(firstName)}</h2>
                ${Number(numberOfRatings) > 0 ? `<p class="rating">★ ${escapeHtml(Number(ratings).toFixed(1))} · ${escapeHtml(numberOfRatings)} сэтгэгдэл</p>` : ''}
                <p class="wage">${escapeHtml(Number(price) === 0 ? 'Үнэгүй' : `${Number(price).toLocaleString('mn-MN')}₮/цаг`)}</p>
                ${this._showContact && available ? `<a class="important-button" href="./contactTeacher.html?id=${escapeHtml(id)}">Холбогдох</a>` : ''}
            </section>`;
    }
}

customElements.define('sticky-box', StickyBox);
