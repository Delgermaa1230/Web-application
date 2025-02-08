import { fetchTutorsData } from "../modules/fetchTutorsData.js";
import { transformTeacherData } from "../modules/transformTutors.js";
import { renderTutors } from "../modules/renderTutors.js";

class TutorList extends HTMLElement {
    constructor() {
        super();
        this.tutors = [];
        this.container = null;
    }

    connectedCallback() {
        this.container = document.getElementById("tutors");
        this.restoreFilters(); // Хуудсыг ачаалахад хадгалсан утгуудыг сэргээх
        this.loadTutors();
        this.setupFilterListeners(); // Филтер сонгогдоход хадгалах
    }

    async loadTutors() {
        const data = await fetchTutorsData();
        this.tutors = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);
        this.applyFilters();
    }

    applyFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const lessonParam = urlParams.get("lesson");

        const category = document.getElementById("categoryFilter").value;
        const rating = document.getElementById("ratingFilter").value;
        const ranking = document.getElementById("rankingFilter").value;
        const price = document.getElementById("priceFilter").value;

        this.saveFilters({ category, rating, ranking, price }); // Хэрэглэгчийн сонголтыг хадгалах

        let filteredTutors = this.tutors.filter(tutor => {
            const matchesLesson = !lessonParam || tutor.lessons.some(lesson => lesson.lesson_name.toLowerCase() === lessonParam.toLowerCase());
            
            return matchesLesson &&
                (category === "all" || tutor.mode === category) &&
                (!rating || tutor.ratings == rating) &&
                (!ranking || tutor.rank === ranking);
        });

        if (price === "Ихээс бага") {
            filteredTutors.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (price === "Багаас их") {
            filteredTutors.sort((a, b) => (a.price || 0) - (b.price || 0));
        }

        console.log("Filtered Tutors:", filteredTutors);
        renderTutors(this.container, filteredTutors);
    }

    saveFilters(filters) {
        localStorage.setItem("tutorFilters", JSON.stringify(filters));
    }

    restoreFilters() {
        const savedFilters = JSON.parse(localStorage.getItem("tutorFilters")) || {};
        document.getElementById("categoryFilter").value = savedFilters.category || "all";
        document.getElementById("ratingFilter").value = savedFilters.rating || "";
        document.getElementById("rankingFilter").value = savedFilters.ranking || "";
        document.getElementById("priceFilter").value = savedFilters.price || "";
    }

    setupFilterListeners() {
        document.getElementById("categoryFilter").addEventListener("change", () => this.applyFilters());
        document.getElementById("ratingFilter").addEventListener("change", () => this.applyFilters());
        document.getElementById("rankingFilter").addEventListener("change", () => this.applyFilters());
        document.getElementById("priceFilter").addEventListener("change", () => this.applyFilters());
    }
}

customElements.define("tutor-list", TutorList);
