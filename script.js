<script>
function fetchCart() {
    return fetch('/cart.js')
        .then(response => response.json());
}

function showPopup(message) {
    const existingPopup = document.getElementById('cart-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 'cart-popup';
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.backgroundColor = '#333';
    popup.style.color = '#fff';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1000';
    popup.innerHTML = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 5000);
}

function checkCart() {
    fetchCart().then(cart => {
        const totalPrice = cart.total_price / 100;
        const targetAmount = 500;
        const amountLeft = targetAmount - totalPrice;

        if (cart.item_count === 0) {
            sessionStorage.removeItem('goalReached');
            return;
        }

        if (amountLeft > 0) {
            if (sessionStorage.getItem('goalReached') && totalPrice < targetAmount) {
                sessionStorage.removeItem('goalReached');
            }
            const message = `Köp för ytterligare ${amountLeft.toFixed(2)} kr för att få en gratis boosterpack!`;
            showPopup(message);
        } else if (!sessionStorage.getItem('goalReached')) {
            showPopup('Grattis! Du har nått målet och får en gratis boosterpack!');
            sessionStorage.setItem('goalReached', 'true');
        }
    });
}

let lastCartState = null;

function monitorCart() {
    fetchCart().then(cart => {
        if (JSON.stringify(cart) !== lastCartState) {
            lastCartState = JSON.stringify(cart);
            checkCart();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    checkCart();
    setInterval(monitorCart, 2000);
});
</script>
