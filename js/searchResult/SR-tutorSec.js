export async function loadData() {
    const result = await fetch("../data/teacher.json");
    const data = await result.json();
    console.log("data", data);
    return data.teachers;
}

export default class tutor {
    constructor(bagsh) {
        this.id = bagsh.id;
        this.zurag = bagsh.image;
        this.ovog = bagsh.lastName;
        this.ner = bagsh.firstName;
        this.unelgee = bagsh.ratings;
        this.sanal = bagsh.numberOfRatings;
        this.tailbar = bagsh.description;
        this.hicheeluud = bagsh.lessons;
        this.rank = bagsh.ranking;
        this.une = bagsh.price
    }


    render() {
        const firstLetterOfLastName = this.ovog.charAt(0);
        return `
            <a href="/pages/teachInfo.html">
                <section class="tutorCard">
                    <div class="tutorImage">
                        <img src="${this.zurag}" alt="fe">
                        <button class="love" data-id="${this.id}"><svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="heart-icon"
                            style="width: 24px; height: 24px;">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.49l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="rgba(255, 255, 255, 0.5)"></path>
                        </svg></button>
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


