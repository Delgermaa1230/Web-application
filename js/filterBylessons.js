import Product from './Product.js';

async function fetchProducts() {
    const response = await fetch('https://example.com/products.json'); // Өөрийн JSON URL оруулна уу
    const products = await response.json();
    return products;
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category'),
        brand: params.get('brand')
    };
}

function filterProducts(products, filters) {
    return products.filter(product => {
        const categoryMatch = !filters.category || product.category === filters.category;
        const brandMatch = !filters.brand || product.brand === filters.brand;
        return categoryMatch && brandMatch;
    });
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(productData => {
        const product = new Product(productData.id, productData.name, productData.category, productData.brand, productData.price);
        productList.insertAdjacentHTML('beforeend', product.render());
    });
}

async function init() {
    const allProducts = await fetchProducts();
    const filters = getQueryParams();
    const filteredProducts = filterProducts(allProducts, filters);
    displayProducts(filteredProducts);
}

init();
