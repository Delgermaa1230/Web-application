class Timetable extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const possibleHours = JSON.parse(this.getAttribute('schedule-data'));

        this.innerHTML = `
            <style>
                .timetable {
                    border-radius: var(--base-border-radius-x3);
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 6px;
                    width: 100%;
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

                .cell.po {
                    background-color: var(--base-color-secondary-orange);
                }

                .cell.po:hover {
                    background-color: var(--base-color-orange);
                }

                .cell.po.selected {
                    background-color: var(--base-color-orange);
                }

            </style>
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
            <div class="cell"></div>`;
        this.renderSchedule(possibleHours);
    }

    renderSchedule(possibleHours) {
        console.log(possibleHours);
    
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const timeslots = [
            "07:40 - 09:10",
            "09:20 - 10:50",
            "11:00 - 12:30",
            "12:40 - 14:10",
            "14:20 - 15:50",
            "16:00 - 17:30",
            "17:40 - 19:20"
        ];
    
        const allCells = this.querySelectorAll(".cell");
    
        days.forEach((day, dayIndex) => {
            if (possibleHours[day]) {
                possibleHours[day].forEach((isAvailable, timeIndex) => {
                    if (isAvailable === 1) {
                        const cellIndex = timeIndex * 5 + dayIndex;
                        const cell = allCells[cellIndex];
                        if (cell) {
                            cell.classList.add('po');
                        }
                    }
                });
            }
        });
    }
}

customElements.define('time-table', Timetable);