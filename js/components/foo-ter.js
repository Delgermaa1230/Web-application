class FooTer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer class="site-footer">
      <div><strong>Numteach</strong><p>МУИС-ийн оюутнууд хамтдаа сурч, заах орон зай.</p></div>
      <nav aria-label="Хуудасны доод цэс">
        <a href="/pages/question.html">Тусламж</a>
        <a href="/pages/SearchResult.html">Багш хайх</a>
        <a href="/pages/becomeTeacher.html">Багш болох</a>
      </nav>
    </footer>`;
  }
}

customElements.define('foo-ter', FooTer);
