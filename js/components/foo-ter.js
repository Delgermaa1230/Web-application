// бүх хуудсанд байх footer component
class FooTer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML =`
            <footer>
        <ul>
            <li>
                <h3>Тусламж</h3>
                <ul>
                    <li><a aria-label="question" href="./question.html">FAQs</a></li>
                    <li><a aria-label="instruction" href="./question.html">Заавар</a></li>
                </ul>
            </li>
            <li>
                <h3>Холбогдох</h3>
                    <ul>
                        <li>Утас:<a aria-label="phone" href="tel:+97688888811">+976 88 888811</a></li>
                        <li>Мэйл:<a aria-label="mail" href="mailto: example@teach.com">example@teach.com</a></li>
                    </ul>
            </li>
            <li>
                <h3>Холбоосууд</h3>
                <ul id="social-icons">
                    <li><a aria-label="instagram" href="https://www.instagram.com/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--base-text-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37a4 4 0 1 1-2.63-3.67 4 4 0 0 1 2.63 3.67z"></path>
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                    </svg>
                </a></li>
                    <li><a aria-label="facebook" href="whttps://www.facebook.com/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--base-text-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 2h3v4h-3c-1.1 0-2 .9-2 2v3h5v4h-5v10h-4V15h-3v-4h3V8c0-3.3 2.7-6 6-6z"></path>
                    </svg></a></li>
                </ul>
            </li>
        </ul>
    </footer>
        `;
    }
}

customElements.define('foo-ter', FooTer);