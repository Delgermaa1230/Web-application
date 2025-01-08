import { loadDataLocal } from "./modules/loadData.js";

const data = await loadDataLocal();
console.log(data)
const lessons = data[0]



