class LovedTutorsManager {
  constructor() {
    this.lovedTutors = JSON.parse(localStorage.getItem("lovedTutors")) || [];
    this.subscribers = []; // төлөвийн өөрчлөлтийг мэдэх хэрэгтэй components
  }

  // Багшийг loved - д нэмэх
  addTutor(tutorId) {
    if (!this.lovedTutors.includes(tutorId)) {
      this.lovedTutors.push(tutorId);
      this.saveToLocalStorage();
      this.notifySubscribers();
      return true; // Багшийг нэмсэн
    }
    return false; // Багш аль хэдийн байна
  }

  // Багшийг loved - оос хасах
  removeTutor(tutorId) {
    const index = this.lovedTutors.indexOf(tutorId);
    if (index !== -1) {
      this.lovedTutors.splice(index, 1);
      this.saveToLocalStorage();
      this.notifySubscribers();
      return true; // Багшийг аргилаа
    }
    return false; // Багш байхгүй байна
  }

  // Loved tutors ийн тоог авах
  getCount() {
    return this.lovedTutors.length;
  }

  // Одоогийн төлвийг LocalStorage хадгалах
  saveToLocalStorage() {
    localStorage.setItem("lovedTutors", JSON.stringify(this.lovedTutors));
  }

  // Төлөв өөрчлөгдөхөд subscribe хийсэн component нарт мэдэгдэх
  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.lovedTutors));
  }

  // Төлөвийн өөрчлөлтийг авах subx
  subscribe(callback) {
    this.subscribers.push(callback);
  }
}

// Global хувьсагч үүсгэх
const lovedTutorsManager = new LovedTutorsManager();