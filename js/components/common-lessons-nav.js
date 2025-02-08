class CommonLessonsNav extends HTMLElement {
    constructor() {
        super();
        this.links = [
            { href: "/pages/SearchResult.html?lesson=algorithm", text: "Алгоритм" },
            { href: "/pages/SearchResult.html?lesson=c", text: "Програмчилалын хэл Си" },
            { href: "/pages/SearchResult.html?lesson=math", text: "Математик 1б" },
            { href: "/pages/SearchResult.html?lesson=database", text: "Өгөгдлийн сангийн үндэс" },
            { href: "/pages/SearchResult.html?lesson=OOP", text: "ОПХ" }
        ];
    }

    connectedCallback() {
        this.render();
        this.highlightLastSearch(); // Хамгийн сүүлд хайсанг онцлох
        this.addEventListener("click", this.handleLinkClick.bind(this));
    }

    handleLinkClick(event) {
        const link = event.target.closest("a");
        if (link) {
            const urlParams = new URL(link.href).searchParams;
            const lesson = urlParams.get("lesson");
            // Хамгийн сүүлд хайсанг LocalStorage-д хадгалах
            localStorage.setItem("lastLessonSearch", lesson);
            this.highlightLastSearch();
        }   
    }

    highlightLastSearch() {
        const lastSearch = localStorage.getItem("lastLessonSearch");
        // Бүх линкнүүдийн идэвхтэй классыг арилгах
        this.querySelectorAll("a").forEach(a => {
            a.classList.remove("active");
        });
        // Хамгийн сүүлд хайсанг идэвхжүүлэх
        if (lastSearch) {
            const activeLink = this.querySelector(`a[href*="${lastSearch}"]`);
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="common-lessons-nav">
                ${this.links.map(link => `<a href="${link.href}">${link.text}</a>`).join('')}
            </div>
            <style>
                .common-lessons-nav a.active {
                    color: var(--base-color-orange);
                    font-weight: bold;
                }
            </style>
        `;
    }
}

customElements.define('common-lessons-nav', CommonLessonsNav);
