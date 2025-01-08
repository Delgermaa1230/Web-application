class CommentElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const comment = JSON.parse(this.getAttribute('comment-data'));  // Corrected: 'comment-data' should be a string
        const { firstName, lastName, image, comments } = comment;
        this.setAttribute('class', 'comment');
        this.innerHTML = `
        <div class="comment-owner">
             <img src="${image}" alt="user">
             <h3>${firstName} ${lastName}</h3>
        </div>
        <p>${comments}</p>
        `;
    }
}

customElements.define('comment-element', CommentElement);
