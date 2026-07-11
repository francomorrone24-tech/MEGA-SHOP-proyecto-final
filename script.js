const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartCounter = document.getElementById('cart-counter');
const cartTotal = document.getElementById('cart-total');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

const TIPO_CAMBIO_ARS = 1000;

const traduccionesProductos = {
    "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops": "Mochila Fjallraven - Foldsack No. 1 (Para Laptop 15\")",
    "Mens Casual Premium Slim Fit T-Shirts": "Remera Casual Premium Slim Fit para Hombre",
    "Mens Casual Premium Slim Fit T-Shirts ": "Remera Casual Premium Slim Fit para Hombre",
    "Mens Cotton Jacket": "Campera de Algodón para Hombre",
    "Mens Casual Slim Fit": "Pantalón Casual Slim Fit para Hombre",
    "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet": "Pulsera de Plata y Oro Dragón Naga - John Hardy",
    "Solid Gold Petite Micropave": "Anillo de Oro Sólido Micropavé",
    "Solid Gold Petite Micropave ": "Anillo de Oro Sólido Micropavé",
    "White Gold Plated Princess": "Anillo de Princesa Bañado en Oro Blanco",
    "Pierced Owl Rose Gold Plated Stainless Steel Double": "Aros de Acero Inoxidable Bañados en Oro Rosa"
};

let cart = JSON.parse(localStorage.getItem('shop_cart')) || [];

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!response.ok) throw new Error('Error al obtener los datos');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        productsContainer.innerHTML = `<p class="text-danger text-center">Error al conectar con el servidor. Intente nuevamente.</p>`;
        console.error(error);
    }
}

function renderProducts(products) {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const precioEnPesos = product.price * TIPO_CAMBIO_ARS;
        const tituloTraducido = traduccionesProductos[product.title.trim()] || product.title;
        
        const card = document.createElement('div');
        card.className = 'card h-100 m-2';
        card.style.width = '16rem';
        
        card.innerHTML = `
            <img src="${product.image}" class="card-img-top p-3" alt="${tituloTraducido}" style="height: 200px; object-fit: contain; background-color: #ffffff;">
            <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title text-truncate" title="${tituloTraducido}">${tituloTraducido}</h5>
                <p class="card-text fw-bold text-cyan">$${precioEnPesos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARS</p>
                <button class="btn add-to-cart-btn w-100" data-id="${product.id}" data-title="${tituloTraducido}" data-price="${precioEnPesos}">
                    <i class="fas fa-cart-plus me-2"></i>Agregar
                </button>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

function updateCart() {
    localStorage.setItem('shop_cart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCounter.textContent = totalItems;
    
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div class="text-truncate" style="max-width: 200px;">
                <h6 class="m-0 text-white">${item.title}</h6>
                <small class="text-cyan">$${item.price.toLocaleString('es-AR')} ARS c/u</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <input type="number" class="form-control form-control-sm change-qty form-input-custom text-center" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 55px;">
                <button class="btn btn-danger btn-sm delete-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(li);
    });
    
    cartTotal.textContent = `$${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARS`;
}

productsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        const price = parseFloat(btn.getAttribute('data-price'));
        
        const existingProduct = cart.find(item => item.id === id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ id, title, price, quantity: 1 });
        }
        updateCart();
    }
});

cartItemsContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('change-qty')) {
        const id = e.target.getAttribute('data-id');
        const newQty = parseInt(e.target.value);
        const product = cart.find(item => item.id === id);
        if (product && newQty > 0) {
            product.quantity = newQty;
            updateCart();
        }
    }
});

cartItemsContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-item');
    if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    alert("¡Muchas gracias por su compra!");
    cart = [];
    updateCart();
    
    const modalEl = document.getElementById('cartModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');
    
    messageDiv.innerHTML = `<p class="text-success fw-bold m-0 mt-3">¡Mensaje enviado con éxito! Nos comunicaremos a la brevedad.</p>`;
    
    form.reset();
    
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
});

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCart();
});