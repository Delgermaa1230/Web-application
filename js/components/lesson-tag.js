//багшийн заадаг хичээлийг харуулах component
class LessonTag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.name = this.getAttribute("name"); 
        this.render();
    }

    render() {
        const item = document.createElement('li');
        item.textContent = this.name;
        this.replaceChildren(item);
    }
}

customElements.define('lesson-tag', LessonTag);
