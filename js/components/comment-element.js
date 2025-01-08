class CommentElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const commentinf = JSON.parse(this.getAttribute('comment-data')); 
        const { student_first_name, student_last_name, image, comment } = commentinf;
        this.setAttribute('class', 'comment');
        this.innerHTML = `
        <div class="comment-owner">
             <img src="${image}" alt="user">
             <h3>${student_first_name} ${student_last_name}</h3>
        </div>
        <p>${comment}</p>
        `;
    }
}

customElements.define('comment-element', CommentElement);
