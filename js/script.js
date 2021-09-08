const fetchProducts = () => {
    fetch('datas.json')
        .then(response => response.json())
        .then(data => displayProducts(data.products))
}

fetchProducts();

const displayProducts = products => {
    const productContainer = document.getElementById('productContainer');
    products.forEach(product => {
        productContainer.innerHTML += `
        <div class="col">
            <div class="card h-100 bg-warning">
                <img src="images/${product.image}" class="card-img-top"
                    alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.product_title}</h5>
                    <p class="card-text">${product.product_desp}</p>
                    <p class="fs-5 fw-bold text-success card-text">Price: ${product.price} $</p>
                </div>
                <div class="card-footer">
                    <button type="button" onclick="addToCart('${product.id}')" class="btn btn-outline-success btn-lg">Cart +</button>
                </div>
            </div>
        </div>
        `;
    });
}

const addToCart = product => {
    fetch('datas.json')
        .then(response => response.json())
        .then(data => {
            data.products.forEach(e => {
                if (e.id == product) {
                    addProductToCart(e);
                }
            })
        });
    location.reload();
};

const getCart = () => {
    const cart = localStorage.getItem('cart');
    let cartObj;
    if (cart) {
        cartObj = JSON.parse(cart);
    }
    else {
        cartObj = {};
    }
    return cartObj;
};

const addProductToCart = (e) => {
    const cart = getCart();
    if (cart[e.id]) {
        for (const item in cart[e.id]) {
            if (item.includes('quantity')) {
                cart[e.id][item] += 1;
            }
        };
    }
    else {
        cart[e.id] = {
            pd_name: e.product_title,
            pd_img: e.image,
            pd_quantity: 1,
            pd_price: e.price
        };
    }
    const cartStringfy = JSON.stringify(cart);
    localStorage.setItem('cart', cartStringfy);
}

const displayCartItem = () => {
    const cart = getCart();
    if (Object.keys(cart).length !== 0) {
        document.getElementById('cartImg').style.display = 'none';
    }
    const cartItems = document.getElementById('cartItems');
    for (const id in cart) {
        cartItems.innerHTML += `
            <div class="card mb-3 bg-warning" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-6">
                        <img src="images/${cart[id].pd_img}" class="img-fluid rounded-start" alt="...">
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">
                            <h5 class="card-title">${cart[id].pd_name}</h5>
                            <h5 class="card-title text-danger">Quantity: <span id="quantity">${cart[id].pd_quantity}</span></h5>
                            <h5 class="card-title text-success">Price: <span class="cost">${parseFloat(cart[id].pd_quantity) * parseFloat(cart[id].pd_price)}</span>$</h5 >
                        </div >
                    </div >
                </div >
            </div >
    `;
    }
}

displayCartItem();

const totalBill = () => {
    const totalCost = document.getElementById('totalCost');
    let total = 0;
    let prices = document.getElementsByClassName('cost');
    for (const price of prices) {
        total = total + parseFloat(price.innerText);
    }
    totalCost.innerText = total;
}

document.getElementById('buyBtn').addEventListener('click', () => {
    const response = confirm(`Hay! We hope you find your best options from our site. Buy cart products by paying ${document.getElementById('totalCost').innerText} $.`);
    if (response == true) {
        const method = prompt('Please write account No.');
        if (method) {
            alert('CONGRATULATION! Your Purchase is Complete. Thank You! You will get your products shipped in between 7 days.');
            document.getElementById('cartFunctions').textContent = '';
            localStorage.removeItem('cart');
            location.reload();
        }
    }
});

totalBill();