class CommentElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // Shadow DOM үүсгэх
    }

    connectedCallback() {
        const template = document.createElement("template");

        template.innerHTML = `
            <style>
                :host {
                    --base-size: 8px;
                    --base-size-x2: 16px;
                    --base-size-x4: 32px;
                    --base-border-radius-x5: 12px;
                    --base-border-radius-x6: 16px;
                    --base-caption-font-size: 14px;
                    --base-regular-font-weight: 400;
                    --base-text-color: #333;
                   
                }

                .comment {
                    padding: var(--base-size-x4) var(--base-size-x2);
                    display: flex;
                    flex-direction: column;
                }

                .comment-owner {
                    display: flex;
                    justify-content: flex-start;
                    gap: var(--base-size);
                    align-items:center;
                
                }

                .comment-owner img {
                    width: var(--base-size-x4);
                    height: var(--base-size-x4);
                    border-radius: var(--base-border-radius-x6);
                    object-fit: cover;
                }

                .comment-box p {
                    font-size: var(--base-caption-font-size);
                    font-weight: var(--base-regular-font-weight);
                    letter-spacing: 0.01rem;
                    padding-left: var(--base-border-radius-x5);
                    color: var(--base-text-color);
                }
            </style>

            <div class="comment">
                <div class="comment-owner">
                    <img src="" alt="user">
                    <h3><slot name="student-name"></slot></h3>
                </div>
                <div class="comment-box">
                    <p><slot name="comment-text"></slot></p>
                </div>
            </div>
        `;

        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(template.content.cloneNode(true));

        const commentData = JSON.parse(this.getAttribute('comment-data'));
        const { student_first_name, student_last_name, image, comment } = commentData;

        // Оюутны нэрийг slot-д оруулах
        const nameSlot = document.createElement("span");
        nameSlot.setAttribute("slot", "student-name");
        nameSlot.textContent = `${student_first_name} ${student_last_name}`;

        // Сэтгэгдлийг slot-д оруулах
        const commentSlot = document.createElement("span");
        commentSlot.setAttribute("slot", "comment-text");
        commentSlot.textContent = comment;

        this.appendChild(nameSlot);
        this.appendChild(commentSlot);

        // Зураг солих
        shadowRoot.querySelector("img").src = image;
    }
}

customElements.define('comment-element', CommentElement);
