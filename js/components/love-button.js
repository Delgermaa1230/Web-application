// Багшийг хадгалах lovedTeacher.html хуудсан оруулах component
class LoveButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.id = this.getAttribute("did"); 
        this.render();
    }

    render() {
        this.innerHTML =`
            <button style="padding: 5px" class="love" data-id="${this.id}" aria-label="love"><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="heart-icon"
                style="width: 24px; height: 24px;">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.49l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="rgba(255, 255, 255, 0.5)"></path>
            </svg></button>
        `;
    }
}

customElements.define('love-button', LoveButton);