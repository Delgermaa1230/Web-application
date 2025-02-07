import { fetchTutorsData } from "../modules/fetchTutorsData.js";
import { transformTeacherData } from "../modules/transformTutors.js";
import { renderTutors } from "../modules/renderTutors.js";

class TutorList extends HTMLElement {
    constructor() {
        super();
        this.tutors = []; // Бүх багшийн мэдээллийг хадгалах массив
        this.container = null; // Энэ хэсгийг `connectedCallback` дээр онооно
    }

    connectedCallback() {
        this.container = document.getElementById("tutors"); // DOM дээр гарсны дараа авах
        this.loadTutors();
    }

    async loadTutors() {
        const data = await fetchTutorsData();
        this.tutors = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);

        this.applyFilters(); // Филтерийг шууд хэрэгжүүлэх
    }

    applyFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const lessonParam = urlParams.get("lesson"); // URL дээрээс 'lesson' авах

        const category = document.getElementById("categoryFilter").value;
        const rating = document.getElementById("ratingFilter").value;
        const ranking = document.getElementById("rankingFilter").value;
        const price = document.getElementById("priceFilter").value;

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
}

customElements.define("tutor-list", TutorList);
