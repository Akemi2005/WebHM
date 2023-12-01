document.addEventListener("DOMContentLoaded", function () {
    var shoppingCartIcon = document.getElementById("shoppingCart");
    var cartItemCount = document.getElementById("cartItemCount");
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    var cartModal = document.getElementById("cartModal");
    var quantityModal = document.getElementById("quantityModal");
    var productLink, productName, productPrice;

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
