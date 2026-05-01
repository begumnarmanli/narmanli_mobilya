document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTop");
  const sections = document.querySelectorAll("section");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = "flex";
      } else {
        backToTopBtn.style.display = "none";
      }

      let currentSection = null;
      const scrollPos = window.scrollY + window.innerHeight / 3;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          currentSection = section;
        }
      });

      if (currentSection) {
        const colorMode = currentSection.dataset.scrollColor;

        if (colorMode === "dark") {
          backToTopBtn.style.backgroundColor = "#f5f5dc";
          backToTopBtn.style.color = "#800000";
        } else if (colorMode === "light") {
          backToTopBtn.style.backgroundColor = "#800000";
          backToTopBtn.style.color = "#f5f5dc";
        }
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("keydown", (event) => {
      const allowedKeys = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
      ];
      const isNumber =
        (event.key >= "0" && event.key <= "9") ||
        event.key.startsWith("Numpad");

      if (
        !allowedKeys.includes(event.key) &&
        !isNumber &&
        !(event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
      }
    });

    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
    });
  }

  function getBlogBtnText(key) {
    if (window.currentTranslations && window.currentTranslations[key]) {
      return window.currentTranslations[key];
    }
    const defaults = {
      "blog-btn": "Devamını Oku",
      "blog-btn-less": "Daha Az Oku",
    };
    return defaults[key];
  }

  const blogButtons = document.querySelectorAll(".blog-btn");

  blogButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const contentDiv = button.closest(".content");
      const paragraph = contentDiv.querySelector("p");
      const box = button.closest(".box");

      if (!paragraph || !box) return;

      const isCurrentlyExpanded = paragraph.classList.contains("expanded");

      document
        .querySelectorAll(".blogs .box-container .box .content p.expanded")
        .forEach((p) => {
          p.classList.remove("expanded");
          const parentBox = p.closest(".box");
          if (parentBox) parentBox.classList.remove("expanded");
        });

      document.querySelectorAll(".blog-btn").forEach((btn) => {
        btn.textContent = getBlogBtnText("blog-btn");
        btn.classList.remove("expanded-btn");
      });

      if (!isCurrentlyExpanded) {
        paragraph.classList.add("expanded");
        box.classList.add("expanded");
        button.textContent = getBlogBtnText("blog-btn-less");
        button.classList.add("expanded-btn");
      }
    });
  });

  document.addEventListener("click", (event) => {
    const isClickInsideBlogBox = event.target.closest(
      ".blogs .box-container .box",
    );

    if (!isClickInsideBlogBox) {
      const allExpandedParagraphs = document.querySelectorAll(
        ".blogs .box-container .box .content p.expanded",
      );

      if (allExpandedParagraphs.length > 0) {
        allExpandedParagraphs.forEach((p) => {
          p.classList.remove("expanded");
          const parentBox = p.closest(".box");
          if (parentBox) parentBox.classList.remove("expanded");
        });

        document.querySelectorAll(".blog-btn").forEach((btn) => {
          btn.textContent = getBlogBtnText("blog-btn");
        });
      }
    }
  });

  const menu = document.querySelector("#menu-btn");
  const navbar = document.querySelector(".navbar");
  const body = document.body;
  const html = document.documentElement;

  if (menu && navbar) {
    menu.onclick = (event) => {
      event.stopPropagation();
      menu.classList.toggle("fa-times");
      navbar.classList.toggle("active");
      body.classList.toggle("no-scroll");
      html.classList.toggle("no-scroll");
    };

    document.addEventListener("click", (event) => {
      const isClickInsideMenu = navbar.contains(event.target);
      const isClickInsideButton = menu.contains(event.target);
      const isClickOnDropdown = !!event.target.closest(".dropdown");

      if (
        !isClickInsideMenu &&
        !isClickInsideButton &&
        !isClickOnDropdown &&
        navbar.classList.contains("active")
      ) {
        navbar.classList.remove("active");
        menu.classList.remove("fa-times");
        body.classList.remove("no-scroll");
        html.classList.remove("no-scroll");
      }
    });
  }

  const dropdownBtns = document.querySelectorAll(
    ".header .navbar .dropdown .dropbtn",
  );

  const allDropdowns = document.querySelectorAll(".header .navbar .dropdown");

  dropdownBtns.forEach((btn) => {
    ["click", "touchstart"].forEach((eventType) => {
      btn.addEventListener(eventType, (event) => {
        event.preventDefault();
        event.stopPropagation();

        const parentDropdown = btn.closest(".dropdown");

        if (parentDropdown) {
          allDropdowns.forEach((dropdown) => {
            if (dropdown !== parentDropdown) {
              dropdown.classList.remove("active");
            }
          });

          parentDropdown.classList.toggle("active");
        }
      });
    });
  });

  document.addEventListener("click", (event) => {
    let clickedInsideDropdown = false;

    allDropdowns.forEach((dropdown) => {
      if (dropdown.contains(event.target)) {
        clickedInsideDropdown = true;
      }
    });

    if (!clickedInsideDropdown) {
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });
});
