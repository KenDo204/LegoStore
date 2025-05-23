const searchInput = document.querySelector('.search');
const categories_menu = document.querySelector('.categories-menu');
const cart = document.querySelector('.cart');
const header_bottom = document.querySelector('.header-bottom');
const menu_bar = document.querySelector('.menu-bar');
const menu_close = document.querySelector('.menu-close');
const menu_mobile_nav = document.querySelector('.menu-mobile-nav');
const back_to_top = document.querySelector('.back-to-top');
//generateSearchKey
const messages = [
  'Lego City',
  'Lego F1',
  'Lego Star Wars',
  'Lego Speed Champions',
];

let currentMessageIndex = 0;
let currentCharIndex = 0;
const typingSpeed = 100;
let placeholder = '';
let listProducts = [];
let listCategories = [];
let listBlogs = [];
function initApp() {
  //Fetch dữ liệu từ file json
  const request1 = fetch('./data/Products.json').then((response) =>
    response.json()
  );
  const request2 = fetch('./data/Categories.json').then((response) =>
    response.json()
  );
  // const request3 = fetch('./data/Blogs.json').then((response) =>
  //   response.json()
  // );
  Promise.all([request1, request2])
    .then(([data1, data2]) => {
      listProducts = data1;
      listCategories = data2;
      generateSearchKey(); //Tạo animation placeholder
      generateCategories(listCategories); // render list danh mục sản phẩm
      generatefeaturedCategoriesList(listCategories); // render danh mục sản phẩm nổi bật
      generateProductList(listProducts); //render list sản phẩm
      generateCollections(listProducts); // render bộ sưu tập sản phẩm
      // generateBlogs(listBlogs); //render blogs
      toastMessage();
      loadCartToHTML();
    })
    .catch((error) => {
      console.error(error);
    });
}
//Xu ly header top fixed và back to top
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 150) {
    header_bottom.classList.add('sticky');
    back_to_top.classList.add('active');
  } else {
    header_bottom.classList.remove('sticky');
    back_to_top.classList.remove('active');
  }
});
$('.back-to-top').click(function () {
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    800
  );
  return false;
});
//Dong mo danh sach san pham
categories_menu.addEventListener('click', function () {
  const categories_content = document.querySelector('.categories-content');
  categories_content.classList.toggle('show');
});

//Dong mo gio hang
cart.addEventListener('click', function () {
  const mini_cart = document.querySelector('.mini-cart');
  mini_cart.classList.toggle('show');
});

//menu-mobile toggle
menu_bar.addEventListener('click', function () {
  menu_bar.classList.toggle('hidden');
  menu_close.classList.toggle('hidden');
  menu_mobile_nav.classList.toggle('show');
});
menu_close.addEventListener('click', function () {
  menu_bar.classList.toggle('hidden');
  menu_close.classList.toggle('hidden');
  menu_mobile_nav.classList.toggle('show');
});

/**
 * Hàm này dùng để format giá từ number -> tiền tệ VN
 * @param number
 * @returns formatted_number
 */
function formatVND(number) {
  let formatted_number = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
    .format(number)
    .replaceAll('.', ',');
  return formatted_number;
}

function numberValidation(n) {
  if (isNaN(n)) {
    return false;
  } else {
    return true;
  }
}
/**
 * Hàm này dùng để show toast message mỗi khi thêm sp vào giỏ
 */
function toastMessage() {
  const btn_carts = document.querySelectorAll('.btn-cart');
  btn_carts.forEach((btn) => {
    btn.addEventListener('click', () => {
      Toastify({
        //Gọi thư viện
        text: 'Đã thêm vào giỏ hàng',
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
        duration: 3000,
      }).showToast();
    });
  });
}
/**
 * Tạo animation placeholder cho input tìm kiếm
 */
function generateSearchKey() {
  if (currentMessageIndex === messages.length) currentMessageIndex = 0; //Khi duyệt hết mảng thì quay lại từ đầu

  const message = messages[currentMessageIndex]; //message hiện tại

  if (currentCharIndex < message.length) {
    placeholder += message.charAt(currentCharIndex);
    searchInput.setAttribute('placeholder', placeholder); //generate từng kí tự
    currentCharIndex++; //kí tự tiếp theo
    setTimeout(generateSearchKey, typingSpeed); //Gọi đệ quy để generate kí tự tiếp theo
  } else {
    // Sau mỗi message generate xong
    setTimeout(() => {
      currentCharIndex = 0; //đặt lại kí tự đầu tiên
      currentMessageIndex++; //message tiếp theo
      placeholder = ''; //đặt lại placeholder
      searchInput.setAttribute('placeholder', placeholder);
      generateSearchKey(); //Gọi đệ quy
    }, 1000);
  }
}

function generateCategories(listCategories) {
  const categories_list = document.querySelector('.categories-list');
  listCategories.forEach((item) => {
    categories_list.innerHTML += `
    <li class="categories-item">
    <a href="store.html?idCategory=${item.id}"> ${item.name} </a>
   </li>
    `;
  });
}

/**
 * Hàm này để lấy tổng sản phẩm trong một danh mục sản phẩm
 * @param id
 * @returns sum
 */
function getCountProductsOfCategories(id) {
  let sum = 0;
  listProducts.forEach((p) => {
    if (p.category == id) {
      sum++;
    }
  });
  return sum;
}

/**
 * Hàm này dùng để render danh mục sản phẩm nổi bật
 * @param listCategories
 */
function generatefeaturedCategoriesList(listCategories) {
  const featured_categories_list = document.querySelector(
    '.featured-categories-list'
  );
  if (featured_categories_list) {
    listCategories.forEach((item) => {
      featured_categories_list.innerHTML += `
        <div class="category-item">
        <div class="category-item-info">
          <h4 class="category-item-name">
            <a href="store.html?idCategory=${item.id}"> ${item.name} </a>
          </h4>
          <div class="total-items">${getCountProductsOfCategories(
            item.id
          )} sản phẩm</div>
          <a href="" class="shop-btn">+ Xem thêm</a>
        </div>
        <div class="category-item-thumb">
          <a href="store.html?idCategory=${item.id}">
            <img
              src="${item.img}"
              alt="${item.name}"
            />
          </a>
        </div>
      </div>`;
    });
  }
}
/**
 * Hàm này dùng để render list sản phẩm
 * @param listProducts
 */
function generateProductList(listProducts) {
  const productList = document.querySelector(
    '.product-list .owl-stage-outer .owl-stage'
  );
  if (productList) {
    const listShow = listProducts.slice(0, 5);
    listShow.forEach((item) => {
      productList.innerHTML += `<div class="owl-item">
      <div class="product-item">
      <div class="product-thumb">
      <a href="product-detail.html?id=${item.id}">
      <img
      src="${item.img}"
      alt="product-name"
      />
      </a>
      </div>
      <div class="product-caption">
      <div class="manufacture-product">
      </div>
      <div class="product-name">
      <a href="product-detail.html?id=${item.id}">
      <h4>
      ${item.name}
      </h4>
      </a>
      </div>
      <div class="price-box">
            <span class="regular-price ${
              item.price_old ? 'sale' : ''
            }">${formatVND(item.price)}</span>
            <span class="old-price">${
              item.price_old ? formatVND(item.price_old) : ''
            }</span>
            </div>
            <button class="btn-cart" onclick="addToCart(${
              item.id
            })" type="button">
            Thêm vào giỏ
          </button>
          </div>
          </div>
    </div>`;
    });
    //Sử dụng thư viên owl-carousel
    $(document.querySelector('.product-list')).owlCarousel({
      loop: true,
      margin: 30,
      singleItem: true,
      items: 4,
      dots: false,
      nav: true,
      navText: [
        '<i class="bi bi-arrow-left"></i>',
        '<i class="bi bi-arrow-right"></i>',
      ],
      navContainer: '.box-title .custom-nav-best-seller',
      responsive: {
        0: {
          items: 2,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    });
  }
}

/**
 * Hàm này dùng để render list bộ sưu tập sản phẩm
 * @param listProducts
 */
function generateCollections(listProducts) {
  const collections = document.querySelector('.collections-list');
  if (collections) {
    const listShow = listProducts.slice(0, 10);
    listShow.forEach((item) => {
      collections.innerHTML += `<li class="collections-item">
      <div class="product-item">
        <div class="product-thumb">
          <a href="product-detail.html?id=${item.id}">
            <img
              src="${item.img}"
              alt="product-name"
            />
          </a>
        </div>
        <div class="product-caption">
          <div class="manufacture-product">
          </div>
          <div class="product-name">
            <a href="product-detail.html?id=${item.id}">
              <h4>
                ${item.name}
              </h4>
            </a>
          </div>
          <div class="price-box">
            <span class="regular-price ${
              item.price_old ? 'sale' : ''
            }">${formatVND(item.price)}</span>
            <span class="old-price">${
              item.price_old ? formatVND(item.price_old) : ''
            }</span>
          </div>
          <button class="btn-cart" onclick="addToCart(${
            item.id
          })" type="button">
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </li>`;
    });
  }
}
/**
 * Hàm này dùng để render blogs
 * @param listBlogs 
 */
// function generateBlogs(listBlogs) {
//   const blog_list = document.querySelector('.blog-list');
//   const blog_main = document.querySelector('.blog-main');
//   let blogMain = listBlogs.slice(0, 1)[0]; //Lấy blog mới nhất làm blog chính
//   let blogList = listBlogs.slice(1, 5);// Lấy 4 blog tiếp theo để show ra giao diện
//   //render HTML
//   if (blog_list && blog_main) {
//     blog_main.innerHTML = `
//    <div class="blog-image">
//    <a href="blog-detail.html?id=${blogMain.id}">
//      <img src="${blogMain.img}" alt="${blogMain.title}" />
//    </a>
//  </div>
//  <div class="blog-title">
//    <h4>
//      <a href="blog-detail.html?id=${blogMain.id}"> ${blogMain.title}</a>
//    </h4>
//  </div>
//  <div class="blog-date">${blogMain.date}</div>
//    `;
//     blogList.forEach((item) => {
//       blog_list.innerHTML += `
//      <li class="blog-item">
//      <div class="blog-item-image">
//        <a href="blog-detail.html?id=${item.id}">
//          <img src="${item.img}" alt="${item.title}" />
//        </a>
//      </div>
//      <div class="blog-item-detail">
//        <div class="blog-item-title">
//          <a href="blog-detail.html?id=${item.id}"> ${item.title}</a>
//        </div>
//        <div class="blog-item-date">${item.date}</div>
//      </div>
//    </li>
//      `;
//     });
//   }
// }

function getProductById(id) {
  return listProducts.find((item) => item.id == id);
}
/**
 * Hàm này để thêm sản phẩm vào giỏ hàng
 * @param productId
 */
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')); //Láy sản phẩm từ localStorage
  positionInCart = cart.findIndex((item) => item.productId == productId); //Tìm vị trí của sản phẩm trong giỏ hàng
  const input_quantity = document.getElementById('quantity');
  const quantity = input_quantity ? Number(input_quantity.value) : 1; //Nếu có input số lượng sp thì lấy số lượng sản phẩm của input còn không thì số lương sp = 1
  if (cart.length <= 0) {
    //Nếu giỏ hàng chưa có sản phẩm nào thì thêm sp vào cart
    cart.push({
      productId: productId,
      quantity: quantity,
    });
  } else if (positionInCart < 0) {
    //Nếu không tìm tháy sp nào trùng với sp được thêm thì thêm sp vào cart
    cart.push({
      productId: productId,
      quantity: quantity,
    });
  } else {
    cart[positionInCart].quantity += quantity; // Tìm thấy sp trong giỏ hàng thì + quanity
  }
  localStorage.setItem('cart', JSON.stringify(cart)); //Lưu cart vào localStorage
  loadCartToHTML(); //Render lại giao diện
}

function deleteCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart'));
  cart = cart.filter((item) => item.productId != id);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartToHTML();
}
/**
 * Hàm này dùng để render ra giao diện giỏ hàng
 */
function loadCartToHTML() {
  if (!localStorage.getItem('cart')) {
    //Khởi tạo cart nếu chưa có
    localStorage.setItem('cart', '[]');
  }
  let cart = JSON.parse(localStorage.getItem('cart'));
  const cart_count = document.querySelector('.cart-count');
  //Tổng số sp trong giỏ hàng
  cart_count.textContent = cart.reduce((prev, current) => {
    return prev + current.quantity;
  }, 0);
  const cart_list = document.querySelector('.cart-list');
  const total_price = document.querySelector('.total-price');
  let sum = 0;
  cart_list.innerHTML = '';
  if (cart.length <= 0) {
    //Chưa thêm vào giỏ hàng thì xuât hiển thị
    cart_list.textContent = 'Bạn chưa thêm sản phẩm';
  }
  //Render HTML giỏ hàng
  cart.forEach((item) => {
    let product = getProductById(item.productId);
    let newHTML = `<li class="cart-item">
    <div class="cart-image">
      <a href="product-detail.html?id=${product.id}">
        <img
          src="${product.img}"
        />
      </a>
    </div>
    <div class="cart-info">
      <h4><a href="product-detail.html?id=${product.id}">${
      product.name
    } </a></h4>
      <span
        >${item.quantity} x
        <span>${formatVND(product.price)}</span>
      </span>
    </div>
    <div class="del-icon" onclick="deleteCart(${item.productId})">
      <i class="bi bi-x-circle"></i>
    </div>
  </li>`;
    cart_list.innerHTML += newHTML;
    sum += item.quantity * product.price;
  });
  total_price.textContent = formatVND(sum);
}

initApp();

const video = document.getElementById("loading-video");
      video.addEventListener("ended", () => {
        document.getElementById("loading-screen").classList.add("fade-out");
        setTimeout(() => {
          document.getElementById("loading-screen").style.display = "none";
          document.getElementById("main-content").style.display = "block";
        }, 1000);
      });