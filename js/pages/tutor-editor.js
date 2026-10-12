import { formatUlaanbaatarTime } from '../modules/formatTime.js';
import '../components/foo-ter.js';

const container = document.querySelector('.main');
document.querySelector('footer')?.replaceWith(document.createElement('foo-ter'));
let currentTutorId = null;

const localValue = iso => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('sv-SE', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    }).replace(' ', 'T');
};

function renderLessonEditors(lessons) {
    const section = container.querySelector('#lesson-editors');
    section.hidden = !currentTutorId;
    const list = section.querySelector('#lesson-editor-list');
    list.replaceChildren();
    for (const lesson of lessons || []) {
        const form = document.createElement('form');
        form.className = 'lesson-editor app-grid';
        form.innerHTML = `
          <label>Хичээлийн нэр<input name="lesson_name" required maxlength="100"></label>
          <label>МУИС-ийн хичээлийн код (байвал)<input name="course_code" maxlength="30"></label>
          <label>Үргэлжлэх хугацаа<select name="duration_minutes" required>
            <option value="30">30 минут</option><option value="60">60 минут</option>
            <option value="90">90 минут</option><option value="120">120 минут</option>
            <option value="180">180 минут</option></select></label>
          <label>Заах хэлбэр<select name="mode" required>
            <option value="online">Онлайн</option><option value="classroom">Танхим</option>
            <option value="hybrid">Онлайн болон танхим</option></select></label>
          <label class="app-span">Энэ хичээлийн агуулга, арга барил
            <textarea name="description" required maxlength="2000"></textarea></label>
          <div class="app-actions"><button class="important-button" type="submit">Хичээл хадгалах</button></div>
          <p class="app-span" role="status"></p>`;
        for (const name of ['lesson_name', 'course_code', 'duration_minutes', 'mode', 'description']) {
            form.elements[name].value = lesson[name] ?? '';
        }
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const status = form.querySelector('[role="status"]');
            const button = form.querySelector('button[type="submit"]');
            button.disabled = true;
            status.textContent = 'Хадгалж байна…';
            try {
                const response = await fetch(`/api/tutor-lessons/${lesson.id}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(new FormData(form))),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                status.className = 'app-success app-span';
                status.textContent = 'Хичээл хадгалагдлаа.';
            } catch (error) {
                status.className = 'app-error app-span';
                status.textContent = error.message;
            } finally {
                button.disabled = false;
            }
        });
        list.append(form);
    }
}

async function loadSlots() {
    const section = container.querySelector('#availability');
    section.hidden = !currentTutorId;
    if (!currentTutorId) return;
    const response = await fetch(`/api/teachers/${currentTutorId}/slots`);
    if (!response.ok) throw new Error('Хуваарь ачаалж чадсангүй.');
    const slots = await response.json();
    const list = section.querySelector('#my-slots');
    list.replaceChildren();
    if (!slots.length) {
        list.textContent = 'Одоогоор боломжтой цаг нэмээгүй байна.';
        return;
    }
    for (const slot of slots) {
        const row = document.createElement('div');
        row.className = 'slot-row';
        const label = document.createElement('span');
        label.textContent = `${formatUlaanbaatarTime(slot.starts_at)} · ${slot.available ? 'Сул' : 'Захиалгатай'}`;
        row.append(label);
        if (slot.available) {
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'app-secondary';
            remove.textContent = 'Устгах';
            remove.addEventListener('click', async () => {
                const result = await fetch(`/api/tutor-slots/${slot.id}`, { method: 'DELETE' });
                if (result.ok) await loadSlots();
                else section.querySelector('#slot-status').textContent = (await result.json()).error;
            });
            row.append(remove);
        }
        list.append(row);
    }
}

async function loadEditor() {
    const response = await fetch('/api/me');
    if (response.status === 401) {
        window.location.replace('./login.html?next=becomeTeacher.html');
        return;
    }
    if (!response.ok) throw new Error('Бүртгэл ачаалж чадсангүй.');
    let { tutor } = await response.json();
    container.className = 'app-shell';
    container.innerHTML = `
      <div class="app-heading"><div><p class="app-eyebrow">МУИС · Numteach</p>
        <h1 id="editor-title"></h1><p class="app-muted">Өөрийн заах хичээл, арга барилаа танилцуулаарай.</p></div></div>
      <form id="tutor-form" class="app-card app-grid">
        <label class="app-span">Зарын гарчиг
          <input name="description" required maxlength="200" placeholder="Жишээ: Математик болон алгоритмын цагийн хичээл"></label>
        <label class="app-span">Заах хичээлүүд
          <input name="lessons" required placeholder="Математик, Алгоритм, Програмчлал">
          <span class="app-help">Хичээлүүдийг таслалаар тусгаарлана. Жагсаалтад байхгүй МУИС-ийн хичээлийг өөрөө бичиж болно.</span>
          <span id="course-options" class="course-options"></span></label>
        <label>Заах хэлбэр<select name="mode" required>
          <option value="online">Онлайн</option><option value="classroom">Танхим</option>
          <option value="hybrid">Онлайн болон танхим</option></select></label>
        <label>Нэг цагийн үнэ (₮)<input name="price" type="number" min="0" max="300000" step="1000" required></label>
        <label class="app-span">Өөрийн тухай<textarea name="teacher_info" required maxlength="2000" placeholder="Мэргэжил, туршлага, сонирхлоо бичээрэй"></textarea></label>
        <label class="app-span">Шинэ хичээлийн анхны тайлбар<textarea name="lesson_info" required maxlength="2000" placeholder="Хичээл хэрхэн явагдахыг тайлбарлаарай"></textarea>
          <span class="app-help">Зараа хадгалсны дараа хичээл бүрийн тайлбар, үнэ, хугацааг тусад нь засна.</span></label>
        <div class="app-actions"><button class="important-button" type="submit">Зар нийтлэх</button>
          <a class="app-secondary" href="./profile.html">Буцах</a></div>
        <p id="editor-status" class="app-span" role="status"></p>
      </form>
      <section id="lesson-editors" class="app-card" hidden>
        <h2>Хичээл бүрийн мэдээлэл</h2>
        <div id="lesson-editor-list" class="app-stack"></div>
      </section>
      <section id="availability" class="app-card" hidden>
        <h2>Заах боломжтой цаг</h2>
        <p class="app-muted">Нэг удаагийн 30–180 минутын цаг нэмнэ. Захиалгатай цагийг устгах боломжгүй.</p>
        <form id="slot-form" class="app-grid">
          <label>Эхлэх өдөр, цаг<input name="starts_at" type="datetime-local" required></label>
          <label>Үргэлжлэх хугацаа<select name="duration" required>
            <option value="30">30 минут</option><option value="60" selected>60 минут</option><option value="90">90 минут</option>
            <option value="120">120 минут</option><option value="180">180 минут</option>
          </select></label>
          <div class="app-actions"><button class="important-button" type="submit">Цаг нэмэх</button>
            <a id="listing-link" class="app-secondary">Миний зарыг харах</a></div>
        </form>
        <p id="slot-status" role="status"></p><div id="my-slots" class="app-stack"></div>
      </section>`;
    container.querySelector('#editor-title').textContent = tutor ? 'Багшийн зараа засах' : 'Багш болох';
    const form = container.querySelector('#tutor-form');
    fetch('/api/lesson').then(response => response.ok ? response.json() : []).then(courses => {
        const options = container.querySelector('#course-options');
        for (const course of courses.slice(0, 12)) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'course-option';
            button.textContent = course.lesson_name;
            button.addEventListener('click', () => {
                const input = form.elements.lessons;
                const selected = input.value.split(',').map(item => item.trim()).filter(Boolean);
                if (!selected.includes(course.lesson_name)) selected.push(course.lesson_name);
                input.value = selected.join(', ');
            });
            options.append(button);
        }
    }).catch(() => {});
    currentTutorId = tutor?.teacher_id || null;
    renderLessonEditors(tutor?.lessons);
    if (currentTutorId) container.querySelector('#listing-link').href = `./teachInfo.html?id=${currentTutorId}`;
    if (tutor) {
        for (const name of ['description', 'mode', 'price', 'teacher_info', 'lesson_info']) {
            form.elements[name].value = tutor[name] ?? '';
        }
        form.elements.lessons.value = tutor.lessons.map(item => item.lesson_name).join(', ');
        form.querySelector('button[type="submit"]').textContent = 'Зар шинэчлэх';
    }
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(form));
        payload.lessons = payload.lessons.split(/[,，\n]/).map(item => item.trim()).filter(Boolean);
        const status = container.querySelector('#editor-status');
        status.textContent = 'Хадгалж байна…';
        try {
            const result = await fetch('/api/tutor-profile', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
            });
            const data = await result.json();
            if (!result.ok) throw new Error(data.error);
            currentTutorId = data.tutor.teacher_id;
            tutor = data.tutor;
            renderLessonEditors(tutor.lessons);
            container.querySelector('#listing-link').href = `./teachInfo.html?id=${currentTutorId}`;
            status.className = 'app-success app-span';
            status.textContent = 'Зар хадгалагдлаа. Хичээл бүрийн мэдээлэл, заах цагаа нэмнэ үү.';
            await loadSlots();
        } catch (error) {
            status.className = 'app-error app-span';
            status.textContent = error.message;
        }
    });
    const slotForm = container.querySelector('#slot-form');
    slotForm.elements.starts_at.min = localValue(new Date(Date.now() + 30 * 60000).toISOString());
    slotForm.addEventListener('submit', async event => {
        event.preventDefault();
        const start = new Date(slotForm.elements.starts_at.value);
        const end = new Date(start.getTime() + Number(slotForm.elements.duration.value) * 60000);
        const status = container.querySelector('#slot-status');
        try {
            const response = await fetch('/api/tutor-slots', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ starts_at: start.toISOString(), ends_at: end.toISOString() }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            slotForm.reset();
            status.className = 'app-success';
            status.textContent = 'Цаг нэмэгдлээ.';
            await loadSlots();
        } catch (error) {
            status.className = 'app-error';
            status.textContent = error.message;
        }
    });
    await loadSlots();
}

loadEditor().catch(error => { container.textContent = error.message; });
