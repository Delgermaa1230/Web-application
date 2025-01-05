
export async function loadData() {
    try {
        const response = await fetch('http://localhost:3000/teachers');
        const data = await response.json();
        console.log("data", data);
        return data;
    } catch (error) {
        console.error("Error loading teachers:", error);
        return [];
    }
}

export async function loadLovedTeacherData() {
    try {
        const response = await fetch('http://localhost:3000/teachers');
        const data = await response.json();
        const lovedTeachers = JSON.parse(localStorage.getItem("lovedTeachers")) || [];
        return data.filter(teacher => lovedTeachers.includes(teacher.first_name));
    } catch (error) {
        console.error("Error loading loved teachers:", error);
        return [];
    }
}

export default class tutor {
    constructor(bagsh) {
        // Өгөгдлийн сангийн талбарын нэрүүдтэй тохируулах
        this.zurag = bagsh.image;
        this.ovog = bagsh.last_name;
        this.ner = bagsh.first_name;
        this.unelgee = bagsh.retings;
        this.sanal = bagsh.number_of_ratings;
        this.tailbar = bagsh.description;
        this.hicheeluud = bagsh.lessons;
        this.pass = bagsh.password;
    }


    render() {
        const firstLetterOfLastName = this.ovog.charAt(0);
        // Local storage-с одоогийн төлөвийг шалгах
        const lovedTeachers = JSON.parse(localStorage.getItem("lovedTeachers")) || [];
        const isLoved = lovedTeachers.includes(this.ner);

        return `
            <a href="/pages/teachInfo.html">
                <section class="tutorCard">
                    <div class="tutorImage">
                        <img src="${this.zurag}" alt="fe">
                        <button class="love" onclick="loveButtonClick(event, '${this.ner}')">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="heart-icon"
                                style="width: 24px; height: 24px;">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.49l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" style="fill: ${isLoved ? 'red' : 'none'}"></path>
                            </svg>
                        </button>
                    </div>
                    <h3>${firstLetterOfLastName}. ${this.ner}</h3>
                    <p class="tutorReviews">
                        <i class="fa fa-star"></i>
                        <span id="starsNumber">${this.unelgee}</span>
                        <span id="reviewsNumber">
                            (${this.sanal} санал)
                        </span>
                    </p>
                    <p class="tutorDescription">
                        ${this.tailbar}
                    </p>
                </section>
             </a>`;
    }
}