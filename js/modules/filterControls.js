import { debounceFilter } from './filterTutors.js';

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.Filterbtn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            const criteria = button.getAttribute('data-criteria') || category;
            debounceFilter(criteria, category);
        });
    });
});