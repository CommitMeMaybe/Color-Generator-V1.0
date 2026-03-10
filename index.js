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
function colorStrip(strip) {
  const hex = randomHex();
  strip.style.backgroundColor = hex;
  const codeEl = strip.querySelector(".hex-code");
  if (codeEl) codeEl.textContent = hex;
}

// handle all color strips
const strips = document.querySelectorAll(".color-strip");
strips.forEach((strip) => {
  strip.addEventListener("click", () => colorStrip(strip));
});

// Stir button to regenerate all color strips
const stirButton = document.getElementById("stir-button");
if (stirButton) {
  stirButton.addEventListener("click", () => {
    strips.forEach(colorStrip);
  });
}

// any element with .generate-btn should regenerate all strips and bowls
const generateButtons = document.querySelectorAll(".generate-btn");
if (generateButtons.length) {
  generateButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      strips.forEach(colorStrip);
    });
  });
}

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
