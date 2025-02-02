// багшийн ерөнхий мэдээллийг агуулж буй кард
class TutorCard extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      const bagsh = JSON.parse(this.getAttribute('data-bagsh'));
      const { id, image, lastName, firstName, ratings, numberOfRatings, description } = bagsh;
      const firstLetterOfLastName = lastName.charAt(0);
  
      this.innerHTML = `
        <a href="/pages/teachInfo.html?id=${id}">
          <section class="tutorCard">
            <div class="tutorImage">
              <img src="${image}" alt="${firstName} ${lastName}">
              <love-button did="${id}"></love-button>
            </div>
            <h3>${firstLetterOfLastName}. ${firstName}</h3>
            <p class="tutorReviews">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#EAC452">
                  <path d="m305-704 112-145q12-16 28.5-23.5T480-880q18 0 34.5 7.5T543-849l112 145 170 57q26 8 41 29.5t15 47.5q0 12-3.5 24T866-523L756-367l4 164q1 35-23 59t-56 24q-2 0-22-3l-179-50-179 50q-5 2-11 2.5t-11 .5q-32 0-56-24t-23-59l4-165L95-523q-8-11-11.5-23T80-570q0-25 14.5-46.5T135-647l170-57Zm49 69-194 64 124 179-4 191 200-55 200 56-4-192 124-177-194-66-126-165-126 165Zm126 135Z"/>
                </svg>
              </i>
              <span id="starsNumber">${ratings}</span>
              <span id="reviewsNumber">(${numberOfRatings} санал)</span>
            </p>
            <p class="tutorDescription">${description}</p>
          </section>
        </a>
      `;
    }
  }
  
  customElements.define('tutor-card', TutorCard);