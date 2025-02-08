class Timetable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._state = 'default'; 
    }

    static get observedAttributes() {
        return ['state']; 
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'state') {
            this._state = newValue;
            this.updateStyle();
        }
    }

    connectedCallback() {
        const style = `
            <style>
                :host([state="default"]) .cell {
                    background-color: var(--base-color-grey-medium);
                }

                :host([state="selected"]) .cell.selected {
                    background-color: var(--base-color-orange);
                }

                :host([state="unselected"]) .cell.unselected {
                    background-color: var(--base-color-grey-light);
                }

                .timetable {
                    border-radius: var(--base-border-radius-x3);
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 6px;
                    width: auto;
                    margin: 0 auto;
                    background-color: var(--base-color-light-orange);
                    padding: var(--base-size-x4);
                    border: 0.5px solid var(--base-color-orange);
                }

                .cell {
                    background: var(--base-color-grey-medium);
                    border: 1px black solid;
                    padding: var(--base-size);
                    text-align: center;
                    transition: background-color 0.3s ease;
                }

                .header {
                    color: var(--base-text-color);
                    padding: var(--base-size);
                    font-size: var(--base-caption-font-size);
                    font-weight: var(--base-medium-font-weight);
                }        
                .cell{
                    background-color: var(--base-color-secondary-orange);
                }

                .cell:hover {
                    background-color: var(--base-color-orange);
                }

                .cell.po.selected {
                    background-color: var(--base-color-orange);
                }
            </style>
        `;

        const template = `
            <div class="timetable">
                <div class="header">Цаг</div>
                <div class="header">Да</div>
                <div class="header">Мя</div>
                <div class="header">Лха</div>
                <div class="header">Пү</div>
                <div class="header">Ба</div>

                <div class="header">07:40 - 09:10</div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>

                <div class="header">09:20 - 10:50</div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                
                <div class="header">11:00 - 12:30</div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>

                <div class="header">12:40 - 14:10</div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>

                <div class="header">14:20 - 15:50</div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>

                <div class="header">16:00 - 17:30</div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>

                <div class="header">17:40 - 19:20</div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>
        `;
        this.shadowRoot.innerHTML = `${style}${template}`;

        this.renderSchedule();
    }

    renderSchedule() {
        const allCells = this.shadowRoot.querySelectorAll(".cell");

        allCells.forEach(cell => {
            cell.addEventListener('click', () => this.toggleSelection(cell));
        });
    }

    toggleSelection(cell) {
        if (cell.classList.contains('selected')) {
            cell.classList.remove('selected');
            cell.classList.add('unselected');
            this.setAttribute('state', 'unselected'); 
        } else {
            cell.classList.remove('unselected');
            cell.classList.add('selected');
            this.setAttribute('state', 'selected'); 
        }
    }

    updateStyle() {
        console.log(`Current state: ${this._state}`);
    }
}

customElements.define('time-table', Timetable);
