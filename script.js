// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Initialize all components
  initializeCarousel()
  initializeSearch()
  initializeCategoryScroll()
  initializeProductCards()
  initializeFilters()
  initializePagination()
  initializeNotifications()
  initializeBenefits()
  initializeCart()
}

// Carousel Functionality
let currentSlide = 0
const slides = document.querySelectorAll(".slide")
const dots = document.querySelectorAll(".dot")

function initializeCarousel() {
  if (slides.length === 0) return

  function showSlide(index) {
    const slideContainer = document.querySelector(".slides")
    currentSlide = index

    // Geser slide
    slideContainer.style.transform = `translateX(-${index * 100}%)`

    // Update dot aktif
    dots.forEach((dot) => dot.classList.remove("active"))
    if (dots[index]) dots[index].classList.add("active")
  }

  // Auto geser tiap 4 detik
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length
    showSlide(currentSlide)
  }, 4000)

  // Jika dot diklik
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index)
    })
  })

  // Tampilkan slide pertama saat halaman dimuat
  showSlide(0)
}

// Search Functionality
function initializeSearch() {
  const searchInput = document.querySelector(".search-input")
  const searchBtn = document.querySelector(".search-btn")

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim()
      if (searchTerm) {
        performSearch(searchTerm)
      }
    })
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        const searchTerm = this.value.trim()
        if (searchTerm) {
          performSearch(searchTerm)
        }
      }
    })
  }
}

function performSearch(searchTerm) {
  console.log("Searching for:", searchTerm)
  showNotification(`Mencari "${searchTerm}"...`, "info")

  // Simulate search delay
  setTimeout(() => {
    showNotification(`Hasil pencarian untuk "${searchTerm}" ditemukan!`, "success")
  }, 1000)
}

// Category Scroll Functionality
// Category Scroll Functionality
function initializeCategoryScroll() {
  const categoryScroll = document.querySelector(".kategori-container");
  const leftBtn = document.querySelector(".scroll-btn.left");
  const rightBtn = document.querySelector(".scroll-btn.right");

  if (!categoryScroll || !leftBtn || !rightBtn) return;

  const getScrollAmount = () => {
    return categoryScroll.offsetWidth * 0.8;
  };

  // --- LOGIKA PERBAIKAN DIMULAI DI SINI ---
  const updateScrollButtons = () => {
    // Cek apakah kontainer bisa di-scroll
    const isScrollable = categoryScroll.scrollWidth > categoryScroll.offsetWidth;
    
    if (!isScrollable) {
      // Sembunyikan kedua tombol jika item tidak cukup banyak untuk di-scroll
      leftBtn.style.display = 'none';
      rightBtn.style.display = 'none';
      return;
    }

    leftBtn.style.display = 'flex';
    rightBtn.style.display = 'flex';

    // Nonaktifkan tombol kiri jika sudah mentok di kiri
    const isAtStart = categoryScroll.scrollLeft <= 0;
    leftBtn.disabled = isAtStart;
    leftBtn.style.opacity = isAtStart ? "0.5" : "1";
    leftBtn.style.cursor = isAtStart ? "not-allowed" : "pointer";

    // Nonaktifkan tombol kanan jika sudah mentok di kanan
    // Math.ceil digunakan untuk mengatasi nilai desimal
    const isAtEnd = Math.ceil(categoryScroll.scrollLeft + categoryScroll.offsetWidth) >= categoryScroll.scrollWidth;
    rightBtn.disabled = isAtEnd;
    rightBtn.style.opacity = isAtEnd ? "0.5" : "1";
    rightBtn.style.cursor = isAtEnd ? "not-allowed" : "pointer";
  };
  // --- LOGIKA PERBAIKAN SELESAI DI SINI ---


  // Panggil fungsi sekali saat halaman dimuat dan setiap kali ukuran window berubah
  updateScrollButtons();
  window.addEventListener("resize", updateScrollButtons);

  // Panggil fungsi setiap kali user melakukan scroll di kontainer
  categoryScroll.addEventListener("scroll", updateScrollButtons);

  // Fungsi klik tombol kiri
  leftBtn.addEventListener("click", () => {
    if (leftBtn.disabled) return;
    const scrollAmount = getScrollAmount();
    categoryScroll.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  // Fungsi klik tombol kanan
  rightBtn.addEventListener("click", () => {
    if (rightBtn.disabled) return;
    const scrollAmount = getScrollAmount();
    categoryScroll.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });
  
  // Sisa kode untuk touch scroll tidak perlu diubah...
  let isScrolling = false;
  let startX = 0;
  let scrollLeft = 0;

  categoryScroll.addEventListener("touchstart", (e) => {
    isScrolling = true;
    startX = e.touches[0].pageX - categoryScroll.offsetLeft;
    scrollLeft = categoryScroll.scrollLeft;
  });

  categoryScroll.addEventListener("touchmove", (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.touches[0].pageX - categoryScroll.offsetLeft;
    const walk = (x - startX) * 2;
    categoryScroll.scrollLeft = scrollLeft - walk;
    updateScrollButtons();
  });

  categoryScroll.addEventListener("touchend", () => {
    isScrolling = false;
  });
}

// Global function for scroll buttons
function scrollKategori(direction) {
  const container = document.getElementById("kategori-container")
  const scrollAmount = 200

  if (direction === "left") {
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    })
  } else {
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }
}

// Product Cards Functionality
function initializeProductCards() {
  const buyButtons = document.querySelectorAll(".buy-button")
  const productCards = document.querySelectorAll(".product-card")

  buyButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const productCard = this.closest(".product-card")
      const productName = productCard.querySelector(".product-name").textContent

      // Add to cart animation
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)

      // Update cart count
      updateCartCount()
      showNotification(`${productName} ditambahkan ke keranjang!`, "success")
    })
  })

  // Product card hover effects
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-4px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })
}

// Filter Functionality
function initializeFilters() {
  const sortSelect = document.querySelector(".sort-select")
  const viewButtons = document.querySelectorAll(".view-btn")
  const applyButton = document.querySelector(".apply-btn")
  const checkboxes = document.querySelectorAll('input[type="checkbox"]')

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const sortValue = this.value
      showNotification(`Mengurutkan berdasarkan: ${this.options[this.selectedIndex].text}`, "info")
      sortProducts(sortValue)
    })
  }

  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      viewButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      const isGridView = this.querySelector(".fa-th")
      toggleProductView(isGridView)
    })
  })

  if (applyButton) {
    applyButton.addEventListener("click", () => {
      const minPrice = document.querySelector('.price-input[placeholder="Min"]')?.value
      const maxPrice = document.querySelector('.price-input[placeholder="Max"]')?.value

      applyPriceFilter(minPrice, maxPrice)
      showNotification("Filter harga diterapkan!", "success")
    })
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const filterSection = this.closest(".filter-section")
      if (filterSection) {
        const filterType = filterSection.querySelector("h3").textContent
        const isChecked = this.checked

        if (isChecked) {
          showNotification(`Filter ${filterType} diterapkan`, "info")
        }
      }
    })
  })
}

function sortProducts(sortValue) {
  const productsGrid = document.querySelector(".product-grid")
  if (!productsGrid) return

  const products = Array.from(productsGrid.children)

  products.sort((a, b) => {
    switch (sortValue) {
      case "price-low":
        return getPriceValue(a) - getPriceValue(b)
      case "price-high":
        return getPriceValue(b) - getPriceValue(a)
      case "rating":
        return getRatingValue(b) - getRatingValue(a)
      case "newest":
        return hasNewBadge(b) - hasNewBadge(a)
      default:
        return 0
    }
  })

  products.forEach((product) => productsGrid.appendChild(product))
}

function getPriceValue(productCard) {
  const priceElement = productCard.querySelector(".price")
  if (!priceElement) return 0
  const priceText = priceElement.textContent
  return Number.parseInt(priceText.replace(/[^\d]/g, ""))
}

function getRatingValue(productCard) {
  const stars = productCard.querySelectorAll(".stars .fas.fa-star")
  return stars.length
}

function hasNewBadge(productCard) {
  return productCard.querySelector(".product-ribbon") ? 1 : 0
}

function toggleProductView(isGridView) {
  const productsGrid = document.querySelector(".product-grid")
  if (!productsGrid) return

  if (isGridView) {
    productsGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))"
  } else {
    productsGrid.style.gridTemplateColumns = "1fr"
  }
}

function applyPriceFilter(minPrice, maxPrice) {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const price = getPriceValue(card)
    const min = minPrice ? Number.parseInt(minPrice) : 0
    const max = maxPrice ? Number.parseInt(maxPrice) : Number.POSITIVE_INFINITY

    if (price >= min && price <= max) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// Pagination Functionality
function initializePagination() {
  const pageButtons = document.querySelectorAll(".page-btn")

  pageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (this.disabled) return

      const pageNumber = this.textContent

      if (pageNumber === "Sebelumnya" || pageNumber === "Selanjutnya") {
        handlePageNavigation(pageNumber)
      } else if (!isNaN(pageNumber)) {
        setActivePage(Number.parseInt(pageNumber))
      }
    })
  })
}

function handlePageNavigation(direction) {
  const activeButton = document.querySelector(".page-btn.active")
  if (!activeButton) return

  const currentPage = Number.parseInt(activeButton.textContent)

  if (direction === "Selanjutnya") {
    setActivePage(currentPage + 1)
  } else if (direction === "Sebelumnya" && currentPage > 1) {
    setActivePage(currentPage - 1)
  }
}

function setActivePage(pageNumber) {
  const pageButtons = document.querySelectorAll(".page-btn")

  pageButtons.forEach((button) => {
    button.classList.remove("active")
    if (button.textContent == pageNumber) {
      button.classList.add("active")
    }
  })

  // Simulate page loading
  showNotification(`Memuat halaman ${pageNumber}...`, "info")

  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Benefits Functionality
function initializeBenefits() {
  const benefitItems = document.querySelectorAll(".benefit-item")

  // Add click event listeners to each benefit item
  benefitItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Toggle active class
      const isActive = this.classList.contains("active")

      // Remove active class from all items
      benefitItems.forEach((el) => el.classList.remove("active"))

      // If the clicked item wasn't active before, make it active
      if (!isActive) {
        this.classList.add("active")
        showBenefitDetails(this.getAttribute("data-benefit"))
      }
    })
  })

  // Function to show benefit details
  function showBenefitDetails(benefitType) {
    console.log(`Showing details for: ${benefitType}`)

    const benefitInfo = {
      shipping: "Nikmati gratis ongkir untuk semua pembelian tanpa minimum transaksi!",
      delivery: "Pesanan Anda akan diantar di hari yang sama jika order sebelum jam 2 siang.",
      points: "Kumpulkan poin dari setiap transaksi dan tukarkan dengan hadiah menarik!",
      products: "Temukan lebih dari 10,000 produk berkualitas untuk kebutuhan sehari-hari Anda.",
    }

    showNotification(benefitInfo[benefitType] || "Informasi benefit tidak tersedia", "info")
  }

  // Add animation to CTA button
  const ctaButton = document.querySelector(".cta-button")

  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      // Add pulse animation
      this.style.animation = "pulse 0.5s"

      // Remove animation after it completes
      setTimeout(() => {
        this.style.animation = ""
        showNotification("Selamat berbelanja di Alfagift!", "success")
      }, 500)
    })
  }

  // Add scroll animation for benefits
  function animateBenefits() {
    benefitItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "0"
        item.style.transform = "translateY(20px)"

        // Trigger reflow
        void item.offsetWidth

        // Add transition
        item.style.transition = "opacity 0.5s ease, transform 0.5s ease"

        // Show item
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
      }, index * 200)
    })
  }

  // Run animation on page load
  if (benefitItems.length > 0) {
    animateBenefits()
  }
}

// Cart Functionality
let cartCount = 0

function initializeCart() {
  const cartButton = document.querySelector(".cart-btn")

  if (cartButton) {
    cartButton.addEventListener("click", () => {
      showNotification(`Keranjang memiliki ${cartCount} item`, "info")
    })
  }
}

function updateCartCount() {
  cartCount++
  updateCartBadge(cartCount)
}

function updateCartBadge(count) {
  const cartBadge = document.querySelector(".cart-badge")

  if (cartBadge) {
    cartBadge.textContent = count
    cartBadge.style.display = count > 0 ? "flex" : "none"

    // Add bounce animation
    cartBadge.style.animation = "bounce 0.3s ease"
    setTimeout(() => {
      cartBadge.style.animation = ""
    }, 300)
  }
}

// Notification System
function initializeNotifications() {
  // Create notification container if it doesn't exist
  if (!document.querySelector(".notification-container")) {
    const container = document.createElement("div")
    container.className = "notification-container"
    container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `
    document.body.appendChild(container)
  }

  // Initialize red notification banner
  initializeRedNotification()
}

function initializeRedNotification() {
  // Show notification on page load
  setTimeout(() => {
    showRedNotification()
  }, 1000)

  // Click notification to show different messages
  const notificationBanner = document.getElementById("notificationBanner")
  if (notificationBanner) {
    notificationBanner.addEventListener("click", function (e) {
      if (e.target.classList.contains("notification-close") || e.target.closest(".notification-close")) {
        return // Don't trigger if close button is clicked
      }

      const messages = [
        {
          icon: "fas fa-exclamation-triangle",
          text: "<strong>Peringatan!</strong> Stok terbatas untuk produk pilihan",
        },
        { icon: "fas fa-fire", text: "<strong>Hot Deal!</strong> Diskon hingga 50% hari ini saja" },
        { icon: "fas fa-bell", text: "<strong>Notifikasi!</strong> Produk baru telah tersedia" },
        { icon: "fas fa-tag", text: "<strong>Promo Spesial!</strong> Gratis ongkir untuk semua produk" },
      ]

      const randomMessage = messages[Math.floor(Math.random() * messages.length)]

      // Update notification content
      this.querySelector(".notification-icon i").className = randomMessage.icon
      this.querySelector(".notification-text").innerHTML = randomMessage.text

      // Add pulse effect
      this.style.animation = "pulse 0.3s ease-in-out"
      setTimeout(() => {
        this.style.animation = ""
      }, 300)
    })
  }
}

function showRedNotification() {
  const notification = document.getElementById("notificationBanner")
  if (notification) {
    notification.classList.add("show")

    // Auto hide after 8 seconds
    setTimeout(() => {
      hideRedNotification()
    }, 8000)
  }
}

function hideRedNotification() {
  const notification = document.getElementById("notificationBanner")
  if (notification) {
    notification.classList.remove("show")
  }
}

// Global function for hiding notification (called from HTML)
function hideNotification() {
  hideRedNotification()
}

function showNotification(message, type = "info") {
  const container = document.querySelector(".notification-container")
  const notification = document.createElement("div")

  const colors = {
    success: "#28a745",
    error: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
  }

  notification.className = "notification"
  notification.style.cssText = `
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        pointer-events: auto;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
    `

  notification.textContent = message
  container.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 10)

  // Auto remove
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)

  // Click to dismiss
  notification.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  })
}

// Handle window resize
window.addEventListener("resize", () => {
  // Adjust layout for mobile/desktop
  const isMobile = window.innerWidth <= 768

  if (isMobile) {
    // Mobile-specific adjustments
    const categoryLayout = document.querySelector(".category-layout")
    if (categoryLayout) {
      categoryLayout.style.gridTemplateColumns = "1fr"
    }
  } else {
    // Desktop-specific adjustments
    const categoryLayout = document.querySelector(".category-layout")
    if (categoryLayout) {
      categoryLayout.style.gridTemplateColumns = "250px 1fr"
    }
  }
})

// Performance optimization: Debounce function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .notification-container {
            left: 10px;
            right: 10px;
            top: 10px;
        }
        
        .notification {
            max-width: none;
        }
    }
`
document.head.appendChild(style)
