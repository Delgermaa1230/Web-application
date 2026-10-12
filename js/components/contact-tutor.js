import { escapeHtml } from '../modules/escapeHtml.js';
import { formatUlaanbaatarTime } from '../modules/formatTime.js';
import { createWeeklySchedule } from '../modules/weeklySchedule.js';

const priceLabel = price => Number(price) === 0 ? 'Үнэгүй' :
    `${Number(price).toLocaleString('mn-MN')}₮`;

class ContactTutor extends HTMLElement {
    connectedCallback() {
        this.tutor = JSON.parse(this.getAttribute('data-bagsh') || '{}');
        this.render();
        if (this.tutor.available) this.loadSlots();
    }

    render() {
        const tutor = this.tutor;
        if (!tutor.available) {
            this.innerHTML = `<section class="app-card contact-forms">
              <h2>Одоогоор холбогдох боломжгүй</h2>
              <a class="app-secondary" href="./SearchResult.html">Багш хайх</a>
            </section>`;
            return;
        }
        this.innerHTML = `
          <section class="app-card contact-forms">
            <p class="app-eyebrow">Цаг захиалах</p>
            <h1>Холбогдох</h1>
            <p class="app-muted">${escapeHtml(tutor.firstLetterOfLastName)}. ${escapeHtml(tutor.firstName)} багшийн цагийг захиалах</p>
            <form id="booking-form" class="app-stack">
              <label class="app-field">Заалгах хичээл
                <select name="lesson_id" required></select>
              </label>
              <input name="slot_id" type="hidden" required>
              <div id="slot-table" aria-label="Долоо хоногийн сул цаг"></div>
              <p id="slot-status" class="app-muted" role="status"></p>
              <label class="app-field">Нэмэлт зурвас (заавал биш)
                <textarea name="note" maxlength="1000" placeholder="Багшид хэлэх зүйлээ бичнэ үү"></textarea>
              </label>
              <div id="booking-summary" class="booking-summary app-muted" aria-live="polite"></div>
              <div class="app-actions">
                <button class="important-button" type="submit" disabled>Сонголтоо баталгаажуулах</button>
              </div>
              <p id="booking-status" role="status"></p>
            </form>
            <div id="booking-success" class="app-stack" hidden>
              <h2>Захиалгын хүсэлт илгээгдлээ</h2>
              <p class="app-muted">Багшийн баталгааг хүлээнэ.</p>
              <a class="app-secondary" href="./profile.html#my-bookings">Захиалгаа харах</a>
            </div>
          </section>`;
    }

    async loadSlots() {
        const tutor = this.tutor;
        const form = this.querySelector('#booking-form');
        const lessonSelect = form.elements.lesson_id;
        const slotInput = form.elements.slot_id;
        const noteInput = form.elements.note;
        const slotStatus = this.querySelector('#slot-status');
        const status = this.querySelector('#booking-status');
        const submitButton = form.querySelector('button[type="submit"]');
        const lessons = tutor.lessons || [];
        const storageKey = `numteach-booking-${tutor.id}`;
        let saved = {};
        try { saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}'); } catch {}
        const query = new URLSearchParams(location.search);

        for (const lesson of lessons) {
            const option = document.createElement('option');
            option.value = lesson.id;
            option.textContent = `${lesson.course_code ? lesson.course_code + ' · ' : ''}${lesson.lesson_name} · ${lesson.duration_minutes} мин · ${priceLabel(lesson.price)}`;
            lessonSelect.append(option);
        }
        if (!lessons.length) {
            slotStatus.textContent = 'Энэ багш одоогоор хичээл оруулаагүй байна.';
            return;
        }
        const requestedLesson = query.get('lesson_id') || saved.lesson_id;
        if (lessons.some(lesson => String(lesson.id) === String(requestedLesson))) {
            lessonSelect.value = String(requestedLesson);
        }
        noteInput.value = typeof saved.note === 'string' ? saved.note : '';
        let slots = [];
        const schedule = createWeeklySchedule(this.querySelector('#slot-table'), slot => {
            slotInput.value = String(slot.id);
            updateSummary();
        });
        const updateSummary = () => {
            const lesson = lessons.find(item => String(item.id) === lessonSelect.value);
            const slot = slots.find(item => String(item.id) === slotInput.value);
            submitButton.disabled = !lesson || !slot;
            this.querySelector('#booking-summary').textContent = lesson && slot
                ? `${lesson.lesson_name} · ${formatUlaanbaatarTime(slot.starts_at)} · ${lesson.duration_minutes} мин · ${priceLabel(lesson.price)}`
                : 'Сул цагаа сонгоно уу.';
        };
        const renderMatching = preferredSlot => {
            const lesson = lessons.find(item => String(item.id) === lessonSelect.value);
            const matching = slots.filter(slot =>
                Date.parse(slot.ends_at) - Date.parse(slot.starts_at) === lesson?.duration_minutes * 60000);
            slotInput.value = matching.some(slot => String(slot.id) === String(preferredSlot))
                ? String(preferredSlot) : '';
            schedule.update(matching, slotInput.value);
            slotStatus.textContent = matching.length
                ? `${matching.length} тохирох сул цаг байна.`
                : 'Энэ хичээлд тохирох сул цаг одоогоор алга.';
            updateSummary();
        };
        const refreshSlots = async preferredSlot => {
            const response = await fetch(`/api/teachers/${tutor.id}/slots`);
            if (!response.ok) throw new Error('Боломжит цагийг ачаалж чадсангүй.');
            slots = (await response.json()).filter(slot => slot.available);
            renderMatching(preferredSlot);
        };
        lessonSelect.addEventListener('change', () => renderMatching(''));
        try {
            await refreshSlots(query.get('slot_id') || saved.slot_id);
        } catch (error) {
            slotStatus.className = 'app-error';
            slotStatus.textContent = error.message;
            return;
        }
        form.addEventListener('submit', async event => {
            event.preventDefault();
            if (!slotInput.value || !lessonSelect.value) return;
            status.className = 'app-muted';
            status.textContent = 'Захиалгын хүсэлт илгээж байна…';
            submitButton.disabled = true;
            const lesson = lessons.find(item => String(item.id) === lessonSelect.value);
            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lesson_id: Number(lessonSelect.value),
                        slot_id: Number(slotInput.value),
                        note: noteInput.value,
                        quoted_price: lesson.price,
                    }),
                });
                if (response.status === 401) {
                    sessionStorage.setItem(storageKey, JSON.stringify({
                        lesson_id: lessonSelect.value, slot_id: slotInput.value, note: noteInput.value,
                    }));
                    const destination = new URL(location.href);
                    destination.searchParams.set('lesson_id', lessonSelect.value);
                    destination.searchParams.set('slot_id', slotInput.value);
                    location.href = `./login.html?next=${encodeURIComponent(destination.pathname + destination.search)}`;
                    return;
                }
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Захиалга үүсгэж чадсангүй.');
                sessionStorage.removeItem(storageKey);
                form.hidden = true;
                this.querySelector('#booking-success').hidden = false;
            } catch (error) {
                status.className = 'app-error';
                status.textContent = error.message;
                if (error.message.includes('захиалагдсан') || error.message.includes('боломжгүй')) {
                    try { await refreshSlots(''); } catch {}
                } else {
                    updateSummary();
                }
            }
        });
    }
}

customElements.define('contact-tutor', ContactTutor);
