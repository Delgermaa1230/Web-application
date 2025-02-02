class LovedTutorsCount extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.render();
      this.updateCount();
  
      // Төлвийн өөрчлөлтийг мэдэх
      lovedTutorsManager.subscribe(() => {
        this.updateCount();
      });
    }
  
    updateCount() {
      const count = lovedTutorsManager.getCount();
      this.innerHTML = `Loved Tutors: ${count}`;
    }
  
    render() {
      this.innerHTML = `Loved Tutors: 0`; 
    }
  }
  
  customElements.define('loved-tutors-count', LovedTutorsCount);