(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  // add check on null
  if (mobileNavToggleBtn)
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  // Toggle light and dark themes
  // function toggleThemeMenu() {
  //   let themeMenu = document.querySelector("#theme-menu");

  //   if (!themeMenu) return;

  //   document.querySelectorAll("[data-bs-theme-value]").forEach((value) => {
  //     value.addEventListener("click", () => {
  //       const theme = value.getAttribute("data-bs-theme-value");
  //       document.documentElement.setAttribute("data-bs-theme", theme);
  //     });
  //   });
  // }
  // toggleThemeMenu();

  document.addEventListener("DOMContentLoaded", function () {
    const themeButtons = document.querySelectorAll("[data-bs-theme-value]");
    const htmlElement = document.documentElement;
    let savedTheme = localStorage.getItem("theme") || htmlElement.getAttribute("data-bs-theme") || "light";

    // Apply the saved theme to <html>
    htmlElement.setAttribute("data-bs-theme", savedTheme);

    // Invert all other elements' themes, :not(nav > div > div)
    document.querySelectorAll("[data-bs-theme]:not(html):not(nav)").forEach(el => {
        let elTheme = el.getAttribute("data-bs-theme") || "light";
        el.setAttribute("data-bs-theme", elTheme === "light" ? "dark" : "light");
    });

    // Update button state based on the applied theme
    themeButtons.forEach(btn => {
        let themeValue = btn.getAttribute("data-bs-theme-value");
        btn.setAttribute("aria-pressed", themeValue === savedTheme ? "true" : "false");
    });

    // Event listener for theme selection
    themeButtons.forEach(button => {
        button.addEventListener("click", () => {
            let selectedTheme = button.getAttribute("data-bs-theme-value");

            if (selectedTheme !== htmlElement.getAttribute("data-bs-theme")) {


            // Set the theme on <html>
            htmlElement.setAttribute("data-bs-theme", selectedTheme);
            localStorage.setItem("theme", selectedTheme);

            // Invert all other `data-bs-theme` elements, :not(nav > div > div)
            document.querySelectorAll("[data-bs-theme]:not(html):not(nav)").forEach(el => {
                let elTheme = el.getAttribute("data-bs-theme") || "light";
                el.setAttribute("data-bs-theme", elTheme === "light" ? "dark" : "light");
            });

            // Update button states
            themeButtons.forEach(btn => {
                let themeValue = btn.getAttribute("data-bs-theme-value");
                btn.setAttribute("aria-pressed", themeValue === selectedTheme ? "true" : "false");
            });
          }

        });
    });
});


  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  if (scrollTop)
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  //  Helper functions
  function escapeHtml(html) {
    return html
      .replace(/×/g, "&times;")
      .replace(/«/g, "&laquo;")
      .replace(/»/g, "&raquo;")
      .replace(/←/g, "&larr;")
      .replace(/→/g, "&rarr;");
  }

  function cleanSource(html) {
    // Escape HTML, split the lines to an Array, remove empty elements
    // and finally remove the last element
    let lines = escapeHtml(html).split("\n").filter(Boolean);

    lines = lines.filter(
      (line) => !line.trim().startsWith('<button class="source-button')
    );

    const indentSize = lines[0].length - lines[0].trim().length;
    const re = new RegExp(" {" + indentSize + "}");

    lines = lines.map((line) => {
      return re.test(line) ? line.slice(Math.max(0, indentSize)) : line;
    });

    return lines.join("\n");
  }

  // Add source modals
  function addSourceModals() {
    const sourceModalElement = document.getElementById("source-modal");

    if (!sourceModalElement) {
      return;
    }
    const btns = sourceModalElement.querySelector(".btn-copy");
    btns.addEventListener("click", (e) => {
      if (navigator.clipboard) {
        const code =
          sourceModalElement.querySelector(".modal-body pre").innerText;
        navigator.clipboard.writeText(code);
      }

      const sourceModal =
        bootstrap.Modal.getOrCreateInstance(sourceModalElement);
      sourceModal.hide();
    });

    document.body.addEventListener(
      "click",
      (event) => {
        if (!event.target.matches(".source-button")) {
          return;
        }

        const sourceModal =
          bootstrap.Modal.getOrCreateInstance(sourceModalElement);
        let html = event.target.parentNode.innerHTML;

        html = Prism.highlight(cleanSource(html), Prism.languages.html, "html");

        sourceModalElement.querySelector("code").innerHTML = html;
        sourceModal.show();
      },
      false
    );
  }
  addSourceModals();

  // Add the "View Source" buttons in each component
  const bsComponents = document.querySelectorAll(".bs-component");

  for (const element of bsComponents) {
    const button =
      '<button class="source-button btn btn-primary btn-xs" type="button" tabindex="0"><i class="bi bi-code"></i></button>';
    element.insertAdjacentHTML("beforeend", button);
  }
})();
