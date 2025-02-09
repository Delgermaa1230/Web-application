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
        this.addEventListener('tutor-loved', this.handleTutorLoved.bind(this)); 
    }
  
    disconnectedCallback() {
        this.removeEventListener('tutor-loved', this.handleTutorLoved); 
    }
  
    handleTutorLoved(event) {
        const { tutorId, isLoved } = event.detail;
        console.log("budaarai", event.detail);
  
        if (isLoved) {
            console.log("budaj bolnoo");
            this.shadowEffect(true); 
        } else {
            this.shadowEffect(false); 
        }
    }
  
    shadowEffect(isLoved) {
        const tutorImage = this.querySelector('.tutorImage');
        if (tutorImage) {
            tutorImage.style.boxShadow = isLoved ? '0 0 5px 5px rgba(255, 165, 0, 0.2)' : '';
        }
    }
  
    render() {
        const { id, image, lastName, firstName, ratings, numberOfRatings, description, price } = this.bagsh;
        const firstLetterOfLastName = lastName ? lastName.charAt(0) : '';
        const indexpge= window.location.pathname.includes('index.html');
  
        this.innerHTML = `
            <style>
            .tutorCard {
             display: flex;
                  flex-direction: column;
                  gap: var(--base-size);
                  align-items: stretch;
                  height: 100%;
                  width: 100%;
              }
  
              h2 {
                  font-size: var(--base-h2-font-size);
                  margin-bottom: var(--base-size-x3);
                  color: var(--base-text-color);
              }
  
              .tutorImage {
                  width: 100%;
                  overflow: hidden;
                  position: relative;
                  border-radius: var(--base-border-radius-x2);
                  aspect-ratio: 1 / 1;
              }
  
              .tutorImage img {
                  width: 100%;         
                  height: 100%;         
                  object-fit: cover; 
                  transition: var(--base-transition); 
              }   
  
              .tutors-box a:hover {
                  .tutorImage img {
                      scale: 1.05;
                  }
              }
  
              .tutorCard h3 {
                  font-size: var(--base-h4-font-size);
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  padding:0 var(--base-size-x2);
              }
  
              .tutorCard p {
                  padding: 0 var(--base-size-x2);
                  font-size: var(--base-caption-font-size);
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
              }
  
              .tutorCard span {
                  font-size: var(--base-caption-font-size);
              }
            </style>
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
                   ${!indexpge? `<span style="font-weight: bold; font-size: 12px; color: var(--base-color-orange)">${price}₮/ц</span>` : ''}  
                </p>
                <p class="tutorDescription">${description}</p>
              </section>
            </a>
        `;
    }
  }
  
  customElements.define('tutor-card', TutorCard);
  