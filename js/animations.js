// ============================================
// PRODUCT MANAGER - JS ANIMATIONS
// ============================================
// This file adds visual animations on top of the
// existing script.js logic without modifying it.

// ===== DOM REFERENCES =====
var addProductBtn = document.getElementById("addProductBtn");
var loadingSpinner = document.getElementById("loadingSpinner");
var btnText = document.querySelector(".btn-text");
var productDescription = document.getElementById("pd");
var charCount = document.getElementById("charCount");
var charProgressBar = document.getElementById("charProgressBar");
var productCountBadge = document.getElementById("productCountBadge");
var productsContainer = document.getElementById("productsContainer");
var productsList = document.getElementById("productsList");
var confirmModal = document.getElementById("confirmModal");
var particlesContainer = document.getElementById("particlesContainer");

// Keep sync with allProducts array from script.js
// We hook into the existing functions via wrapper

// ============================================
// 1. RIPPLE EFFECT ON ALL BUTTONS
// ============================================
document.querySelectorAll('.ripple-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;

        var ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        btn.appendChild(ripple);

        setTimeout(function() {
            ripple.remove();
        }, 600);
    });
});

// ============================================
// 2. CHARACTER COUNTER WITH PROGRESS BAR
// ============================================
if (productDescription) {
    productDescription.setAttribute('maxlength', '200');
    productDescription.addEventListener('input', function() {
        var len = this.value.length;
        if (charCount) charCount.textContent = len;

        if (charProgressBar) {
            var percent = (len / 200) * 100;
            charProgressBar.style.width = percent + '%';

            // Color coding
            charProgressBar.classList.remove('warning', 'danger');
            if (len > 180) {
                charProgressBar.classList.add('danger');
            } else if (len > 140) {
                charProgressBar.classList.add('warning');
            }
        }
    });
}

// ============================================
// 3. WRAP EXISTING FUNCTIONS FOR ANIMATIONS
// ============================================

// Store original functions
var _origAddNewProduct = window.addNewProduct;
var _origShow = window.show;
var _origClr = window.clr;

// ===== ADD NEW PRODUCT - WRAPPER =====
window.addNewProduct = function() {
    // Validate fields before calling original
    var productName = document.getElementById("pn");
    var productPrice = document.getElementById("pp");
    var productCategory = document.getElementById("pc");
    var productDescription = document.getElementById("pd");

    var inputs = [
        { el: productName, name: 'Product Name' },
        { el: productPrice, name: 'Product Price' },
        { el: productCategory, name: 'Product Category' },
        { el: productDescription, name: 'Product Description' }
    ];

    var hasError = false;
    inputs.forEach(function(item) {
        if (item.el && item.el.value.trim() === '') {
            item.el.classList.add('validation-error', 'shake-anim');
            hasError = true;
            setTimeout(function() {
                item.el.classList.remove('shake-anim');
            }, 500);
        } else if (item.el) {
            item.el.classList.remove('validation-error');
        }
    });

    if (hasError) return;

    // Show loading spinner
    if (btnText && loadingSpinner) {
        btnText.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
    }
    if (addProductBtn) addProductBtn.disabled = true;

    // Call original addNewProduct after small delay for spinner effect
    setTimeout(function() {
        if (_origAddNewProduct) _origAddNewProduct();

        // Hide loading spinner
        if (btnText && loadingSpinner) {
            btnText.classList.remove('d-none');
            loadingSpinner.classList.add('d-none');
        }
        if (addProductBtn) addProductBtn.disabled = false;

        // Animate success message (already shown by original function)
        var successMsg = document.getElementById("successMsg");
        if (successMsg) {
            successMsg.classList.remove('bounce-out');
            successMsg.classList.add('bounce-in');
            // Override original timeout removal with bounce-out
            // Clear any existing timeouts
            if (window._successTimeout) clearTimeout(window._successTimeout);
            window._successTimeout = setTimeout(function() {
                successMsg.classList.remove('bounce-in');
                successMsg.classList.add('bounce-out');
                setTimeout(function() {
                    successMsg.classList.add('d-none');
                    successMsg.classList.remove('bounce-out');
                }, 400);
            }, 2000);
        }

        // Update product count badge
        updateProductCount();

        // Spawn particles
        spawnParticles();

        // Reset char counter
        if (charCount) charCount.textContent = '0';
        if (charProgressBar) {
            charProgressBar.style.width = '0%';
            charProgressBar.classList.remove('warning', 'danger');
        }

    }, 600);
};

// ===== SHOW PRODUCTS - WRAPPER =====
window.show = function() {
    if (_origShow) _origShow();

    // Get allProducts from global scope
    var allProds = window.allProducts || [];
    
    if (allProds.length === 0) {
        if (productsContainer) {
            productsContainer.classList.remove('d-none');
        }
        if (productsList) {
            productsList.innerHTML = '<div class="text-center text-muted py-4" style="color: #64748B !important;">📭 No products yet. Add some!</div>';
        }
        return;
    }

    if (productsContainer) productsContainer.classList.remove('d-none');
    if (productsList) productsList.innerHTML = '';

    allProds.forEach(function(product, index) {
        var card = document.createElement('div');
        card.className = 'product-card';
        card.style.animation = 'fadeInUp 0.4s ease forwards';
        card.style.animationDelay = (index * 0.1) + 's';

        var imgContent = product.img
            ? '<img src="' + product.img + '" alt="' + product.name + '">'
            : '📦';

        var descContent = product.description
            ? '<div class="product-card-desc">' + product.description + '</div>'
            : '';

        card.innerHTML = `
            <div class="product-card-image">${imgContent}</div>
            <div class="product-card-info">
                <h4>${product.name}</h4>
                <div class="product-card-category">${product.category || 'Uncategorized'}</div>
                <div class="product-card-price">$${product.price.toFixed(2)}</div>
                ${descContent}
            </div>
            <button class="product-card-delete" onclick="deleteProduct(${index})" title="Delete product">✕</button>
        `;

        if (productsList) productsList.appendChild(card);
    });
};

// ===== CLEAR - WRAPPER =====
window.clr = function() {
    // Get allProducts
    var allProds = window.allProducts || [];
    if (allProds.length === 0) return;

    // Fade out all product cards if visible
    var cards = document.querySelectorAll('#productsList .product-card');
    cards.forEach(function(card, i) {
        setTimeout(function() {
            card.classList.add('fade-out');
        }, i * 80);
    });

    setTimeout(function() {
        if (_origClr) _origClr();
        
        // Hide modal
        if (confirmModal) {
            confirmModal.classList.add('fade-out');
            setTimeout(function() {
                confirmModal.classList.add('d-none');
                confirmModal.classList.remove('fade-out');
            }, 250);
        }
        
        updateProductCount();
        if (productsList) productsList.innerHTML = '';
        if (productsContainer) productsContainer.classList.add('d-none');
    }, 500);
};

// ============================================
// 4. FLOATING PARTICLES
// ============================================
function spawnParticles() {
    if (!addProductBtn || !particlesContainer) return;
    
    var emojis = ['✨', '⭐', '🌟', '💫', '🎉', '✅', '📦'];
    var btnRect = addProductBtn.getBoundingClientRect();
    var centerX = btnRect.left + btnRect.width / 2;
    var centerY = btnRect.top + btnRect.height / 2;

    for (var i = 0; i < 8; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        var angle = (Math.PI * 2 / 8) * i + (Math.random() - 0.5) * 0.5;
        var distance = 60 + Math.random() * 40;
        var x = centerX + Math.cos(angle) * distance;
        var y = centerY + Math.sin(angle) * distance;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';
        particle.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';

        particlesContainer.appendChild(particle);

        setTimeout(function() {
            particle.remove();
        }, 1500);
    }
}

// ============================================
// 5. PRODUCT COUNT BADGE
// ============================================
function updateProductCount() {
    if (!productCountBadge) return;
    var allProds = window.allProducts || [];
    productCountBadge.textContent = allProds.length;
    productCountBadge.classList.remove('pop');
    // Force reflow to restart animation
    void productCountBadge.offsetWidth;
    productCountBadge.classList.add('pop');
}

// ============================================
// 6. HIDE PRODUCTS
// ============================================
function hideProducts() {
    if (productsContainer) productsContainer.classList.add('d-none');
}

// ============================================
// 7. DELETE INDIVIDUAL PRODUCT
// ============================================
function deleteProduct(index) {
    var cards = document.querySelectorAll('#productsList .product-card');
    if (cards[index]) {
        cards[index].classList.add('fade-out');
        setTimeout(function() {
            var allProds = window.allProducts || [];
            if (index >= 0 && index < allProds.length) {
                allProds.splice(index, 1);
                updateProductCount();
                window.show(); // Re-render
            }
        }, 400);
    }
}

// ============================================
// 8. CONFIRM / CANCEL CLEAR
// ============================================
function confirmClear() {
    var allProds = window.allProducts || [];
    if (allProds.length === 0) return;
    if (confirmModal) {
        confirmModal.classList.remove('d-none', 'fade-out');
    }
}

function cancelClear() {
    if (confirmModal) {
        confirmModal.classList.add('fade-out');
        setTimeout(function() {
            confirmModal.classList.add('d-none');
            confirmModal.classList.remove('fade-out');
        }, 250);
    }
}

// ============================================
// 9. INPUT FOCUS ANIMATIONS
// ============================================
var formInputs = document.querySelectorAll('.form-floating > .form-control');
formInputs.forEach(function(input) {
    input.addEventListener('focus', function() {
        this.closest('.form-floating').style.transform = 'scale(1.01)';
        this.closest('.form-floating').style.transition = 'transform 0.2s ease';
    });
    input.addEventListener('blur', function() {
        this.closest('.form-floating').style.transform = 'scale(1)';
    });
});
