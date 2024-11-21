const teachersData = {
  "teachers": [
    {
      "id": 1,
      "firstName": "Дэлгэрмаа",
      "lastName": "Галбаяр",
      "age": "20",
      "gender": "F",
      "ratings": 5,
      "numberOfRatings": 10,
      "email": "galbayardelgermaa@gmail.com",
      "phone": "89234723",
      "image": "../imgs/img1.png",
      "description": "Би математикт маш их дуртай, бас заах эрмэлзэлтэй учир би багш",
      "lessons": [
        "Математик", "Алгоритм", "Программчлалын хэл Си"
      ]
    },
    {
      "id": 2,
      "firstName": "Номин",
      "lastName": "Төмөрбаатар",
      "age": "28",
      "gender": "F",
      "ratings": 4,
      "numberOfRatings": 15,
      "email": "nomintomor@gmail.com",
      "phone": "89345567",
      "image": "../imgs/img2.png",
      "description": "Би физик болон инженерийн сэдвүүдэд мэргэшсэн. Багшаар ажиллаж буй нь миний хүсэл.",
      "lessons": [
        "Физик", "Хөдөлгөөнт механик", "Эрчим хүчний систем"
      ]
    },
    {
      "id": 3,
      "firstName": "Санжид",
      "lastName": "Мөнх-Эрдэнэ",
      "age": "32",
      "gender": "M",
      "ratings": 3,
      "numberOfRatings": 20,
      "email": "sanjidmunkh@gmail.com",
      "phone": "89234764",
      "image": "../imgs/img3.png",
      "description": "Математикийн багшаар 8 жил ажилласан. Статистикийн хичээлийг сайн заадаг.",
      "lessons": [
        "Математик", "Статистик", "Төрөл бүрийн тооцоолол"
      ]
    },
    {
      "id": 4,
      "firstName": "Түмэнжаргал",
      "lastName": "Цогтгэрэл",
      "age": "25",
      "gender": "M",
      "ratings": 5,
      "numberOfRatings": 8,
      "email": "tumenjargal@gmail.com",
      "phone": "89385623",
      "image": "../imgs/img4.png",
      "description": "Би инженерчлэлийн багшаар ажиллахыг хүсдэг. Хэрэглээний математик заах дуртай.",
      "lessons": [
        "Хэрэглээний математик", "Математик ба эдийн засаг"
      ]
    },
    {
      "id": 5,
      "firstName": "Ганбат",
      "lastName": "Лхагвасүрэн",
      "age": "30",
      "gender": "M",
      "ratings": 4,
      "numberOfRatings": 12,
      "email": "ganbatlhagvasuren@gmail.com",
      "phone": "89452374",
      "image": "../imgs/img5.png",
      "description": "Программчлалын багш, веб хөгжүүлэлтийн чиглэлээр туршлагатай.",
      "lessons": [
        "Веб хөгжүүлэлт", "Программчлал"
      ]
    },
    {
      "id": 6,
      "firstName": "Намуунаа",
      "lastName": "Цэрэнбат",
      "age": "27",
      "gender": "F",
      "ratings": 5,
      "numberOfRatings": 10,
      "email": "namuunaatseren@gmail.com",
      "phone": "89562347",
      "image": "../imgs/img6.png",
      "description": "Интернет маркетингийн чиглэлээр багшилж байна. Сошиал медиа хэрэглээг заадаг.",
      "lessons": [
        "Интернет маркетинг", "Сошиал медиа"
      ]
    },
    {
      "id": 7,
      "firstName": "Билгүүн",
      "lastName": "Галбадрах",
      "age": "34",
      "gender": "M",
      "ratings": 4,
      "numberOfRatings": 14,
      "email": "bilguungalbadrah@gmail.com",
      "phone": "89673452",
      "image": "../imgs/img7.png",
      "description": "Би компьютерийн системийн багш. Системийн архитектурын хичээл заадаг.",
      "lessons": [
        "Системийн архитектур", "Компьютерийн сүлжээ"
      ]
    },
    {
      "id": 8,
      "firstName": "Мөнгөнзаяа",
      "lastName": "Төмөр",
      "age": "22",
      "gender": "F",
      "ratings": 4,
      "numberOfRatings": 9,
      "email": "mongonzayaatomer@gmail.com",
      "phone": "89745263",
      "image": "../imgs/img8.png",
      "description": "Би математик, физикийн хичээлүүдийг сонирхдог. Студентуудтай харилцахад хичээл заахдаа таатай байдаг.",
      "lessons": [
        "Математик", "Физик"
      ]
    },
    {
      "id": 9,
      "firstName": "Жаргалсайхан",
      "lastName": "Батзориг",
      "age": "29",
      "gender": "M",
      "ratings": 5,
      "numberOfRatings": 16,
      "email": "jargalsaihanbatzor@gmail.com",
      "phone": "89983412",
      "image": "../imgs/img9.png",
      "description": "Би мэдээллийн технологи, програмчлалын багш. Студентуудын амжилтанд тустай байхын тулд сайн сургалт явуулдаг.",
      "lessons": [
        "Програмчлал", "Мэдээллийн технологи"
      ]
    },
    {
      "id": 10,
      "firstName": "Цогт-Эрдэнэ",
      "lastName": "Чулуунбилэг",
      "age": "26",
      "gender": "M",
      "ratings": 4,
      "numberOfRatings": 13,
      "email": "tsogt-erdene@gmail.com",
      "phone": "89273568",
      "image": "../imgs/img10.png",
      "description": "Математик, физик, инженерийн чиглэлээр багшилдаг. Шинжлэх ухааны аргачлал дээр анхаардаг.",
      "lessons": [
        "Математик", "Физик", "Инженерийн математик"
      ]
    }
  ]
}

const teachers = teachersData.teachers;

const filterTopTeachers = (teachers) => {
  return teachers
    .sort((a, b) => {
      const aScore = a.ratings * a.numberOfRatings;
      const bScore = b.ratings * b.numberOfRatings;
      return bScore - aScore; //buurhaar erembleh
    })
    .slice(0, 3); // 3g n avah
};

const top3Teachers = filterTopTeachers(teachers);
console.log(top3Teachers);

const top3TeachersHTMLarray = top3Teachers.map(ft =>
  `<a href="/pages/teachInfo.html">
    <section class="tutorCard">
      <div class="tutorImage"><img src="${ft.image}" alt="fe"></div>
      <div class="tutorInfo">
        <h3>${ft.firstName} ${ft.lastName}</h3>
        <p class="tutorReviews">
          <i class="fa fa-star"></i>
          <span id="starsNumber">${ft.ratings}</span>
          <span id="reviewsNumber">
            (${ft.numberOfRatings} санал)
          </span>
        </p>
      </div>
      <p class="tutorDescription">
        ${ft.description}
      </p>
    </section>
  </a>`
);

const top3TeachersHTML = top3TeachersHTMLarray.reduce((prev, cur) => prev + cur);
console.log(top3TeachersHTML);
document.getElementById("topTeachers").innerHTML = top3TeachersHTML;
