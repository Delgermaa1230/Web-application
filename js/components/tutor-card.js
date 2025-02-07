class TutorCard extends HTMLElement {
  constructor() {
      super();
      this.bagsh = {};
  }

  static get observedAttributes() {
      return ['data-bagsh'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'data-bagsh' && oldValue !== newValue) {
          this.bagsh = JSON.parse(newValue);
          this.render();
      }
  }

  connectedCallback() {
      this.bagsh = JSON.parse(this.getAttribute('data-bagsh') || '{}');
      this.render();
  }

  render() {
      const { id, image, lastName, firstName, ratings, numberOfRatings, description, price } = this.bagsh;
      const firstLetterOfLastName = lastName ? lastName.charAt(0) : '';

      this.innerHTML = `
          <a href="/pages/teachInfo.html?id=${id}">
            <section class="tutorCard">
              <div class="tutorImage">
                <img src="${image}" alt="${firstName} ${lastName}">
                <love-button did="${id}"></love-button>
              </div>
              <h3>${firstLetterOfLastName}. ${firstName}</h3>
              <p class="tutorReviews">
                  <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#EAC452">
                    <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Z"/>
                    <path d="M233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
                  </svg>
                <span id="starsNumber">${ratings}</span>
                <span id="reviewsNumber">(${numberOfRatings} санал)</span>
                <span style="font-weight: bold; font-size: 12px; color: var(--base-color-orange)">${price}₮/ц</span>
              </p>
              <p class="tutorDescription">${description}</p>
            </section>
          </a>
      `;
  }
}

customElements.define('tutor-card', TutorCard);
