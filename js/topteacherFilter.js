import classTutor, { loadData } from "./searchResult/SR-tutorSec.js";

const tutors = await loadData();

const filterTopTeachers = (t) => {
  return t
    .sort((a, b) => {
      const aScore = a.ratings * a.numberOfRatings;
      const bScore = b.ratings * b.numberOfRatings;
      return bScore - aScore;
    })
    .slice(0, 8);
};

const filteredtutors = filterTopTeachers(tutors);

const topTutorsHTML = filteredtutors
  .map((array) => new classTutor(array).render())
  .reduce((p, c) => p + c, "");

document.getElementById("topTutors").insertAdjacentHTML("beforeend", topTutorsHTML);

let lovedTs = JSON.parse(localStorage.getItem("lovedTs")) || [];

window.loveT = (Tid) => {
  const t = tutors.find((i) => String(i.id) === String(Tid));
  console.log("Tutor found:", t);

  if (t) {

    const loveBtn = document.querySelector(`button[data-id="${Tid}"]`);
    // багш таалагдсан листэд орсон эсэхийг шалгах
    const isLoved = lovedTs.some((l) => l.id === t.id);

    if (!isLoved) {
      // ороогүй байвал листэд нэмэх
      lovedTs.push(t);
      localStorage.setItem("lovedTs", JSON.stringify(lovedTs));
      console.log("Loved tutors:", lovedTs);  
      alert(`Та ${t.firstName}-г тааллаа.`);

      loveBtn.classList.add('loved');
      
    } else {
      // орсон байвал хасах эсэхийг нь асуух
      const removeC = confirm(`Та ${t.firstName}-г хасахыг хүсч байна уу?`);

      if (removeC) {
        // хасах 
        lovedTs = lovedTs.filter((l) => l.id !== t.id);
        localStorage.setItem("lovedTs", JSON.stringify(lovedTs));
        console.log("Loved tutors after removal:", lovedTs);
        alert(`Та ${t.firstName}-г хаслаа.`);

        loveBtn.classList.remove('loved');
      } else {
        alert("Т Tutor үлдлээ.");
      }
    }
  } else {
    alert("Т Tutor олдсонгүй.");
  }
};

document.querySelectorAll(".love").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault(); // a tag
    const Tid = event.target.closest(".love").dataset.id; // data-id nnas tutor id avah
    loveT(Tid);
  });
});

