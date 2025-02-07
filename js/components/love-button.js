class LoveButton extends HTMLElement {
    constructor() {
      super();
      this.isLoved = false; // love button төлөвийг хянах
    }
  
    connectedCallback() {
      this.id = this.getAttribute("did");
      this.isLoved = lovedTutorsManager.lovedTutors.includes(this.id); // төлөвийг эхлүүлэх
      this.render();
      this.addEventListener("click", this.handleLoveClick.bind(this));
    }
  
    handleLoveClick() {
      const tutorId = this.id;
  
      if (this.isLoved) {
        // loved list дотор байвал арилгах
        const removed = lovedTutorsManager.removeTutor(tutorId);
        if (removed) {
          this.isLoved = false;
        }
      } else {
        // loved list дотор байхгүй бол нэмэх
        const added = lovedTutorsManager.addTutor(tutorId);
        if (added) {
          this.isLoved = true;
        }
      }
  
      // Button өнгийг нь төлөвийн дагуу өөрчлөх
      this.updateButtonAppearance();
  
      // custom event
      const event = new CustomEvent("tutor-loved", {
        bubbles: true, //DOM-д оруулах
        detail: { tutorId, isLoved: this.isLoved }
      });
      this.dispatchEvent(event);
    }
  
    updateButtonAppearance() {
      const heartIcon = this.querySelector(".heart-icon");
      heartIcon.style.fill = this.isLoved ? "var(--base-color-orange)" : "rgba(186, 188, 188, 0.4)";
    }
  
    render() {
      this.innerHTML = `
        <button style="padding: 5px" class="love" data-id="${this.id}" aria-label="love" onclick="event.preventDefault();">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            stroke="var(--base-color-dark-grey)"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="heart-icon"
            style="width: 24px; height: 24px;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.49l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" ></path>
          </svg>
        </button>
      `;
      this.updateButtonAppearance(); // love button ий будах
    }
  }
  
  customElements.define('love-button', LoveButton);