const zone = 'Asia/Ulaanbaatar';
const localParts = instant => new Date(instant).toLocaleString('sv-SE', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}).replace(' ', 'T').split('T');
const plusDays = (day, count) => {
    const date = new Date(`${day}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + count);
    return date.toISOString().slice(0, 10);
};
const mondayOf = day => {
    const weekday = new Date(`${day}T00:00:00.000Z`).getUTCDay();
    return plusDays(day, -(weekday === 0 ? 6 : weekday - 1));
};
const dayLabel = day => {
    const date = new Date(`${day}T00:00:00.000Z`);
    const weekdays = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];
    return `${weekdays[date.getUTCDay()]} ${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
};

export function createWeeklySchedule(host, onSelect) {
    let week = mondayOf(localParts(new Date().toISOString())[0]);
    let slots = [];
    let selectedId = '';

    function render() {
        host.replaceChildren();
        const actions = document.createElement('div');
        actions.className = 'schedule-actions';
        const previous = document.createElement('button');
        previous.type = 'button';
        previous.className = 'app-secondary';
        previous.textContent = '← Өмнөх';
        previous.disabled = week <= mondayOf(localParts(new Date().toISOString())[0]);
        previous.addEventListener('click', () => { week = plusDays(week, -7); render(); });
        const title = document.createElement('strong');
        title.textContent = `${week} – ${plusDays(week, 6)}`;
        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'app-secondary';
        next.textContent = 'Дараах →';
        next.disabled = !slots.length || week >= mondayOf(localParts(slots[slots.length - 1].starts_at)[0]);
        next.addEventListener('click', () => { week = plusDays(week, 7); render(); });
        actions.append(previous, title, next);
        host.append(actions);

        const days = Array.from({ length: 7 }, (_, index) => plusDays(week, index));
        const weekSlots = slots.filter(slot => {
            const day = localParts(slot.starts_at)[0];
            return day >= week && day <= days[6];
        });
        if (!weekSlots.length) {
            const empty = document.createElement('p');
            empty.className = 'app-muted';
            empty.textContent = 'Энэ долоо хоногт сонгосон хичээлд тохирох сул цаг алга.';
            host.append(empty);
            return;
        }
        const times = [...new Set(weekSlots.map(slot => localParts(slot.starts_at)[1]))].sort();
        const wrapper = document.createElement('div');
        wrapper.className = 'schedule-scroll';
        const table = document.createElement('table');
        table.className = 'weekly-schedule';
        const caption = document.createElement('caption');
        caption.textContent = 'Багшийн сул цаг · Улаанбаатарын цагаар';
        table.append(caption);
        const header = document.createElement('tr');
        for (const label of ['Цаг', ...days.map(dayLabel)]) {
            const cell = document.createElement('th');
            cell.scope = 'col';
            cell.textContent = label;
            header.append(cell);
        }
        const thead = document.createElement('thead');
        thead.append(header);
        table.append(thead);
        const body = document.createElement('tbody');
        for (const time of times) {
            const row = document.createElement('tr');
            const rowHead = document.createElement('th');
            rowHead.scope = 'row';
            rowHead.textContent = time;
            row.append(rowHead);
            for (const day of days) {
                const cell = document.createElement('td');
                const matching = weekSlots.filter(slot => {
                    const [slotDay, slotTime] = localParts(slot.starts_at);
                    return slotDay === day && slotTime === time;
                });
                for (const slot of matching) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'schedule-slot';
                    button.textContent = `${time}–${localParts(slot.ends_at)[1]}`;
                    button.setAttribute('aria-label', `${dayLabel(day)} ${button.textContent} цаг сонгох`);
                    button.setAttribute('aria-pressed', String(String(slot.id) === selectedId));
                    button.addEventListener('click', () => {
                        selectedId = String(slot.id);
                        onSelect(slot);
                        render();
                    });
                    cell.append(button);
                }
                row.append(cell);
            }
            body.append(row);
        }
        table.append(body);
        wrapper.append(table);
        host.append(wrapper);
    }

    return {
        update(nextSlots, nextSelectedId = '') {
            slots = [...nextSlots].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
            selectedId = String(nextSelectedId || '');
            const selected = slots.find(slot => String(slot.id) === selectedId);
            const earliest = selected || slots[0];
            if (earliest) week = mondayOf(localParts(earliest.starts_at)[0]);
            render();
        },
    };
}
