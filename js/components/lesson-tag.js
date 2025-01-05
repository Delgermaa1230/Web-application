class LessonTag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.name = this.getAttribute("name"); 
        this.render();
    }

    render() {
        this.innerHTML =`
            <li>${this.name}</li>
        `;
    }
}

customElements.define('lesson-tag', LessonTag);