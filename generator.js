// Color generator functionality
const COLORS_COUNT = 5;
let currentPalette = [];
let currentHarmony = "random";

// Convert hex to HSL
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Convert HSL to hex
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  r = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  g = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  b = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");
  return "#" + r + g + b;
}

// Simple hex color generator
function randomHex() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase()
  );
}

// Generate a palette of colors based on harmony mode
function generatePalette() {
  const palette = [];

  if (currentHarmony === "random") {
    for (let i = 0; i < COLORS_COUNT; i++) {
      palette.push(randomHex());
    }
  } else {
    // Generate base color
    const baseHex = randomHex();
    const [baseH, baseS, baseL] = hexToHSL(baseHex);

    switch (currentHarmony) {
      case "analogous":
        palette.push(baseHex);
        palette.push(hslToHex((baseH + 30) % 360, baseS, baseL));
        palette.push(hslToHex((baseH - 30 + 360) % 360, baseS, baseL));
        palette.push(hslToHex((baseH + 60) % 360, baseS, baseL));
        palette.push(hslToHex((baseH - 60 + 360) % 360, baseS, baseL));
        break;
      case "complementary":
        palette.push(baseHex);
        palette.push(hslToHex((baseH + 180) % 360, baseS, baseL));
        for (let i = 2; i < COLORS_COUNT; i++) {
          palette.push(
            hslToHex(
              (baseH + Math.random() * 360) % 360,
              baseS,
              baseL + Math.random() * 20 - 10,
            ),
          );
        }
        break;
      case "triadic":
        palette.push(baseHex);
        palette.push(hslToHex((baseH + 120) % 360, baseS, baseL));
        palette.push(hslToHex((baseH + 240) % 360, baseS, baseL));
        palette.push(hslToHex((baseH + 60) % 360, baseS, baseL + 10));
        palette.push(hslToHex((baseH + 180) % 360, baseS, baseL - 10));
        break;
      case "split-comp":
        palette.push(baseHex);
        palette.push(hslToHex((baseH + 150) % 360, baseS, baseL));
        palette.push(hslToHex((baseH + 210) % 360, baseS, baseL));
        palette.push(hslToHex((baseH + 30) % 360, baseS, baseL + 10));
        palette.push(hslToHex((baseH - 30 + 360) % 360, baseS, baseL - 10));
        break;
      case "tetradic":
        palette.push(baseHex);
        palette.push(hslToHex((baseH + 90) % 360, baseS, baseL));
        palette.push(hslToHex((baseH + 180) % 360, baseS, baseL));
        palette.push(hslToHex((baseH + 270) % 360, baseS, baseL));
        palette.push(hslToHex((baseH + 45) % 360, baseS, baseL + 5));
        break;
      case "monochromatic":
        for (let i = 0; i < COLORS_COUNT; i++) {
          const lightness = baseL + (i - 2) * 15;
          palette.push(
            hslToHex(baseH, baseS, Math.max(10, Math.min(90, lightness))),
          );
        }
        break;
      default:
        for (let i = 0; i < COLORS_COUNT; i++) {
          palette.push(randomHex());
        }
    }
  }

  return palette;
}

// Create SVG bowl visualization
function createBowlSVG(color) {
  // Remove the # from the color
  const colorHex = color.startsWith("#") ? color : "#" + color;

  return `
    <svg viewBox="0 0 180 104" xmlns="http://www.w3.org/2000/svg" class="bowl-svg">
      <!-- Bowl outer -->
      <path d="M20 50 Q20 80 50 90 L130 90 Q160 80 160 50 Z" fill="${colorHex}" opacity="0.9" />
      
      <!-- Bowl rim -->
      <ellipse cx="90" cy="50" rx="70" ry="15" fill="${colorHex}" />
      
      <!-- Bowl highlight -->
      <ellipse cx="50" cy="40" rx="20" ry="8" fill="white" opacity="0.3" />
      
      <!-- Bowl shadow -->
      <path d="M30 70 Q30 85 50 90 L130 90 Q150 85 150 70" fill="black" opacity="0.1" />
      
      <!-- Liquid waves -->
      <path d="M40 60 Q60 65 90 60 T140 60" stroke="white" stroke-width="1" fill="none" opacity="0.2" />
      <path d="M35 75 Q65 80 95 75 T155 75" stroke="white" stroke-width="1" fill="none" opacity="0.15" />
    </svg>
  `;
}

// Render the bowls
function renderBowls() {
  const container = document.getElementById("bowls-container");
  container.innerHTML = "";

  currentPalette.forEach((color, index) => {
    const bowl = document.createElement("div");
    bowl.className = "bowl-item";
    bowl.innerHTML = `
      <div class="bowl-wrapper">
        <div class="bowl-visual">
          ${createBowlSVG(color)}
        </div>
        <div class="bowl-controls">
          <div class="color-value">${color}</div>
          <button class="btn btn-copy" data-color="${color}" title="Copy color">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 11h6v6H9z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    container.appendChild(bowl);

    // Add copy to clipboard functionality
    const copyBtn = bowl.querySelector(".btn-copy");
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      copyToClipboard(color);
    });

    // Click on bowl to copy color
    bowl.addEventListener("click", () => {
      copyToClipboard(color);
    });
  });
}

// Copy color to clipboard
function copyToClipboard(color) {
  navigator.clipboard.writeText(color).then(() => {
    // Visual feedback
    const notification = document.createElement("div");
    notification.className = "copy-notification";
    notification.textContent = `Copied ${color}!`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000);

    setTimeout(() => {
      notification.remove();
    }, 2300);
  });
}

// Initialize the generator
function init() {
  // Generate initial palette
  currentPalette = generatePalette();
  renderBowls();

  // Set up button listeners
  const regenerateBtn = document.getElementById("regenerate-btn");
  const exportBtn = document.getElementById("export-btn");
  const exportDropdown = document.getElementById("export-dropdown");
  const exportOptions = document.querySelectorAll(".export-option");

  regenerateBtn.addEventListener("click", () => {
    currentPalette = generatePalette();
    renderBowls();
  });

  // Toggle export dropdown
  exportBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    exportDropdown.classList.toggle("show");
  });

  // Handle export option selection
  exportOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const format = option.dataset.export;
      handleExport(format);
      exportDropdown.classList.remove("show");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".export-selector")) {
      exportDropdown.classList.remove("show");
    }
  });

  // Spacebar to regenerate
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      currentPalette = generatePalette();
      renderBowls();
    }
  });
}

// Export as PNG
function exportAsPNG() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const padding = 20;
  const colorSize = 80;
  const gap = 10;

  const width = currentPalette.length * (colorSize + gap) + padding * 2;
  const height = colorSize + padding * 2;

  canvas.width = width;
  canvas.height = height;

  // Background
  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, width, height);

  // Draw colors
  currentPalette.forEach((color, index) => {
    const x = padding + index * (colorSize + gap);
    const y = padding;

    // Color square
    ctx.fillStyle = color;
    ctx.fillRect(x, y, colorSize, colorSize);

    // Border
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, colorSize, colorSize);

    // Color hex text
    ctx.fillStyle = "#333";
    ctx.font = "11px Poppins";
    ctx.textAlign = "center";
    ctx.fillText(color, x + colorSize / 2, y + colorSize + 15);
  });

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `colorsoup-palette-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export as SVG
function exportAsSVG() {
  const colorSize = 80;
  const gap = 10;
  const padding = 20;

  const width = currentPalette.length * (colorSize + gap) + padding * 2;
  const height = colorSize + padding * 2 + 30;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#fafafa"/>`;

  currentPalette.forEach((color, index) => {
    const x = padding + index * (colorSize + gap);
    const y = padding;

    svg += `
  <rect x="${x}" y="${y}" width="${colorSize}" height="${colorSize}" fill="${color}" stroke="#e0e0e0" stroke-width="1"/>
  <text x="${x + colorSize / 2}" y="${y + colorSize + 20}" font-family="Poppins" font-size="11" text-anchor="middle" fill="#333">${color}</text>`;
  });

  svg += `
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `colorsoup-palette-${Date.now()}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export as CSS Variables
function exportAsCSS() {
  let css = ":root {\n";
  currentPalette.forEach((color, index) => {
    css += `  --color-${index + 1}: ${color};\n`;
  });
  css += "}";

  // Copy to clipboard
  navigator.clipboard
    .writeText(css)
    .then(() => {
      const notification = document.createElement("div");
      notification.className = "copy-notification";
      notification.textContent = "CSS variables copied!";
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add("show");
      }, 10);

      setTimeout(() => {
        notification.classList.remove("show");
      }, 2000);

      setTimeout(() => {
        notification.remove();
      }, 2300);
    })
    .catch(() => {
      // Fallback: download as file
      const blob = new Blob([css], { type: "text/css" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `colorsoup-palette-${Date.now()}.css`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
}

// Download palette as JSON
function downloadPalette() {
  const data = {
    colors: currentPalette,
    created: new Date().toISOString(),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `colorsoup-palette-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Handle export options
function handleExport(format) {
  switch (format) {
    case "png":
      exportAsPNG();
      break;
    case "svg":
      exportAsSVG();
      break;
    case "css":
      exportAsCSS();
      break;
    case "json":
      downloadPalette();
      break;
  }
}

// Setup harmony selector
function setupHarmonySelector() {
  const harmonyBtn = document.getElementById("harmony-btn");
  const harmonyDropdown = document.getElementById("harmony-dropdown");
  const harmonyOptions = document.querySelectorAll(".harmony-option");
  const harmonyLabel = document.getElementById("harmony-label");

  // Toggle dropdown
  harmonyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    harmonyDropdown.classList.toggle("show");
  });

  // Handle harmony selection
  harmonyOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const harmony = option.dataset.harmony;
      currentHarmony = harmony;

      // Update UI
      harmonyOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      harmonyLabel.textContent =
        option.querySelector(".option-name").textContent;
      harmonyDropdown.classList.remove("show");

      // Generate new palette
      currentPalette = generatePalette();
      renderBowls();
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".harmony-selector")) {
      harmonyDropdown.classList.remove("show");
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    init();
    setupHarmonySelector();
  });
} else {
  init();
  setupHarmonySelector();
}
