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

  if (t && !lovedTs.some((l) => l.id === t.id)) {
    lovedTs.push(t);
    localStorage.setItem("lovedTs", JSON.stringify(lovedTs));
    console.log("loved tutors:", localStorage.getItem("lovedTs"));
    alert(`Та ${t.firstName}-г тааллаа.`);
  } else {
    alert("Аль хэдийн таалагдсан байна.");
  }
};

document.querySelectorAll(".love").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the <a> tag's default behavior
    const Tid = event.target.closest(".love").dataset.id; // Get the tutor ID from data-id
    loveT(Tid);
  });
});

