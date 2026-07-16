// Sample products data
const products = [
    { id: 1, name: 'Modern Vase', price: 49.99, image: 'vase.png', category: 'Decor' },
    { id: 2, name: 'Wooden Table Lamp', price: 79.99, image: 'tab.png', category: 'Lighting' },
    { id: 3, name: 'Ceramic Bowl Set', price: 39.99, image: 'bowl.png', category: 'Kitchen' },
    { id: 4, name: 'Abstract Wall Art', price: 29.99, image: 'art.png', category: 'Decor' },
    { id: 5, name: 'Throw Pillow', price: 19.99, image: 'pillow.png', category: 'Textiles' },
    { id: 6, name: 'Floor Rug', price: 99.99, image: 'rug.png', category: 'Flooring' },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Render products
function renderProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = productList.map(product => `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <span class="category">${product.category}</span>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `).join('');
    }
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById('total-price').textContent = total.toFixed(2);
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Checkout
function checkout() {
    const form = document.getElementById('checkout-form');

    if (form.checkValidity()) {
        // Populate hidden fields with cart data
        document.getElementById('cartItems').value = JSON.stringify(cart);
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById('totalPrice').value = total;

        // Submit the form to backend
        //form.submit();

        // Clear local cart after submission
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    } else {
        alert('Please fill out all fields.');
    }
}


// Filter products
function filterProducts(category) {
    if (category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Handle filter button clicks
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            const filteredProducts = filterProducts(category);
            renderProducts('products-container', filteredProducts);
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('featured-products-container')) {
        renderProducts('featured-products-container', products.slice(0, 3));
    }
    if (document.getElementById('products-container')) {
        renderProducts('products-container', products);
        setupFilters();
    }
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});