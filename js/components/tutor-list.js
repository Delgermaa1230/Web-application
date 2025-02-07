import { fetchTutorsData } from "../modules/fetchTutorsData.js";
import { transformTeacherData } from "../modules/transformTutors.js";
import { renderTutors } from "../modules/renderTutors.js";

class TutorList extends HTMLElement {
    constructor() {
        super();
        this.tutors = []; // Бүх багшийн мэдээлэл хадгалах массив
        this.container = null; // Энэ хэсгийг `connectedCallback` дээр онооно
    }

    connectedCallback() {
        this.container = document.getElementById("tutors"); // DOM дээр гарсны дараа авах
        this.loadTutors();
    }

    async loadTutors() {
        // JSON өгөгдлийг татах
        const data = await fetchTutorsData();
        this.tutors = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);
        console.log(this.tutors);

        renderTutors(this.container, this.tutors);
    }

    applyFilters() {
        const category = document.getElementById("categoryFilter").value;
        const rating = document.getElementById("ratingFilter").value;
        const ranking = document.getElementById("rankingFilter").value;
        const price = document.getElementById("priceFilter").value;

        let filteredTutors = this.tutors.filter(tutor => {
            return (category === "all" || tutor.mode === category) &&
                (!rating || tutor.ratings == rating) &&
                (!ranking || tutor.rank === ranking);
        });

        if (price === "Ихээс бага") {
            filteredTutors.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (price === "Багаас их") {
            filteredTutors.sort((a, b) => (a.price || 0) - (b.price || 0));
        }

        console.log("ff", filteredTutors);
        renderTutors(this.container, filteredTutors);

    }
}

customElements.define("tutor-list", TutorList);
