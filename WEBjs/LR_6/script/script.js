document.addEventListener("DOMContentLoaded", function () {
    var shoppingCartIcon = document.getElementById("shoppingCart");
    var cartItemCount = document.getElementById("cartItemCount");
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    var cartModal = document.getElementById("cartModal");
    var quantityModal = document.getElementById("quantityModal");
    var productLink, productName, productPrice;
    var products = [];
    var currentProductIndex = 0;
    var panelsPerPage = 4;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            products = JSON.parse(xhr.responseText);
            displayProducts(products);
        }
    };
    xhr.open("GET", "https://raw.githubusercontent.com/Akemi2005/WebHM/main/WEBjs/LR_6/products.json", true);
    xhr.send();

    fetch("https://raw.githubusercontent.com/Akemi2005/WebHM/main/WEBjs/LR_6/products.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        products = data;
        displayProducts(products);
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });

    function displayProducts(products) {
        var productContainer = document.getElementById("productCarousel");
        productContainer.innerHTML = "";

        products.forEach(function (product, index) {
            var panel = document.createElement("div");
            panel.className = "panel";

            var isNew = product.new ? '<span class="note new">новинка</span>' : '';
            var isHit = product.bestseller ? '<span class="note hit">хіт продажів</span>' : '';

            var category = '<div class="categor"><a href="' + product.categoryLink + '">' + product.category + '</a></div>';

            var picture = '<div class="picture"><a href="' + product.link + '"><img src="' + product.image + '" alt="' + product.name + '"></a></div>';

            var productName = '<div class="prod ' + (product.bold ? 'bold' : '') + '"><a href="' + product.link + '" title="' + product.title + '">' + product.name + '</a></div>';

            var costs = '<div class="costs ' + (product.bold ? 'bold' : '') + '"><span class="discount-price">' + (product.discount ? product.discountPrice : '') + '</span><span class="price">' + product.price + ' грн</span></div>';

            var availability = '<div><a class="btn ' + (product.available ? 'avl' : 'soon') + ' ' + (product.bold ? 'bold' : '') + '" href="#">' + (product.available ? 'у корзину' : 'незабаром у продажі') + '</a></div>';

            panel.innerHTML = isNew + isHit + category + '<hr>' + picture + productName + costs + availability;

            productContainer.appendChild(panel);
        });

        showCurrentProduct();
    }

    function showCurrentProduct() {
        var panels = document.querySelectorAll(".panel");
        panels.forEach(function (panel, index) {
            var isVisible = index >= currentProductIndex && index < currentProductIndex + panelsPerPage;
            panel.style.display = isVisible ? "block" : "none";
        });
    }
    window.prevProduct = function () {
        if (currentProductIndex > 0) {
            currentProductIndex--;
        }
        showCurrentProduct();
    };
    
    window.nextProduct = function () {
        var totalPages = Math.ceil(products.length / panelsPerPage);
        var lastPageIndex = totalPages - 1;
    
        if (currentProductIndex < lastPageIndex * panelsPerPage) {
            currentProductIndex++;
        } else {
            currentProductIndex = 0;
        }
    
        showCurrentProduct();
    };
    
    
    document.body.addEventListener("click", function (event) {
        var button = event.target.closest(".avl");

        if (button) {
            var parentPanel = button.parentElement.parentElement;
            var productAnchor = parentPanel.querySelector('.prod a');
            var priceElement = parentPanel.querySelector('.price');

            if (productAnchor && priceElement) {
                productName = productAnchor.innerText;
                productLink = productAnchor.href;
                productPrice = getPrice(priceElement);

                openQuantityModal();
            } else {
                console.error("Required elements not found.");
            }
        }
    });

    function openQuantityModal() {
        var quantityInput = document.getElementById("quantityInput");
        if (quantityModal && quantityInput) {
            quantityModal.style.display = "flex";
            quantityInput.value = 1;
        } else {
            console.error("Quantity modal or input not found.");
        }
    }

    window.closeQuantityModal = function () {
        var quantityModal = document.getElementById("quantityModal");
        if (quantityModal) {
            quantityModal.style.display = "none";
        } else {
            console.error("Quantity modal not found.");
        }
    };

    shoppingCartIcon.addEventListener("click", function () {
        if (cartItems.length === 0) {
            openCartModal();
        } else {
            window.location.href = "cart/index.html";
        }
    });

    function openCartModal() {
        if (cartItems.length === 0) {
            cartModal.style.display = "flex";
        } else {
            cartModal.style.display = "flex";
            var modalContent = `
                <div>
                    Товар додано
                    <div class="buttons">
                        <button onclick="goToCart()">Перейти у корзину</button>
                        <button onclick="continueShopping()">Повернутись до покупок</button>
                    </div>
                </div>`;
            cartModal.innerHTML = modalContent;
        }
    }

    window.goToCart = function () {
        window.location.href = "cart/index.html";
    };

    window.continueShopping = function () {
        cartModal.style.display = "none";
    };

    window.closeCartModal = function () {
        cartModal.style.display = "none";
    };

    window.openQuantityModal = function () {
        openQuantityModal();
    };

    window.addToCartModal = function () {
        var quantityInput = document.getElementById("quantityInput");
        var quantity = quantityInput.value;

        if (isValidQuantity(quantity)) {
            addToCart(productLink, quantity, productName, productPrice);
            updateCartItemCount();
            closeQuantityModal();
            openCartModal();
        } else {
            console.error("Invalid quantity.");
        }
    };

    function updateCartItemCount() {
        var cartItemCount = document.getElementById("cartItemCount");
        var uniqueItemCount = getUniqueItemCount();
        cartItemCount.innerText = uniqueItemCount;
    }
    
    updateCartItemCount();

    function addToCart(productLink, quantity, productName, productPrice) {
        var item = {
            link: productLink,
            quantity: parseInt(quantity),
            name: productName,
            price: productPrice
        };
        cartItems.push(item);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    function getUniqueItemCount() {
        return new Set(cartItems.map(item => item.link)).size;
    }

    function isValidQuantity(quantity) {
        return quantity !== null && quantity !== "" && !isNaN(quantity) && parseInt(quantity) > 0;
    }

    function getPrice(element) {
        var priceString = element.innerText.trim().replace("грн", "");
        return parseFloat(priceString);
    }
});
