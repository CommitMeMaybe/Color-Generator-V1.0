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
function createBowlSVG(color, index) {
  const colorHex = color.startsWith("#") ? color : "#" + color;
  const [h, s, l] = hexToHSL(colorHex);

  // Calculate soup gradient shades
  const lightSoup = hslToHex(h, s, Math.min(95, l + 15));
  const midSoup = hslToHex(h, s, l);
  const darkSoup = hslToHex(h, s, Math.max(5, l - 15));

  const idSuffix = `_${index}_${Date.now()}`;

  return `
<svg width="100%" height="100%" viewBox="0 0 229 151" fill="none" xmlns="http://www.w3.org/2000/svg" class="bowl-svg">
  <g filter="url(#filter0_d${idSuffix})">
    <path d="M29.6318 52.5986C34.1436 87.3971 62.3424 106.884 114.228 111.06C166.114 106.884 194.313 87.3971 198.825 52.5986" fill="url(#paint0_linear${idSuffix})"/>
    <path d="M29.6318 52.5986C34.1436 87.3971 62.3424 106.884 114.228 111.06C166.114 106.884 194.313 87.3971 198.825 52.5986" stroke="#4A2E1A" stroke-width="0.499979"/>
    <path d="M114.228 86.0052C160.949 86.0052 198.825 71.0485 198.825 52.5986C198.825 34.1486 160.949 19.192 114.228 19.192C67.5069 19.192 29.6318 34.1486 29.6318 52.5986C29.6318 71.0485 67.5069 86.0052 114.228 86.0052Z" fill="url(#paint1_radial${idSuffix})" stroke="#4A2E1A" stroke-width="0.799966"/>
    <path d="M114.228 81.9964C156.277 81.9964 190.365 68.8345 190.365 52.5986C190.365 36.3626 156.277 23.2008 114.228 23.2008C72.1789 23.2008 38.0913 36.3626 38.0913 52.5986C38.0913 68.8345 72.1789 81.9964 114.228 81.9964Z" fill="#5C3A22" stroke="#4A2E1A" stroke-width="0.299987"/>
    <path d="M114.228 81.3283C153.474 81.3283 185.289 69.0638 185.289 53.9349C185.289 38.8059 153.474 26.5415 114.228 26.5415C74.9821 26.5415 43.167 38.8059 43.167 53.9349C43.167 69.0638 74.9821 81.3283 114.228 81.3283Z" fill="url(#paint2_radial${idSuffix})"/>
    <path opacity="0.2" d="M98.5945 52.2912C113.508 52.2912 125.598 49.5931 125.598 46.2647C125.598 42.9363 113.508 40.2382 98.5945 40.2382C83.681 40.2382 71.5913 42.9363 71.5913 46.2647C71.5913 49.5931 83.681 52.2912 98.5945 52.2912Z" fill="white"/>
    <path opacity="0.22" d="M139.1 59.7423C140.491 59.7423 141.62 58.614 141.62 57.2223C141.62 55.8305 140.491 54.7023 139.1 54.7023C137.708 54.7023 136.58 55.8305 136.58 57.2223C136.58 58.614 137.708 59.7423 139.1 59.7423Z" fill="white"/>
    <path opacity="0.16" d="M103.569 65.3227C104.563 65.3227 105.369 64.5168 105.369 63.5227C105.369 62.5285 104.563 61.7227 103.569 61.7227C102.575 61.7227 101.769 62.5285 101.769 63.5227C101.769 64.5168 102.575 65.3227 103.569 65.3227Z" fill="white"/>
    <path opacity="0.18" d="M153.312 53.7236C154.405 53.7236 155.292 52.8371 155.292 51.7435C155.292 50.65 154.405 49.7635 153.312 49.7635C152.218 49.7635 151.332 50.65 151.332 51.7435C151.332 52.8371 152.218 53.7236 153.312 53.7236Z" fill="white"/>
    <path opacity="0.14" d="M84.3824 58.1143C85.1777 58.1143 85.8224 57.4695 85.8224 56.6743C85.8224 55.879 85.1777 55.2343 84.3824 55.2343C83.5871 55.2343 82.9424 55.879 82.9424 56.6743C82.9424 57.4695 83.5871 58.1143 84.3824 58.1143Z" fill="white"/>
    <g opacity="0.88">
      <path d="M107.028 54.0042V46.0042" stroke="#2D7A3A" stroke-width="0.899961" stroke-linecap="round"/>
      <path d="M104.676 50.1425C106.486 48.8753 107.439 47.1147 106.805 46.2098C106.172 45.305 104.191 45.5987 102.382 46.8659C100.572 48.133 99.6186 49.8936 100.252 50.7985C100.886 51.7033 102.866 51.4096 104.676 50.1425Z" fill="#3DA34D"/>
      <path d="M109.089 49.27C111.04 50.3072 113.042 50.3573 113.56 49.382C114.079 48.4067 112.918 46.7754 110.967 45.7382C109.017 44.7011 107.015 44.651 106.497 45.6262C105.978 46.6015 107.139 48.2329 109.089 49.27Z" fill="#4CBB5C"/>
      <path d="M106.361 45.5694C108.252 45.1675 109.636 44.141 109.452 43.2766C109.268 42.4123 107.587 42.0374 105.696 42.4393C103.805 42.8412 102.421 43.8677 102.605 44.732C102.789 45.5964 104.471 45.9713 106.361 45.5694Z" fill="#3DA34D"/>
    </g>
    <g opacity="0.72">
      <path d="M126.828 56.5652V51.5652" stroke="#2D7A3A" stroke-width="0.69997" stroke-linecap="round"/>
      <path d="M124.59 53.956C126.228 53.2939 127.305 52.1346 126.995 51.3665C126.685 50.5984 125.105 50.5124 123.466 51.1744C121.827 51.8365 120.751 52.9958 121.061 53.7639C121.371 54.532 122.951 54.618 124.59 53.956Z" fill="#4CBB5C"/>
      <path d="M128.833 53.3373C130.332 54.2738 131.903 54.4635 132.342 53.761C132.781 53.0584 131.922 51.7297 130.423 50.7932C128.924 49.8566 127.353 49.6669 126.914 50.3695C126.475 51.072 127.334 52.4008 128.833 53.3373Z" fill="#3DA34D"/>
    </g>
    <path opacity="0.5" d="M128.44 51.026C129.103 51.026 129.64 50.4887 129.64 49.826C129.64 49.1632 129.103 48.626 128.44 48.626C127.777 48.626 127.24 49.1632 127.24 49.826C127.24 50.4887 127.777 51.026 128.44 51.026Z" fill="#C0392B"/>
    <path opacity="0.4" d="M92.9098 60.3137C93.4068 60.3137 93.8098 59.9107 93.8098 59.4137C93.8098 58.9166 93.4068 58.5137 92.9098 58.5137C92.4127 58.5137 92.0098 58.9166 92.0098 59.4137C92.0098 59.9107 92.4127 60.3137 92.9098 60.3137Z" fill="#E67E22"/>
    <path opacity="0.14" d="M99.0007 39.9041C117.689 39.9041 132.839 38.4084 132.839 36.5634C132.839 34.7184 117.689 33.2228 99.0007 33.2228C80.3121 33.2228 65.1621 34.7184 65.1621 36.5634C65.1621 38.4084 80.3121 39.9041 99.0007 39.9041Z" fill="white"/>
  </g>
  <defs>
    <filter id="filter0_d${idSuffix}" x="-5.00397" y="-5.86366" width="238.464" height="162.86" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="10.44"/>
      <feGaussianBlur stdDeviation="14.616"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_50_800"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_50_800" result="shape"/>
    </filter>
    <linearGradient id="paint0_linear${idSuffix}" x1="29.6318" y1="52.5986" x2="29.6318" y2="111.06" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7B5234"/>
      <stop offset="1" stop-color="#4A2E1A"/>
    </linearGradient>
    <radialGradient id="paint1_radial${idSuffix}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6458.96 1889.96) scale(11505.1 4543.29)">
      <stop stop-color="#A07050"/>
      <stop offset="0.55" stop-color="#7B5234"/>
      <stop offset="1" stop-color="#4A2E1A"/>
    </radialGradient>
    <radialGradient id="paint2_radial${idSuffix}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(5159.56 1889.29) scale(8811.56 3396.78)">
      <stop stop-color="${lightSoup}"/>
      <stop offset="0.55" stop-color="${midSoup}"/>
      <stop offset="1" stop-color="${darkSoup}"/>
    </radialGradient>
  </defs>
</svg>
  `;
}

// Render the bowls
function renderBowls() {
  const container = document.getElementById("bowls-container");
  if (!container) return;
  container.innerHTML = "";

  currentPalette.forEach((color, index) => {
    const bowl = document.createElement("div");
    bowl.className = "bowl-item";
    bowl.innerHTML = `
      <div class="bowl-wrapper">
        <div class="bowl-visual">
          ${createBowlSVG(color, index)}
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
