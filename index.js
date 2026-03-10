// simple hex color generator used in multiple places
const hexDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
function randomHex() {
  let h = "#";
  for (let i = 0; i < 6; i++) {
    h += hexDigits[Math.floor(Math.random() * hexDigits.length)];
  }
  return h;
}

// Hero title gradient on hover - each letter gets random color
const heroTitle = document.querySelector(".hero-title");
if (heroTitle) {
  // Helper function to wrap each letter in a span
  function wrapLetters(element) {
    const text = element.textContent;
    element.innerHTML = text
      .split("")
      .map((char) =>
        char === " " ? " " : `<span class="letter">${char}</span>`,
      )
      .join("");
  }

  // Wrap letters on first load
  const mainSpan = heroTitle.querySelector(".hero-title-main");
  const highlightSpan = heroTitle.querySelector(".hero-title-highlight");

  if (mainSpan && !mainSpan.querySelector(".letter")) {
    wrapLetters(mainSpan);
  }

  if (highlightSpan) {
    const textNode = Array.from(highlightSpan.childNodes).find(
      (node) => node.nodeType === 3 && node.textContent.trim(),
    );
    if (textNode) {
      const tempSpan = document.createElement("span");
      tempSpan.textContent = textNode.textContent;
      wrapLetters(tempSpan);
      textNode.replaceWith(tempSpan);
    }
  }

  heroTitle.addEventListener("mouseenter", () => {
    const letters = heroTitle.querySelectorAll(".letter");
    letters.forEach((letter, index) => {
      setTimeout(() => {
        const randomColor = randomHex();
        letter.style.color = randomColor;
        letter.style.transition = "color 0.3s ease";
      }, index * 30); // Stagger so each letter animates individually
    });
  });

  heroTitle.addEventListener("mouseleave", () => {
    const letters = heroTitle.querySelectorAll(".letter");
    letters.forEach((letter) => {
      letter.style.color = "inherit";
    });
  });
}

// Color spheres hover animation with color change
const spheres = document.querySelectorAll(".sphere");
spheres.forEach((sphere) => {
  const container = sphere.querySelector(".sphere-container");
  const originalGradient = window.getComputedStyle(container).background;

  sphere.addEventListener("mouseenter", () => {
    // Generate random colors for the gradient
    const color1 = randomHex();
    const color2 = randomHex();
    const newGradient = `radial-gradient(circle at 30% 30%, ${color1}, ${color2})`;
    container.style.background = newGradient;
  });

  sphere.addEventListener("mouseleave", () => {
    // Restore original gradient
    container.style.background = originalGradient;
  });
});

// update a single color strip element
function updateAccentDots() {
  const strips = document.querySelectorAll(".color-strip");
  if (strips.length < 5) return;
  const colors = Array.from(strips).map((s) => s.style.backgroundColor);
  const targetIndices = [0, 3, 2];

  const dots = [
    document.querySelector(".accent-dot.dot-1"),
    document.querySelector(".accent-dot.dot-2"),
    document.querySelector(".accent-dot.dot-3"),
  ];

  dots.forEach((dot, i) => {
    if (dot && colors[targetIndices[i]]) {
      const color = colors[targetIndices[i]];
      dot.style.background = `radial-gradient(circle at 30% 30%, ${color}, transparent)`;
      const rgbValues = color.match(/\d+/g);
      if (rgbValues && rgbValues.length >= 3) {
        dot.style.boxShadow = `0 4px 12px rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.5)`;
      }
    }
  });
}

function colorStrip(strip, delay = 0) {
  const hex = randomHex();

  setTimeout(() => {
    strip.style.backgroundColor = hex;
    const codeEl = strip.querySelector(".hex-code");
    if (codeEl) codeEl.textContent = hex;

    // Animation trigger
    strip.classList.remove("strip-animating");
    void strip.offsetWidth; // trigger reflow
    strip.classList.add("strip-animating");

    updateAccentDots();
  }, delay);
}

// handle all color strips
const strips = document.querySelectorAll(".color-strip");
strips.forEach((strip) => {
  // Add overlays
  if (!strip.querySelector(".color-strip-overlay")) {
    strip.insertAdjacentHTML(
      "beforeend",
      `<div class="color-strip-overlay"><img src="https://www.figma.com/api/mcp/asset/42a8ce26-4220-43d6-bc8f-4aea6f13907b" alt="Refresh" /></div><div class="copy-feedback">Copied!</div>`,
    );
  }

  strip.addEventListener("click", (e) => {
    if (e.target.classList.contains("hex-code")) return; // handled separately
    colorStrip(strip);
  });

  const hexLabel = strip.querySelector(".hex-code");
  if (hexLabel) {
    hexLabel.addEventListener("click", (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(hexLabel.textContent).then(() => {
        const feedback = strip.querySelector(".copy-feedback");
        if (feedback) {
          feedback.classList.add("show");
          setTimeout(() => feedback.classList.remove("show"), 1200);
        }
      });
    });
  }
});

function regenerateAllStrips() {
  strips.forEach((strip, index) => {
    colorStrip(strip, index * 60);
  });
}

// Stir button to regenerate all color strips
const stirButton = document.getElementById("stir-button");
if (stirButton) {
  stirButton.addEventListener("click", regenerateAllStrips);
}

// any element with .generate-btn should regenerate all strips and bowls
const generateButtons = document.querySelectorAll(".generate-btn");
if (generateButtons.length) {
  generateButtons.forEach((btn) => {
    btn.addEventListener("click", regenerateAllStrips);
  });
}

// Auto regenerate timer
let autoRegenerateInterval = setInterval(() => {
  if (document.getElementById("generator")) {
    regenerateAllStrips();
  }
}, 8000);

// Palette Gallery Interactions
// Handle palette action buttons (like and copy)
const actionButtons = document.querySelectorAll(".action-btn");
actionButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const action = btn.getAttribute("data-action");

    if (action === "like") {
      btn.style.transform = "scale(0.9)";
      setTimeout(() => {
        btn.style.transform = "scale(1)";
      }, 100);
    } else if (action === "copy") {
      // Get all color hex values from the palette card
      const card = btn.closest(".palette-card");
      const hexCodes = Array.from(card.querySelectorAll(".color-hex"))
        .map((el) => el.textContent)
        .join(", ");

      // Copy to clipboard
      navigator.clipboard.writeText(hexCodes).then(() => {
        btn.textContent = "✓";
        setTimeout(() => {
          btn.textContent = "📋";
        }, 1500);
      });
    }
  });
});

// Handle filter tag buttons
const tagButtons = document.querySelectorAll(".tag-btn");
tagButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});

// Search functionality
const searchInput = document.querySelector(".search-box input");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const paletteCards = document.querySelectorAll(".palette-card");

    paletteCards.forEach((card) => {
      const title = card
        .querySelector(".palette-title")
        .textContent.toLowerCase();
      const isVisible = title.includes(searchTerm);
      card.style.display = isVisible ? "block" : "none";
    });
  });
}

// Intersection Observers for Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
  // Add accent dots if generator wrapper exists
  const wrapper = document.querySelector(".generator-window-wrapper");
  if (wrapper && !wrapper.querySelector(".accent-dot")) {
    wrapper.insertAdjacentHTML(
      "afterbegin",
      `
          <div class="accent-dot dot-1"></div>
          <div class="accent-dot dot-2"></div>
          <div class="accent-dot dot-3"></div>
      `,
    );
    // Init their colors
    setTimeout(updateAccentDots, 100);

    // Also apply initial strip animation since they exist in DOM
    document.querySelectorAll(".color-strip").forEach((s, idx) => {
      setTimeout(() => {
        s.classList.add("strip-animating");
      }, idx * 60);
    });
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.classList.contains("trusted-company")) {
          // Trusted companies stagger 100ms
          const index = Array.from(el.parentNode.children).indexOf(el);
          setTimeout(() => {
            el.classList.add("animate-fade-in");
          }, index * 100);
        } else if (el.classList.contains("card")) {
          // Feature cards stagger 100ms
          const index = Array.from(el.parentNode.children).indexOf(el);
          setTimeout(() => {
            el.classList.add("animate-in-view");
          }, index * 100);
        } else if (el.classList.contains("generator-window")) {
          el.classList.add("animate-in-view-30");
        } else {
          // Generic section titles
          el.classList.add("animate-in-view");
        }

        // Once true - unobserve
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  // Initializing Mount Animations for Hero section
  const heroBadge = document.querySelector(".hero-announcement");
  const heroTitle = document.querySelector(".hero-title");
  const heroUnderline = document.querySelector(".hero-title-underline");
  const ctaButtons = document.querySelector(".hero-cta");

  if (heroBadge) heroBadge.classList.add("animate-mount-badge");
  if (heroTitle) heroTitle.classList.add("animate-mount-title");
  if (heroUnderline) heroUnderline.classList.add("animate-scaleX");
  if (ctaButtons) ctaButtons.classList.add("animate-mount-cta");

  // Elements to observe for scroll
  const scrollElements = document.querySelectorAll(
    ".trusted-company, #features .section-title, #features .card, .magic-header .section-title, .generator-window",
  );

  scrollElements.forEach((el) => observer.observe(el));
});
