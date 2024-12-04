const body = document.querySelector("body");
const listProductHTML = document.querySelector('.listProduct');
const cartTab = document.getElementById('cartTab');
const overlay = document.getElementById('overlay');
const cartContent = document.querySelector('.cart-content');
const totalPriceElement = document.getElementById('totalPrice');
const toastContainer = document.getElementById('toast-container');
const modalContainer = document.querySelectorAll('.modal');

//-------------------------Format Date------------------------------
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
}
//----------------------------------------------------------------------
function scrollToSection() {
    const productSection = document.querySelector('.tieude');
    setTimeout(() => {
        productSection.scrollIntoView({ behavior: 'smooth' });
    }, 0);
}

function getPathImage(path) {
    const pathParts = path.split('\\');
    const pathName = pathParts.pop();
    return "./asset/image/" + pathName;
}
function closeModal() {
    modalContainer.forEach(item => {
        item.classList.remove('open');
    });
    body.style.overflow = "auto";
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
//-----------------Tim kiem co ban && chon danh muc---------------------
function searchProducts() {
    const paginationContainer = document.querySelector('.pagination-controls');
    const searchInput = document.querySelector('.form-search-input').value.toLowerCase();
    if (searchInput === "") {
        // Nếu ô tìm kiếm trống, hiển thị trang chủ
        showSection('home');
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchInput) ||
        product.desc.toLowerCase().includes(searchInput)
    );

    if (filteredProducts.length === 0) {
        // Hiển thị thông báo không tìm thấy sản phẩm
        document.querySelector('.listProduct').innerHTML = `
            <div class="no-result">
                <div class="no-result-h">Không tìm thấy kết quả</div>
                <div class="no-result-p">Xin lỗi, chúng tôi không tìm thấy sản phẩm phù hợp với tìm kiếm của bạn.</div>
                <div class="no-result-i"><i class="fa-solid fa-face-sad-cry"></i></div>
            </div>`;
    } else {
        // Hiển thị danh sách sản phẩm đã lọc
        renderProducts(filteredProducts);
        paginationContainer.classList.add('hidden');
    }
}



function showSection(sectionId) {
    // Ẩn tất cả các phần nội dung
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active'); // Xóa trạng thái active
    });

    // Hiển thị phần được chọn
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        const productSection = document.querySelector('.main-wrapper');
        setTimeout(() => {
            productSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        selectedSection.classList.add('active');

    }
}

//------------------------Catagory san pham----------------------------------------
function toggleMenu() {
    const categoryMenu = document.getElementById('category-menu');
    if (categoryMenu.classList.contains('open')) {
        categoryMenu.classList.remove('open'); // Đóng menu
    } else {
        categoryMenu.classList.add('open'); // Mở menu
    }
}

// Lọc sản phẩm theo danh mục
function filterProducts(category) {
    const filteredProducts = products.filter(product => product.catagory === category);

    const listProductHTML = document.querySelector('.listProduct');
    const paginationContainer = document.querySelector('.pagination-controls');

    if (filteredProducts.length === 0) {
        // Hiển thị thông báo không tìm thấy sản phẩm
        listProductHTML.innerHTML = `
            <div class="no-result">
                <div class="no-result-h">Không tìm thấy sản phẩm</div>
                <div class="no-result-p">Xin lỗi, không có sản phẩm nào thuộc danh mục ${category}.</div>
            </div>`;
        paginationContainer.classList.add('hidden');
    } else {
        // Hiển thị danh sách sản phẩm đã lọc
        renderProducts(filteredProducts);
        paginationContainer.classList.add('hidden');
    }
}
// Mặc định hiển thị Trang chủ
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
});

// Hiển thị danh sách sản phẩm !!! (quan trọng)
function renderProducts(productList) {
    const listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = ''; // Xóa nội dung cũ
    productList.forEach(product => {
        const productHTML = `
        <div class="item" data-id="${product.id}">
            <img src="${getPathImage(product.image)}" alt="${product.name}" onclick="openProductDetail(${product.id})">
            <h2 onclick="openProductDetail(${product.id})">${product.name}</h2>
            <div class="price">${formatCurrency(product.price)}</div>
        </div>`;
        listProductHTML.innerHTML += productHTML;
        scrollToSection();
    });
}

function showAllProducts() {
    renderProductsForPage(currentPage); // Hiển thị sản phẩm theo phân trang
    renderPaginationControls(); // Hiển thị các nút phân trang

    // Hiện lại phân trang
    const paginationContainer = document.querySelector('.pagination-controls');
    paginationContainer.classList.remove('hidden');
    scrollToSection();
}


//---------------------------Slideshow--------------------------
let slideIndex = 1;
let slideInterval;

// Initialize the slideshow
document.addEventListener('DOMContentLoaded', () => {
    showSlides(slideIndex);
    startAutoSlide();
});

// Display the current slide
function showSlides(n) {
    const slides = document.querySelectorAll('#slideshow-wrapper .slide');
    const dots = document.querySelectorAll('#slideshow-wrapper .dot');

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].classList.add('active');
}

// Navigate between slides
function changeSlide(n) {
    clearInterval(slideInterval); // Stop auto-slide on manual interaction
    showSlides(slideIndex += n);
    startAutoSlide(); // Restart auto-slide
}

// Jump to a specific slide
function currentSlide(n) {
    clearInterval(slideInterval);
    showSlides(slideIndex = n);
    startAutoSlide();
}

// Auto-slide functionality
function startAutoSlide() {
    slideInterval = setInterval(() => {
        showSlides(slideIndex += 1);
    }, 3000); // Change slide every 3 seconds
}

//------------------------------------------Giỏ hàng--------------------------------------------------------------------
let cart = [];

function openCart() {
    cartTab.style.right = '20px'; // Mở giỏ hàng
    overlay.classList.add('show'); // Hiển thị overlay làm mờ
    body.style.overflow = 'hidden'; // Ngừng cuộn trang
}

// Đóng giỏ hàng
function closeCart() {
    cartTab.style.right = '-500px'; // Đóng giỏ hàng
    overlay.classList.remove('show'); // Ẩn overlay
    body.style.overflow = 'auto'; // Bật lại cuộn trang
}


// Chức năng giỏ hàng


function adjustQuantity(productId, size, action) {
    // Tìm sản phẩm với id và size phù hợp
    const product = cart.find(item => item.id === productId && item.size === size);
    if (product) {
        if (action === 'increase') {
            product.quantity += 1; // Tăng số lượng
        } else if (action === 'decrease') {
            product.quantity -= 1; // Giảm số lượng
            if (product.quantity <= 0) {
                // Nếu số lượng giảm xuống 0, xóa sản phẩm
                removeFromCart(productId, size);
                return; // Dừng không cần cập nhật thêm
            }
        }
    }
    updateCartDisplay(); // Cập nhật hiển thị trong giỏ hàng
    saveCartToLocalStorage(); // Lưu lại giỏ hàng vào localStorage
    updateCartBadge(); // Cập nhật số lượng trên biểu tượng giỏ hàng
}

function updateCartBadge() { // Cập nhật số lượng
    const cartBadge = document.querySelector('.count-product-cart');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartBadge.textContent = totalItems;


    // Thêm hiệu ứng
    cartBadge.classList.add('animate');
    setTimeout(() => {
        cartBadge.classList.remove('animate');
    }, 300);

}

//  Hiển thị trong giỏ hàng
function updateCartDisplay() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = ''; // Xóa nội dung cũ

    let total = 0;

    if (cart.length === 0) {
        cartContent.innerHTML = '<p>Không có sản phẩm nào trong giỏ hàng.</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemSize = item.size || 'Chưa chọn size';

            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">${formatCurrency(itemTotal)}</span>
                    </div>
                    <span class="cart-item-size">Kích thước: ${itemSize}</span> 
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button onclick="adjustQuantity(${item.id}, '${item.size}', 'decrease')">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button onclick="adjustQuantity(${item.id}, '${item.size}', 'increase')">+</button>
                        </div>
                        <button class="remove-button" onclick="removeFromCart(${item.id}, '${item.size}')">Xóa</button>
                    </div>
                </div>
            `;
            cartContent.innerHTML += cartItemHTML;
        });
    }

    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = formatCurrency(total);
}

// Thêm vào giỏ hàng
function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1; // Số lượng tăng
        showToast(`Đã có ${existingProduct.quantity} ${product.name} trong giỏ hàng`);
    } else {
        cart.push({ ...product, quantity: 1 }); // Thêm sp chưa có vào giỏ hàng
        showToast(`${product.name} đã được thêm váo giỏ hàng.`);
    }

    updateCartDisplay();
    saveCartToLocalStorage();
    updateCartBadge();
}

function removeFromCart(productId, size) {
    // Tìm sản phẩm với id và size phù hợp để loại bỏ
    cart = cart.filter(item => !(item.id === productId && item.size === size));

    updateCartDisplay(); // Cập nhật hiển thị giỏ hàng
    saveCartToLocalStorage(); // Lưu lại giỏ hàng vào localStorage
    updateCartBadge(); // Cập nhật số lượng trên biểu tượng giỏ hàng
}

// Lưu vào localstorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Tải dữ liệu localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
        updateCartBadge();
    }
}

// 
function addCartButtonListeners() {
    const addCartButtons = document.querySelectorAll('.addCart');
    addCartButtons.forEach(button => {
        button.onclick = () => {
            const productId = parseInt(button.parentElement.dataset.id);
            addToCart(productId);
        };
    });
}

// Khởi tạo giỏ hàng
function initializeCart() {
    loadCartFromLocalStorage();
    addCartButtonListeners();
}







function updateAmount() {
    if (localStorage.getItem('currentuser') != null) {
        let amount = getAmountCart();
        document.querySelector('.count-product-cart').innerText = amount;
    }
}
//---------------------------------------- Dang nhap & Dang ky--------------------------------

// Chuyen doi qua lai SignUp & Login 
let signup = document.querySelector('.signup-link');
let login = document.querySelector('.login-link');
let container = document.querySelector('.signup-login .modal-container');
login.addEventListener('click', () => {
    container.classList.add('active');
})

signup.addEventListener('click', () => {
    container.classList.remove('active');
})

let signupbtn = document.getElementById('signup');
let loginbtn = document.getElementById('login');
let formsg = document.querySelector('.modal.signup-login')
signupbtn.addEventListener('click', () => {
    formsg.classList.add('open');
    container.classList.remove('active');
    body.style.overflow = "hidden";
})

loginbtn.addEventListener('click', () => {
    document.querySelector('.form-message-check-login').innerHTML = '';
    formsg.classList.add('open');
    container.classList.add('active');
    body.style.overflow = "hidden";
})


// Dang nhap & Dang ky
function modalCloseForm() {
    document.querySelectorAll('.modal').forEach(element => {
        element.classList.remove("open");
    });
    body.style.overflow = "auto";
}
// Chức năng đăng ký
let signupButton = document.getElementById('signup-button');
let loginButton = document.getElementById('login-button');
signupButton.addEventListener('click', () => {
    event.preventDefault();
    let fullNameUser = document.getElementById('fullname').value;
    let phoneUser = document.getElementById('phone').value;
    let passwordUser = document.getElementById('password').value;
    let passwordConfirmation = document.getElementById('password_confirmation').value;
    let checkSignup = document.getElementById('checkbox-signup').checked;
    // Check validate
    if (fullNameUser.length == 0) {
        document.querySelector('.form-message-name').innerHTML = 'Vui lòng nhập họ vâ tên';
        document.getElementById('fullname').focus();
    } else if (fullNameUser.length < 3) {
        document.getElementById('fullname').value = '';
        document.querySelector('.form-message-name').innerHTML = 'Vui lòng nhập họ và tên lớn hơn 3 kí tự';
    } else {
        document.querySelector('.form-message-name').innerHTML = '';
    }
    if (phoneUser.length == 0) {
        document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại';
    } else if (phoneUser.length != 10) {
        document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
        document.getElementById('phone').value = '';
    } else {
        document.querySelector('.form-message-phone').innerHTML = '';
    }
    if (passwordUser.length == 0) {
        document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu';
    } else if (passwordUser.length < 6) {
        document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('password').value = '';
    } else {
        document.querySelector('.form-message-password').innerHTML = '';
    }
    if (passwordConfirmation.length == 0) {
        document.querySelector('.form-message-password-confi').innerHTML = 'Vui lòng nhập lại mật khẩu';
    } else if (passwordConfirmation !== passwordUser) {
        document.querySelector('.form-message-password-confi').innerHTML = 'Mật khẩu không khớp';
        document.getElementById('password_confirmation').value = '';
    } else {
        document.querySelector('.form-message-password-confi').innerHTML = '';
    }
    if (checkSignup != true) {
        document.querySelector('.form-message-checkbox').innerHTML = 'Vui lòng check đăng ký';
    } else {
        document.querySelector('.form-message-checkbox').innerHTML = '';
    }
    let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];
    if (fullNameUser && phoneUser && passwordUser && passwordConfirmation && checkSignup) {
        if (passwordConfirmation == passwordUser) {
            let user = {
                fullname: fullNameUser,
                phone: phoneUser,
                password: passwordUser,
                address: '',
                email: '',
                status: 1,
                join: new Date(),
                cart: [],
                cancellations: 0,
                userType: 0,
                id: accounts.length + 1
            }
            let checkloop = accounts.some(account => {
                return account.phone == user.phone;
            })
            if (!checkloop) {
                accounts.push(user);
                localStorage.setItem('accounts', JSON.stringify(accounts));
                localStorage.setItem('currentuser', JSON.stringify(user));
                showToast(`Đăng ký thành công`);
                modalCloseForm();
                kiemtradangnhap();
                updateAmount();
            } else {
                showToast(`Tài khoản đã tồn tại`);
            }
        } else {
            showToast(`Sai mật khẩu`);
        }
    }
}
)

// Dang nhap
loginButton.addEventListener('click', () => {
    event.preventDefault();
    let phonelog = document.getElementById('phone-login').value;
    let passlog = document.getElementById('password-login').value;
    let accounts = JSON.parse(localStorage.getItem('accounts'));

    if (phonelog.length == 0) {
        document.querySelector('.form-message.phonelog').innerHTML = 'Vui lòng nhập vào số điện thoại';
    } else if (phonelog.length != 10) {
        document.querySelector('.form-message.phonelog').innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
        document.getElementById('phone-login').value = '';
    } else {
        document.querySelector('.form-message.phonelog').innerHTML = '';
    }

    if (passlog.length == 0) {
        document.querySelector('.form-message-check-login').innerHTML = 'Vui lòng nhập mật khẩu';
    } else if (passlog.length < 6) {
        document.querySelector('.form-message-check-login').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('passwordlogin').value = '';
    } else {
        document.querySelector('.form-message-check-login').innerHTML = '';
    }

    if (phonelog && passlog) {
        let vitri = accounts.findIndex(item => item.phone == phonelog);
        if (vitri == -1) {
            showToast(`Tài khoản của bạn không tồn tại`)
        } else if (accounts[vitri].password == passlog) {
            if (accounts[vitri].status == 0) {
                showToast(`Tài khoản của bạn đã bị khóa`)
            } else {
                localStorage.setItem('currentuser', JSON.stringify(accounts[vitri]));
                showToast(`Đăng nhập thành công`);
                modalCloseForm();
                kiemtradangnhap();
                checkAdmin();
                updateAmount();
            }
        } else {
            showToast(`Sai mật khẩu`)
        }
    }
})
// Kiểm tra xem có tài khoản đăng nhập không ?
function kiemtradangnhap() {
    let currentUser = localStorage.getItem('currentuser');
    if (currentUser != null) {
        let user = JSON.parse(currentUser);
        document.querySelector('.auth-container').innerHTML = `<span class="text-dndk">Tài khoản</span>
            <span class="text-tk" data-id="${user.id}" >${user.fullname} <i class="fa-sharp fa-solid fa-caret-down"></span>`
        document.querySelector('.header-middle-right-menu').innerHTML = `<li><a onclick="myAccount()"><i class="fa-solid fa-circle-user"></i> Tài khoản của tôi</a></li>
        <li><a href="javascript:;" onclick="orderHistory()"><i class="fa-solid fa-basket-shopping"></i> Đơn hàng đã mua</a></li>
            <li class="border"><a class="logout"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất </a></li>`
        document.querySelector('.logout').addEventListener('click', logOut)
    }
}

function logOut() {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    user = JSON.parse(localStorage.getItem('currentuser'));
    let vitri = accounts.findIndex(item => item.phone == user.phone)
    accounts[vitri].cart.length = 0;
    for (let i = 0; i < user.cart.length; i++) {
        accounts[vitri].cart[i] = user.cart[i];
    }
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.removeItem('currentuser');
    window.location = "./index.html";
}
function checkAdmin() {
    let user = JSON.parse(localStorage.getItem('currentuser'));
    if (user && user.userType == 1) {
        let node = document.createElement(`li`);
        node.innerHTML = `<a href="./admin.html"><i class="fa-solid fa-gear"></i> Quản lý cửa hàng</a>`
        document.querySelector('.header-middle-right-menu').prepend(node);
    }
}
window.onload = kiemtradangnhap();
window.onload = checkAdmin();

function myAccount() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('home').classList.add('hide');
    document.getElementById('order-history').classList.remove('open');
    document.getElementById('account-user').classList.add('open');
    userInfo();
}




function userInfo() {
    let user = JSON.parse(localStorage.getItem('currentuser'));
    document.getElementById('infoname').value = user.fullname;
    document.getElementById('infophone').value = user.phone;
    document.getElementById('infoemail').value = user.email;
    document.getElementById('infoaddress').value = user.address;
    if (user.email == undefined) {
        infoemail.value = '';
    }
    if (user.address == undefined) {
        infoaddress.value = '';
    }
}

function orderHistory() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('account-user').classList.remove('open');
    document.getElementById('home').classList.add('hide');
    document.getElementById('order-history').classList.add('open');
    renderOrderProduct();
}

// Thay doi thong tin
function changeInformation() {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));

    // Lấy thông tin từ giao diện
    let newName = document.getElementById('infoname').value.trim();
    let newEmail = document.getElementById('infoemail').value.trim();
    let newAddress = document.getElementById('infoaddress').value.trim();

    // Cập nhật thông tin vào tài khoản hiện tại
    currentUser.fullname = newName || currentUser.fullname;
    currentUser.email = newEmail || currentUser.email;
    currentUser.address = newAddress || currentUser.address;

    // Lưu lại thông tin vào danh sách tài khoản
    const userIndex = accounts.findIndex(acc => acc.phone === currentUser.phone);
    if (userIndex !== -1) {
        accounts[userIndex] = currentUser;
        localStorage.setItem('accounts', JSON.stringify(accounts));
        localStorage.setItem('currentuser', JSON.stringify(currentUser));
        showToast('Thông tin tài khoản đã được cập nhật.');
    } else {
        showToast('Không tìm thấy tài khoản để cập nhật.');
    }
}

// Đổi mật khẩu 
function changePassword() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    let passwordCur = document.getElementById('password-cur-info');
    let passwordAfter = document.getElementById('password-after-info');
    let passwordConfirm = document.getElementById('password-comfirm-info');
    let check = true;
    if (passwordCur.value.length == 0) {
        document.querySelector('.password-cur-info-error').innerHTML = 'Vui lòng nhập mật khẩu hiện tại';
        check = false;
    } else {
        document.querySelector('.password-cur-info-error').innerHTML = '';
    }

    if (passwordAfter.value.length == 0) {
        document.querySelector('.password-after-info-error').innerHTML = 'Vui lòn nhập mật khẩu mới';
        check = false;
    } else {
        document.querySelector('.password-after-info-error').innerHTML = '';
    }

    if (passwordConfirm.value.length == 0) {
        document.querySelector('.password-after-comfirm-error').innerHTML = 'Vui lòng nhập mật khẩu xác nhận';
        check = false;
    } else {
        document.querySelector('.password-after-comfirm-error').innerHTML = '';
    }

    if (check == true) {
        if (passwordCur.value.length > 0) {
            if (passwordCur.value == currentUser.password) {
                document.querySelector('.password-cur-info-error').innerHTML = '';
                if (passwordAfter.value.length > 0) {
                    if (passwordAfter.value.length < 6) {
                        document.querySelector('.password-after-info-error').innerHTML = 'Vui lòng nhập mật khẩu mới có số  kí tự lớn hơn bằng 6';
                    } else {
                        document.querySelector('.password-after-info-error').innerHTML = '';
                        if (passwordConfirm.value.length > 0) {
                            if (passwordConfirm.value == passwordAfter.value) {
                                document.querySelector('.password-after-comfirm-error').innerHTML = '';
                                currentUser.password = passwordAfter.value;
                                localStorage.setItem('currentuser', JSON.stringify(currentUser));
                                let userChange = JSON.parse(localStorage.getItem('currentuser'));
                                let accounts = JSON.parse(localStorage.getItem('accounts'));
                                let accountChange = accounts.find(acc => {
                                    return acc.phone = userChange.phone;
                                })
                                accountChange.password = userChange.password;
                                localStorage.setItem('accounts', JSON.stringify(accounts));
                                showToast(`Đã lưu thay đổi`);
                            } else {
                                document.querySelector('.password-after-comfirm-error').innerHTML = 'Mật khẩu bạn nhập không trùng khớp';
                            }
                        } else {
                            document.querySelector('.password-after-comfirm-error').innerHTML = 'Vui lòng xác nhận mật khẩu';
                        }
                    }
                } else {
                    document.querySelector('.password-after-info-error').innerHTML = 'Vui lòng nhập mật khẩu mới';
                }
            } else {
                document.querySelector('.password-cur-info-error').innerHTML = 'Bạn đã nhập sai mật khẩu hiện tại';
            }
        }
    }
}



function renderOrderProduct() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let order = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    let orderHtml = "";
    let arrDonHang = [];
    for (let i = 0; i < order.length; i++) {
        if (order[i].khachhang === currentUser.phone) {
            arrDonHang.push(order[i]);
        }
    }
    if (arrDonHang.length == 0) {
        orderHtml = `<div class="empty-order-section"><p>Chưa có đơn hàng nào</p></div>`;
    } else {
        arrDonHang.forEach(item => {
            let productHtml = `<div class="order-history-group">`;
            let chiTietDon = getOrderDetails(item.id);
            chiTietDon.forEach(sp => {
                let infosp = getProductInfo(sp.id);
                productHtml += `<div class="order-history">
                    <div class="order-history-left">
                        <img src="${infosp.img}" alt="">
                        <div class="order-history-info">
                            <h4>${infosp.title}!</h4>
                            <p class="order-history-note"><i class="fa-light fa-pen"></i> ${sp.note}</p>
                            <p class="order-history-quantity">x${sp.soluong}</p>
                        </div>
                    </div>
                    <div class="order-history-right">
                        <div class="order-history-price">
                            <span class="order-history-current-price">${vnd(sp.price)}</span>
                        </div>                         
                    </div>
                </div>`;
            });
            let textCompl = item.trangthai == 1 ? "Đã xử lý" : "Đang xử lý";
            let classCompl = item.trangthai == 1 ? "complete" : "no-complete"
            productHtml += `<div class="order-history-control">
                <div class="order-history-status">
                    <span class="order-history-status-sp ${classCompl}">${textCompl}</span>
                    <button id="order-history-detail" onclick="detailOrder('${item.id}')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>
                </div>
                <div class="order-history-total">
                    <span class="order-history-total-desc">Tổng tiền: </span>
                    <span class="order-history-toltal-price">${vnd(item.tongtien)}</span>
                </div>
            </div>`
            productHtml += `</div>`;
            orderHtml += productHtml;
        });
    }
    document.querySelector(".order-history-section").innerHTML = orderHtml;
}





//--------------------------Chi tiet sp---------------------------------

let selectedProduct = null; // Store the currently viewed product
let detailQuantity = 1; // Default quantity for the detail modal

let currentProductId = null; // Store the current product ID for actions
// Open product detail modal
function openProductDetail(productId) {
    // Find the product using its ID
    const product = products.find(item => item.id === productId);
    if (!product) return;

    // Set the selected product
    selectedProduct = product;
    detailQuantity = 1;
    currentProductId = productId;

    // Populate modal content
    document.getElementById('product-detail-image').setAttribute("src", `${getPathImage(product.image)}`)
    document.getElementById('product-detail-name').textContent = product.name;
    document.getElementById('product-detail-price').textContent = formatCurrency(product.price);
    document.getElementById('detail-quantity').textContent = detailQuantity;
    document.getElementById('product-detail-description').textContent = product.desc;
    // Show the modal
    document.getElementById('product-detail-tab').style.display = 'flex';
}

// Close product detail modal
function closeProductDetail() {
    document.getElementById('product-detail-tab').style.display = 'none';
}

// Adjust quantity in the detail modal
function adjustDetailQuantity(action) {
    if (action === 'increase') {
        detailQuantity += 1;
    } else if (action === 'decrease' && detailQuantity > 1) {
        detailQuantity -= 1;
    }
    document.getElementById('detail-quantity').textContent = detailQuantity;
}

let selectedSize = null; // Variable to track the selected size

function selectSize(size) {
    // Update the selected size
    selectedSize = size;

    // Highlight the selected button
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => btn.classList.remove('selected')); // Remove the 'selected' class from all buttons

    // Add the 'selected' class to the clicked button
    const selectedButton = Array.from(sizeButtons).find(btn => btn.textContent === size);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
}

// Add to cart from the detail modal
function addToCartFromDetail() {
    if (!selectedSize) {
        showToast(`Hãy chọn size trước`)
        return;
    }

    const product = products.find(item => item.id === currentProductId);

    if (!product) return;

    const cartItem = {
        ...product,
        size: selectedSize, // Include the selected size
        quantity: detailQuantity,
    };

    // Check if the same product with the same size already exists in the cart
    const existingItem = cart.find(item => item.id === cartItem.id && item.size === cartItem.size);
    if (existingItem) {
        existingItem.quantity += cartItem.quantity;
    } else {
        cart.push(cartItem);
    }

    updateCartDisplay();
    updateCartBadge();
    saveCartToLocalStorage();

    // Show a toast message
    showToast(`${product.name} (${selectedSize}) đã được thêm vào giỏ hàng!`);

    // Close the popup
    closeProductDetail();
}
function getProduct(item) {
    let products = JSON.parse(localStorage.getItem('products'));
    let infoProductCart = products.find(sp => item.id == sp.id)
    let product = {
        ...infoProductCart,
        ...item
    }
    return product;
}

function getProductInfo(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(item => {
        return item.id == id;
    })
}

// Biến phân trang
let products = [];
const productsPerPage = 8;
let currentPage = 1;

// Hiển thị sản phẩm cho một trang cụ thể
function renderProductsForPage(page) {
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    const listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = ''; // Xóa nội dung cũ

    paginatedProducts.forEach(product => {
        const productHTML = `
            <div class="item" data-id="${product.id}">
                <img src="${getPathImage(product.image)}" alt="${product.name}" onclick="openProductDetail(${product.id})">
                <h2 onclick="openProductDetail(${product.id})">${product.name}</h2>
                <div class="price">${formatCurrency(product.price)}</div>
                
            </div>`;
        listProductHTML.innerHTML += productHTML;
    });
}

// Hiển thị các nút phân trang
function renderPaginationControls() {
    const paginationContainer = document.querySelector('.pagination-controls');
    paginationContainer.innerHTML = ''; // Xóa nút cũ

    const totalPages = Math.ceil(products.length / productsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-button');
        if (i === currentPage) button.classList.add('active');
        button.addEventListener('click', () => {
            currentPage = i;
            renderProductsForPage(currentPage);
            renderPaginationControls();
            scrollToSection();
        });
        paginationContainer.appendChild(button);
    }
}

// Back to top
window.onscroll = () => {
    let backtopTop = document.querySelector(".back-to-top")
    if (document.documentElement.scrollTop > 100) {
        backtopTop.classList.add("active");
    } else {
        backtopTop.classList.remove("active");
    }
}


// Auto hide header on scroll
const headerNav = document.querySelector(".header-bottom");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if (lastScrollY < window.scrollY) {
        headerNav.classList.add("hide")
    } else {
        headerNav.classList.remove("hide")
    }
    lastScrollY = window.scrollY;
})


// Tải dữ liệu từ localStorage
function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
}


document.querySelector(".checkout-btn").addEventListener("click", e => {
    if (document.querySelector(".auth-container .text-tk").getAttribute("data-id") != null) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const thisCart = cart;
        const products = JSON.parse(localStorage.getItem("products")) || [];

        products.forEach(product => {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem) {
                product.quantity += cartItem.quantity;
                product.TongTien += cartItem.quantity * product.price;
            };
        });
        localStorage.setItem("products", JSON.stringify(products));

        let total = 0;
        cart.forEach(item => {
            itemTotal = item.price * item.quantity;
            total += itemTotal;
        });
        let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
        let order = {
            id: orders.length + 1,
            id_customer: document.querySelector(".auth-container .text-tk").getAttribute("data-id"),
            cart: thisCart,
            status: 0,
            start_order: new Date(),
            tongTien: total,
        }
        //console.log(order);
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        window.location.href = 'thantoan.html';
    }
    else {
        showToast("Hãy Đăng Nhập Tài Khoản Để Mua Sản Phẩm");
    }
});

document.querySelector('.buyNow').addEventListener("click", e => {
    if (document.querySelector(".auth-container .text-tk").getAttribute("data-id") != null) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let cartFake = cart;
        localStorage.setItem("cartFake", JSON.stringify(cartFake));
        localStorage.removeItem("cart");
        let cart_buy_now = localStorage.getItem('cart_buy_now') ? JSON.parse(localStorage.getItem('cart_buy_now')) : [];


        if (!selectedSize) {
            showToast(`Hãy chọn size trước`)
            return;
        }

        const product = products.find(item => item.id === currentProductId);
        console.log(product);
        if (!product) return;

        const cartItem = {
            ...product,
            size: selectedSize, // Include the selected size
            quantity: detailQuantity,
        };

        // const products = JSON.parse(localStorage.getItem("products")) || [];

        const newProducts = products.map(e => {
            if (e.id === currentProductId) {
                return {
                    id: e.id,
                    status: e.status,
                    name: e.name,
                    price: e.price,
                    image: e.image,
                    catagory: e.catagory,
                    quantity: e.quantity + cartItem.quantity,
                    TongTien: e.TongTien + (cartItem.quantity * e.price),
                    desc: e.desc
                }
            }
            else {
                return e;
            }
        });
        localStorage.setItem("products", JSON.stringify(newProducts));

        // Check if the same product with the same size already exists in the cart
        const existingItem = cart.find(item => item.id === cartItem.id && item.size === cartItem.size);
        if (existingItem) {
            existingItem.quantity += cartItem.quantity;
        } else {
            cart_buy_now.push(cartItem);
        }
        localStorage.setItem("cart_buy_now", JSON.stringify(cart_buy_now));

        let total = 0;
        cart_buy_now.forEach(item => {
            itemTotal = item.price * item.quantity;
            total += itemTotal;
        })

        let orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
        let order = {
            id: orders.length + 1,
            id_customer: document.querySelector(".auth-container .text-tk").getAttribute("data-id"),
            cart: cart_buy_now,
            status: 0,
            start_order: new Date(),
            tongTien: total,
        }
        //console.log(order);
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        window.location.href = "thantoan.html";
    }
    else {
        showToast("Hãy Đăng Nhập Tài Khoản Để Mua Sản Phẩm");
    }

});


// Khởi tạo trang web
function initApp() {
    loadProductsFromLocalStorage();
    renderProductsForPage(currentPage);
    renderPaginationControls();
    initializeCart()
}

// Gọi hàm khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', initApp);

