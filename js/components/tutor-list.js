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
        try {
            const data = await fetchTutorsData();
            this.tutors = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);
            this.applyFilters();
        } catch (error) {
            this.container.textContent = 'Багшийн мэдээлэл ачаалж чадсангүй. Дахин оролдоно уу.';
        }
    }

    applyFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const lessonParam = urlParams.get("lesson");

        const category = document.getElementById("categoryFilter").value;
        const rating = document.getElementById("ratingFilter").value;
        const availability = document.getElementById("availabilityFilter").value;
        const price = document.getElementById("priceFilter").value;

        this.saveFilters({ category, rating, availability, price });

        let filteredTutors = this.tutors.filter(tutor => {
            const search = (lessonParam || '').toLowerCase().trim();
            const matchesLesson = !search || [tutor.firstName, tutor.lastName, tutor.description,
                ...tutor.lessons.flatMap(lesson => [lesson.lesson_name, lesson.course_code, lesson.description])]
                .some(value => String(value || '').toLowerCase().includes(search));
            
            return matchesLesson &&
                (category === "all" || tutor.lessons.some(lesson => lesson.mode === category)) &&
                (!rating || (Number(tutor.numberOfRatings) > 0 && Number(tutor.ratings) >= Number(rating))) &&
                (availability === 'all' ||
                    (availability === 'live' && tutor.available) ||
                    (availability === 'bookable' && tutor.available && tutor.nextAvailableAt));
        });

        const lowestPrice = tutor => Math.min(...tutor.lessons.map(lesson => Number(lesson.price) || 0));
        if (price === "Ихээс бага") {
            filteredTutors.sort((a, b) => lowestPrice(b) - lowestPrice(a));
        } else if (price === "Багаас их") {
            filteredTutors.sort((a, b) => lowestPrice(a) - lowestPrice(b));
        } else {
            filteredTutors.sort((a, b) =>
                Number(Boolean(b.available && b.nextAvailableAt)) - Number(Boolean(a.available && a.nextAvailableAt)) ||
                Number(Boolean(b.available)) - Number(Boolean(a.available)));
        }

        renderTutors(this.container, filteredTutors);
    }

    saveFilters(filters) {
        localStorage.setItem("tutorFilters", JSON.stringify(filters));
    }

    restoreFilters() {
        const savedFilters = JSON.parse(localStorage.getItem("tutorFilters")) || {};
        document.getElementById("categoryFilter").value = savedFilters.category || "all";
        document.getElementById("ratingFilter").value = savedFilters.rating || "";
        document.getElementById("availabilityFilter").value = savedFilters.availability || "all";
        document.getElementById("priceFilter").value = savedFilters.price || "";
    }

    setupFilterListeners() {
        document.getElementById("categoryFilter").addEventListener("change", () => this.applyFilters());
        document.getElementById("ratingFilter").addEventListener("change", () => this.applyFilters());
        document.getElementById("availabilityFilter").addEventListener("change", () => this.applyFilters());
        document.getElementById("priceFilter").addEventListener("change", () => this.applyFilters());
    }
}

customElements.define("tutor-list", TutorList);
