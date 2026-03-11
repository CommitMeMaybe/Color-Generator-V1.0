document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".tag-btn");
  const searchInput = document.querySelector(".search-box input");
  const cards = document.querySelectorAll(".palette-card");

  let activeFilter = null;

  // Filter Logic
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.textContent.toLowerCase().trim();

      if (activeFilter === filterValue) {
        // Deactivate if already active
        activeFilter = null;
        button.classList.remove("active");
      } else {
        // Activate new filter
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        activeFilter = filterValue;
      }

      filterPalettes();
    });
  });

  // Search Logic
  searchInput.addEventListener("input", () => {
    filterPalettes();
  });

  function filterPalettes() {
    const searchText = searchInput.value.toLowerCase().trim();

    cards.forEach((card) => {
      const title = card
        .querySelector(".palette-title")
        .textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll(".tag")).map((t) =>
        t.textContent.toLowerCase(),
      );
      const hexes = Array.from(card.querySelectorAll(".color-hex")).map((h) =>
        h.textContent.toLowerCase(),
      );

      const matchesFilter = !activeFilter || tags.includes(activeFilter);
      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        tags.some((tag) => tag.includes(searchText)) ||
        hexes.some((hex) => hex.includes(searchText));

      if (matchesFilter && matchesSearch) {
        card.style.display = "flex";
        card.style.opacity = "0";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transition = "opacity 0.3s ease";
        }, 10);
      } else {
        card.style.display = "none";
      }
    });
  }

  // Action Buttons (Copy/Like) - Prevent default for demo
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      const paletteTitle = btn
        .closest(".palette-info")
        .querySelector(".palette-title").textContent;

      if (action === "copy") {
        const hexes = Array.from(
          btn.closest(".palette-info").querySelectorAll(".color-hex"),
        )
          .map((h) => h.textContent)
          .join(", ");
        navigator.clipboard.writeText(hexes).then(() => {
          showToast(`Copied ${paletteTitle} hex codes!`);
        });
      } else if (action === "like") {
        btn.classList.toggle("liked");
        const heartPath = btn.querySelector("path");
        if (btn.classList.contains("liked")) {
          heartPath.setAttribute("fill", "#EF4444");
          heartPath.setAttribute("stroke", "#EF4444");
        } else {
          heartPath.setAttribute("fill", "none");
          heartPath.setAttribute("stroke", "#99A1AF");
        }
      }
    });
  });

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Style toast dynamically if not in CSS
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      backgroundColor: "#101828",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      zIndex: "1000",
      opacity: "0",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      transform: "translateY(20px)",
    });

    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 10);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
