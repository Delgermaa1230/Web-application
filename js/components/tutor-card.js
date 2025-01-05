class TutorCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
        const { id, image, lastName, firstName, ratings, numberOfRatings, description } = bagsh;
        const firstLetterOfLastName = lastName.charAt(0);

        this.innerHTML = `
            <a href="/pages/teachInfo.html">
                <section class="tutorCard">
                    <div class="tutorImage">
                        <img src="${image}" alt="fe">
                        <love-button did="${id}"> ></love-button>
                    </div>
                    <h3>${firstLetterOfLastName}. ${firstName}</h3>
                    <p class="tutorReviews">
                        <i class="fa fa-star"></i>
                        <span id="starsNumber">${ratings}</span>
                        <span id="reviewsNumber">
                            (${numberOfRatings} санал)
                        </span>
                    </p>
                    <p class="tutorDescription">
                        ${description}
                    </p>
                </section>
             </a>`;
    }
}

customElements.define('tutor-card', TutorCard);
