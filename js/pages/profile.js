import { formatUlaanbaatarTime } from '../modules/formatTime.js';
import { escapeHtml } from '../modules/escapeHtml.js';

const host = document.querySelector('profile-inf');
const bookingLabels = { pending: 'Хүлээгдэж байна', confirmed: 'Баталгаажсан',
    declined: 'Татгалзсан', cancelled: 'Цуцалсан' };

async function loadBookings() {
    const response = await fetch('/api/bookings');
    if (!response.ok) return;
    const data = await response.json();
    for (const [key, incoming] of [['own', false], ['incoming', true]]) {
        const list = host.querySelector(incoming ? '#incoming-bookings' : '#my-bookings-list');
        list.replaceChildren();
        if (!data[key].length) {
            const empty = document.createElement('p');
            empty.className = 'app-muted';
            empty.textContent = 'Одоогоор захиалга алга.';
            list.append(empty);
            continue;
        }
        for (const booking of data[key]) {
            const card = document.createElement('article');
            card.className = 'app-card booking-card';
            const title = document.createElement('h3');
            title.textContent = incoming
                ? `${booking.student_first_name} ${booking.student_last_name}`
                : `${booking.tutor_first_name} ${booking.tutor_last_name}`;
            const details = document.createElement('p');
            const terms = booking.price_amount == null ? '' :
                ` · ${Number(booking.price_amount).toLocaleString('mn-MN')}₮ / ${booking.duration_minutes} мин`;
            details.textContent = `${booking.lesson_name} · ${formatUlaanbaatarTime(booking.starts_at)}${terms} · ${bookingLabels[booking.status] || booking.status}`;
            card.append(title, details);
            if (booking.note) {
                const note = document.createElement('p');
                note.textContent = booking.note;
                card.append(note);
            }
            if (incoming) {
                const contact = document.createElement('p');
                contact.className = 'app-muted';
                contact.textContent = [booking.student_email, booking.student_phone].filter(Boolean).join(' · ');
                card.append(contact);
            }
            const actions = document.createElement('div');
            actions.className = 'app-actions';
            const future = Date.parse(booking.starts_at) > Date.now();
            const finished = Date.parse(booking.ends_at) <= Date.now();
            const choices = incoming && booking.status === 'pending' && future
                ? [['confirmed', 'Батлах'], ['declined', 'Татгалзах']]
                : !incoming && future && ['pending', 'confirmed'].includes(booking.status)
                    ? [['cancelled', 'Цуцлах']] : [];
            for (const [status, label] of choices) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = status === 'confirmed' ? 'important-button' : 'app-secondary';
                button.textContent = label;
                button.addEventListener('click', async () => {
                    button.disabled = true;
                    const update = await fetch(`/api/bookings/${booking.id}`, {
                        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status }),
                    });
                    if (update.ok) await loadBookings();
                    else {
                        host.querySelector('#profile-status').textContent = (await update.json()).error;
                        button.disabled = false;
                    }
                });
                actions.append(button);
            }
            card.append(actions);
            if (!incoming && booking.status === 'confirmed' && finished && !booking.review_id) {
                const reviewForm = document.createElement('form');
                reviewForm.className = 'app-stack review-form';
                reviewForm.innerHTML = `<h4>Багшид сэтгэгдэл үлдээх</h4>
                  <p class="app-muted">Судалсан хичээл: ${escapeHtml(booking.lesson_name)}</p>
                  <label class="app-field">Үнэлгээ<select name="rating" required>
                    <option value="5">5 · Маш сайн</option><option value="4">4 · Сайн</option>
                    <option value="3">3 · Дунд</option><option value="2">2 · Сул</option>
                    <option value="1">1 · Тааруу</option></select></label>
                  <label class="app-field">Сэтгэгдэл<textarea name="comment" required minlength="10" maxlength="2000"></textarea></label>
                  <div class="app-actions"><button class="important-button" type="submit">Сэтгэгдэл үлдээх</button></div>
                  <p role="status"></p>`;
                reviewForm.addEventListener('submit', async event => {
                    event.preventDefault();
                    const button = reviewForm.querySelector('button[type="submit"]');
                    const status = reviewForm.querySelector('[role="status"]');
                    button.disabled = true;
                    try {
                        const response = await fetch('/api/reviews', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ booking_id: booking.id,
                                ...Object.fromEntries(new FormData(reviewForm)) }),
                        });
                        const result = await response.json();
                        if (!response.ok) throw new Error(result.error);
                        await loadBookings();
                    } catch (error) {
                        status.className = 'app-error';
                        status.textContent = error.message;
                        button.disabled = false;
                    }
                });
                card.append(reviewForm);
            }
            list.append(card);
        }
    }
}

function messageCard(item, received) {
    const card = document.createElement('article');
    card.className = 'app-card message-card';
    const title = document.createElement('h3');
    title.textContent = `${item.first_name} ${item.last_name}`;
    const meta = document.createElement('p');
    meta.className = 'app-muted';
    const createdAt = typeof item.created_at === 'string' && !/[zZ]|[+-]\d\d:\d\d$/.test(item.created_at)
        ? `${item.created_at}Z` : item.created_at;
    meta.textContent = `${item.lesson_name || 'Хичээл'} · ${new Date(createdAt).toLocaleString('mn-MN')}`;
    const body = document.createElement('p');
    body.textContent = item.body;
    card.append(title, meta, body);
    if (received) {
        const contact = document.createElement('a');
        contact.href = `mailto:${encodeURIComponent(item.email)}`;
        contact.textContent = `Хариу бичих: ${item.email}`;
        card.append(contact);
    }
    return card;
}

function renderMessages(data) {
    for (const [key, received] of [['received', true], ['sent', false]]) {
        const list = host.querySelector(`#${key}-messages`);
        list.replaceChildren();
        if (!data[key].length) {
            const empty = document.createElement('p');
            empty.className = 'app-muted';
            empty.textContent = received ? 'Ирсэн зурвас алга.' : 'Илгээсэн зурвас алга.';
            list.append(empty);
        } else {
            list.append(...data[key].map(item => messageCard(item, received)));
        }
    }
}

async function loadProfile() {
    const response = await fetch('/api/me');
    if (response.status === 401) {
        window.location.replace('./login.html?next=profile.html');
        return;
    }
    if (!response.ok) throw new Error('Профайл ачаалж чадсангүй.');
    const { student, tutor } = await response.json();
    host.innerHTML = `
      <main class="app-shell">
        <div class="app-heading">
          <div><p class="app-eyebrow">МУИС · Numteach</p><h1 id="profile-name"></h1>
          <p class="app-muted" id="profile-email"></p></div>
          <button type="button" id="logout" class="app-secondary">Гарах</button>
        </div>
        <section class="app-card">
          <h2>Миний мэдээлэл</h2>
          <form id="account-form" class="app-grid">
            <label>Нэр<input name="first_name" required maxlength="80"></label>
            <label>Овог<input name="last_name" required maxlength="80"></label>
            <label>Утас<input name="phone" maxlength="30"></label>
            <div class="app-actions"><button class="important-button">Хадгалах</button></div>
          </form>
        </section>
        <section class="app-card">
          <h2>Багшийн зар</h2>
          <p id="tutor-status" class="app-muted"></p>
          <div class="app-actions"><a class="important-button" href="./becomeTeacher.html" id="tutor-action"></a>
          <a id="my-listing" class="app-secondary" hidden>Зараа үзэх</a></div>
        </section>
        <section id="my-bookings"><h2>Миний захиалгууд</h2><div id="my-bookings-list" class="app-stack"></div></section>
        <section><h2>Надад ирсэн захиалгууд</h2><div id="incoming-bookings" class="app-stack"></div></section>
        <section><h2>Ирсэн зурвас</h2><div id="received-messages" class="app-stack"></div></section>
        <section><h2>Илгээсэн зурвас</h2><div id="sent-messages" class="app-stack"></div></section>
        <p id="profile-status" role="status"></p>
      </main>`;
    host.querySelector('#profile-name').textContent = `${student.first_name} ${student.last_name}`;
    host.querySelector('#profile-email').textContent = student.email;
    const form = host.querySelector('#account-form');
    for (const field of ['first_name', 'last_name', 'phone']) form.elements[field].value = student[field] || '';
    host.querySelector('#tutor-status').textContent = tutor
      ? 'Таны зар нийтлэгдсэн. Та мэдээллээ шинэчилж болно.'
      : 'Та хичээл заах зараа нийтлээгүй байна.';
    host.querySelector('#tutor-action').textContent = tutor ? 'Зараа засах' : 'Багш болох';
    if (tutor) {
        const link = host.querySelector('#my-listing');
        link.href = `./teachInfo.html?id=${tutor.teacher_id}`;
        link.hidden = false;
    }
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(form));
        const update = await fetch('/api/me', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        const result = await update.json();
        host.querySelector('#profile-status').textContent = update.ok ? 'Мэдээлэл хадгалагдлаа.' : result.error;
        if (update.ok) host.querySelector('#profile-name').textContent =
            `${result.student.first_name} ${result.student.last_name}`;
    });
    host.querySelector('#logout').addEventListener('click', async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '../index.html';
    });
    const messages = await fetch('/api/messages');
    if (messages.ok) renderMessages(await messages.json());
    await loadBookings();
}

loadProfile().catch(error => { host.textContent = error.message; });
