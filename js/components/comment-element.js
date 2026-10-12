class CommentElement extends HTMLElement {
    connectedCallback() {
        const review = JSON.parse(this.getAttribute('comment-data') || '{}');
        this.className = 'review-item';
        this.replaceChildren();
        const heading = document.createElement('h3');
        heading.textContent = `${review.student_first_name || ''} ${review.student_last_name || ''}`.trim();
        const meta = document.createElement('p');
        meta.className = 'app-muted';
        meta.textContent = `${review.lesson_name ? `Судалсан хичээл: ${review.lesson_name} · ` : ''}${review.rating || ''}/5`;
        const body = document.createElement('p');
        body.textContent = review.comment || '';
        this.append(heading, meta, body);
    }
}

customElements.define('comment-element', CommentElement);
