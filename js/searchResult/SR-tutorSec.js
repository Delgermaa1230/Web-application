export async function loadData() {
    const result = await fetch("../data/teacher.json");
    const data = await result.json();
    console.log("data", data);

    return data.teachers;
}

export default class tutor {
    constructor(bagsh) {
        this.zurag = bagsh.image;
        this.ovog = bagsh.lastName;
        this.ner = bagsh.firstName;
        this.unelgee = bagsh.ratings;
        this.sanal = bagsh.numberOfRatings;
        this.tailbar = bagsh.description;
    }


    render() {
        const firstLetterOfLastName = this.ovog.charAt(0);
        return `
            <a href="/pages/teachInfo.html">
                <section class="tutorCard">
                    <div class="tutorImage">
                        <img src="${this.zurag}" alt="fe">
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

    rendertutors() {
        return this
            .tutor
            .map(b => (new tutor(b)).render())
            .reduce((p, c) => p + c);
    }

    renderall() {
        console.log("data", this.tutor);
        return `
        <article class="tutor">
            <section>
                ${this.rendertutors()}
            <section>
        </article>`;
    }

    getParams() {
        const params = new URLSearchParams(window.location.search);
        return {
          ner: params.get("ner"),
        };
    }


}


