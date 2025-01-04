function renderLovedTs() {
    const lovedTs = JSON.parse(localStorage.getItem('lovedTs')) || [];

    console.log(lovedTs);
    
    if (lovedTs.length === 0) {
        document.getElementById("lovedTutors").innerHTML = `<p style = "color: var(--base-text-color); font-size: var(--base-h6-font-size); padding: var(--base-padding)" >Таалагдсан багш алга!</p>`;
        return;
    }

    const lovedHTMLTs = lovedTs.map(u => `
        <a href="/pages/teachInfo.html">
            <section class="tutorCard">
                <div class="tutorImage">
                    <img src="${u.image}" alt="fe">
                    <button class="love" data-id="${u.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                            stroke-linejoin="round" class="heart-icon" style="width: 24px; height: 24px;">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.49l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                            fill="rgba(255, 255, 255, 0.5)"></path>
                        </svg>
                    </button>
                </div>
                <h3>${u.lastName}. ${u.firstName}</h3>
                <p class="tutorReviews">
                    <i class="fa fa-star"></i>
                    <span id="starsNumber">${u.ratings}</span>
                    <span id="reviewsNumber">(${u.numberOfRatings} санал)</span>
                </p>
                <p class="tutorDescription">${u.description}</p>
            </section>
        </a>
    `);

    const lovedTsHTML = lovedHTMLTs.reduce((prev, cur) => prev + cur, '');
    document.getElementById("lovedTutors").innerHTML = lovedTsHTML;

    document.querySelectorAll(".love").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const Tid = button.dataset.id;
            loveT(Tid);
        });
    });
}

renderLovedTs();
