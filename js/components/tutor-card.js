import { escapeHtml } from '../modules/escapeHtml.js';

class TutorCard extends HTMLElement {
    static get observedAttributes() { return ['data-bagsh']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-bagsh' && oldValue !== newValue) this.render();
    }

    connectedCallback() { this.render(); }

    render() {
        const tutor = JSON.parse(this.getAttribute('data-bagsh') || '{}');
        const { id, image, lastName = '', firstName = '', ratings, numberOfRatings,
            description = '', price } = tutor;
        const defaultAvatar = !image || image.includes('profile-icon-design-free-vector.jpg');
        const onHome = ['/', '/index.html'].includes(window.location.pathname);
        const hasReviews = Number(numberOfRatings) > 0;
        const reviews = hasReviews
            ? `${Number(ratings).toFixed(1)} (${numberOfRatings} санал)`
            : '';
        const hourly = Number(price) === 0 ? 'Үнэгүй' : `${Number(price).toLocaleString('mn-MN')}₮/цаг`;

        this.innerHTML = `
            <style>
                .tutorCard { display: flex; flex-direction: column; gap: var(--base-size);
                    width: 100%; height: 100%; align-items: stretch; }
                .tutorImage { width: 100%; overflow: hidden; position: relative;
                    border-radius: var(--base-border-radius-x2); aspect-ratio: 1 / 1; }
                .tutorImage img { width: 100%; height: 100%; object-fit: cover; transition: var(--base-transition); }
                a:hover .tutorImage img { scale: 1.05; }
                .tutor-avatar { width: 100%; height: 100%; display: grid; place-items: center;
                    background: var(--base-color-light-orange); color: var(--base-color-orange);
                    font-size: clamp(34px, 5vw, 60px); font-weight: 800; }
                .tutorCard h3 { font-size: var(--base-h4-font-size); padding: 0 var(--base-size-x2);
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .tutorCard p { padding: 0 var(--base-size-x2); font-size: var(--base-caption-font-size); }
                .tutorCard p.tutorReviews { display: flex; align-items: center; flex-wrap: wrap;
                    gap: 5px; color: var(--base-grey-text-color); }
                .tutorReviews .card-price { margin-left: auto; color: var(--base-color-orange);
                    font-weight: 700; white-space: nowrap; }
                .tutorCard p.tutorDescription { display: -webkit-box; -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical; overflow: hidden; }
            </style>
            <a href="/pages/teachInfo.html?id=${escapeHtml(id)}">
                <section class="tutorCard">
                    <div class="tutorImage">
                        ${defaultAvatar
                            ? `<div class="tutor-avatar" aria-label="${escapeHtml(firstName)} ${escapeHtml(lastName)}">${escapeHtml(firstName[0] || '?')}</div>`
                            : `<img src="${escapeHtml(image)}" alt="${escapeHtml(firstName)} ${escapeHtml(lastName)}">`}
                        <love-button did="${escapeHtml(id)}"></love-button>
                    </div>
                    <h3>${escapeHtml(lastName[0] || '')}. ${escapeHtml(firstName)}</h3>
                    ${hasReviews || !onHome ? `<p class="tutorReviews">${hasReviews
                        ? `<span aria-hidden="true">★</span><span>${escapeHtml(reviews)}</span>` : ''}
                        ${onHome ? '' : `<span class="card-price">${escapeHtml(hourly)}</span>`}</p>` : ''}
                    <p class="tutorDescription">${escapeHtml(description)}</p>
                </section>
            </a>`;
    }
}

customElements.define('tutor-card', TutorCard);
