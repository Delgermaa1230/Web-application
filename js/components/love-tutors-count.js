class LovedTutorsCount extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.updateCount();
    
    lovedTutorsManager.subscribe(() => {
      this.updateCount();
    });
  }

  updateCount() {
    const count = lovedTutorsManager.getCount();
    this.shadowRoot.querySelector('#count').textContent = count;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-size: var(--base-h2-font-size);
          font-weight: var(--base-bold-font-weight);
          color: var(--base-text-color);
          border-radius: var(--base-border-radius-x3);
          background: var(--base-color-grey-light);
        }
      </style>
      <span id="count">0</span>
    `;
  }
}

customElements.define('loved-tutors-count', LovedTutorsCount);
