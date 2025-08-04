// DOM Elements
const themeToggle = document.getElementById("themeToggle")
const navLinks = document.querySelectorAll(".nav-link")
const sections = document.querySelectorAll(".section")
const skillBars = document.querySelectorAll(".skill-progress")
const contactForm = document.getElementById("contactForm")
const profileImg = document.getElementById("profileImg")

// Theme Toggle Functionality
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)

  // Update theme toggle icon
  const icon = themeToggle.querySelector("i")
  icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon"
}

// Initialize theme from localStorage
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)

  const icon = themeToggle.querySelector("i")
  icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon"
}

// Navigation functionality
function showSection(targetId) {
  // Hide all sections
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  // Remove active class from all nav links
  navLinks.forEach((link) => {
    link.classList.remove("active")
  })

  // Show target section
  const targetSection = document.getElementById(targetId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Add active class to clicked nav link
  const activeLink = document.querySelector(`[href="#${targetId}"]`)
  if (activeLink) {
    activeLink.classList.add("active")
  }

  // Animate skill bars if skills section is shown
  if (targetId === "skills") {
    animateSkillBars()
  }

  // Initialize photo animations if photos section is shown
  if (targetId === "photos") {
    setTimeout(() => {
      addPhotoAnimations()
    }, 100)
  }
}

// Animate skill bars
function animateSkillBars() {
  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width")
    setTimeout(() => {
      bar.style.width = width + "%"
    }, 200)
  })
}

// Contact form handling
function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  // Simple form validation
  if (!name || !email || !message) {
    alert("Please fill in all fields.")
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.")
    return
  }

  // Simulate form submission
  const submitBtn = contactForm.querySelector(".submit-btn")
  const originalText = submitBtn.textContent

  submitBtn.textContent = "Sending..."
  submitBtn.disabled = true

  setTimeout(() => {
    alert(`Thank you, ${name}! Your message has been sent successfully.`)
    contactForm.reset()
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 2000)
}

// Profile image hover effect
function addProfileImageEffects() {
  profileImg.addEventListener("mouseenter", () => {
    profileImg.style.transform = "scale(1.05) rotate(5deg)"
  })

  profileImg.addEventListener("mouseleave", () => {
    profileImg.style.transform = "scale(1) rotate(0deg)"
  })
}

// Smooth scrolling for navigation
function addSmoothScrolling() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      showSection(targetId)
    })
  })
}

// Add typing effect to the title
function addTypingEffect() {
  const titleElement = document.querySelector(".title")
  const originalText = titleElement.textContent
  titleElement.textContent = ""

  let i = 0
  const typeWriter = () => {
    if (i < originalText.length) {
      titleElement.textContent += originalText.charAt(i)
      i++
      setTimeout(typeWriter, 100)
    }
  }

  setTimeout(typeWriter, 1000)
}

// Add floating animation to project cards
function addFloatingAnimation() {
  const projectCards = document.querySelectorAll(".project-card")

  projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-15px) scale(1.02)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)"
    })
  })
}

// Add parallax effect to sections
function addParallaxEffect() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".section")

    parallaxElements.forEach((element, index) => {
      const speed = 0.5
      const yPos = -(scrolled * speed)
      element.style.transform = `translateY(${yPos}px)`
    })
  })
}

// Photo Gallery Functionality
let currentPhotoIndex = 0
let currentPhotos = []

// Photo filtering
function initializePhotoGallery() {
  const categoryBtns = document.querySelectorAll(".category-btn")
  const photoItems = document.querySelectorAll(".photo-item")
  const photoModal = document.getElementById("photoModal")
  const modalImage = document.getElementById("modalImage")
  const modalTitle = document.getElementById("modalTitle")
  const modalDescription = document.getElementById("modalDescription")
  const modalClose = document.getElementById("modalClose")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")

  // Initialize all photos as visible
  currentPhotos = Array.from(photoItems)

  // Add loaded class to images when they load
  photoItems.forEach((item) => {
    const img = item.querySelector("img")
    if (img.complete) {
      img.classList.add("loaded")
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded")
      })
    }
  })

  // Category filtering
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category")

      // Update active button
      categoryBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Filter photos
      filterPhotos(category)
    })
  })

  // Photo click handlers
  photoItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openPhotoModal(index)
    })
  })

  // Modal controls
  modalClose.addEventListener("click", closePhotoModal)
  prevBtn.addEventListener("click", showPreviousPhoto)
  nextBtn.addEventListener("click", showNextPhoto)

  // Close modal on background click
  photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) {
      closePhotoModal()
    }
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (photoModal.style.display === "block") {
      switch (e.key) {
        case "Escape":
          closePhotoModal()
          break
        case "ArrowLeft":
          showPreviousPhoto()
          break
        case "ArrowRight":
          showNextPhoto()
          break
      }
    }
  })
}

function filterPhotos(category) {
  const photoItems = document.querySelectorAll(".photo-item")

  photoItems.forEach((item, index) => {
    const itemCategory = item.getAttribute("data-category")
    const shouldShow = category === "all" || itemCategory === category

    if (shouldShow) {
      item.classList.remove("hidden")
      item.classList.add("visible")
    } else {
      item.classList.add("hidden")
      item.classList.remove("visible")
    }
  })

  // Update current photos array for modal navigation
  currentPhotos = Array.from(photoItems).filter(
    (item) => category === "all" || item.getAttribute("data-category") === category,
  )
}

function openPhotoModal(index) {
  const photoModal = document.getElementById("photoModal")
  const modalImage = document.getElementById("modalImage")
  const modalTitle = document.getElementById("modalTitle")
  const modalDescription = document.getElementById("modalDescription")

  // Find the actual index in current photos array
  const allPhotos = document.querySelectorAll(".photo-item")
  const clickedPhoto = allPhotos[index]
  currentPhotoIndex = currentPhotos.indexOf(clickedPhoto)

  if (currentPhotoIndex === -1) return

  updateModalContent()
  photoModal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function closePhotoModal() {
  const photoModal = document.getElementById("photoModal")
  photoModal.style.display = "none"
  document.body.style.overflow = "auto"
}

function showPreviousPhoto() {
  if (currentPhotoIndex > 0) {
    currentPhotoIndex--
    updateModalContent()
  }
}

function showNextPhoto() {
  if (currentPhotoIndex < currentPhotos.length - 1) {
    currentPhotoIndex++
    updateModalContent()
  }
}

function updateModalContent() {
  const modalImage = document.getElementById("modalImage")
  const modalTitle = document.getElementById("modalTitle")
  const modalDescription = document.getElementById("modalDescription")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")

  const currentPhoto = currentPhotos[currentPhotoIndex]
  const img = currentPhoto.querySelector("img")
  const overlay = currentPhoto.querySelector(".photo-overlay")
  const title = overlay.querySelector("h3").textContent
  const description = overlay.querySelector("p").textContent

  modalImage.src = img.src
  modalImage.alt = img.alt
  modalTitle.textContent = title
  modalDescription.textContent = description

  // Update navigation buttons
  prevBtn.disabled = currentPhotoIndex === 0
  nextBtn.disabled = currentPhotoIndex === currentPhotos.length - 1
}

// Add lazy loading for photos
function addLazyLoading() {
  const photoImages = document.querySelectorAll(".photo-item img")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.src // Trigger loading
        img.classList.add("loaded")
        observer.unobserve(img)
      }
    })
  })

  photoImages.forEach((img) => {
    imageObserver.observe(img)
  })
}

// Add photo gallery animations
function addPhotoAnimations() {
  const photoItems = document.querySelectorAll(".photo-item")

  const photoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }, index * 100)
        }
      })
    },
    { threshold: 0.1 },
  )

  photoItems.forEach((item) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(30px)"
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    photoObserver.observe(item)
  })
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()
  addSmoothScrolling()
  addProfileImageEffects()
  addTypingEffect()
  addFloatingAnimation()
  initializePhotoGallery() // Add this line
  addLazyLoading() // Add this line
  addPhotoAnimations() // Add this line

  // Event listeners
  themeToggle.addEventListener("click", toggleTheme)
  contactForm.addEventListener("submit", handleContactForm)

  // Show about section by default
  showSection("about")

  // Add some interactive features
  console.log("Bio Data Website Loaded Successfully! 🚀")

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key >= "1" && e.key <= "7") {
      // Changed from 6 to 7
      const sectionIndex = Number.parseInt(e.key) - 1
      const sections = ["about", "experience", "education", "skills", "projects", "photos", "contact"] // Added photos
      if (sections[sectionIndex]) {
        showSection(sections[sectionIndex])
      }
    }
  })
})

// Add some fun easter eggs
let clickCount = 0
document.querySelector(".name").addEventListener("click", () => {
  clickCount++
  if (clickCount === 5) {
    alert("🎉 You found the easter egg! Thanks for exploring my bio data website!")
    clickCount = 0
  }
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease-in"

  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})
