(function() {
    "use strict";
  
    /**
     * Apply .scrolled class to the body as the page is scrolled down
     */
    function toggleScrolled() {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');
      if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }
  
    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);
  
    /**
     * Mobile nav toggle
     */
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  
    function mobileNavToogle() {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
    // add check on null
    if (mobileNavToggleBtn)
      mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  
    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });
  
    });
  
    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });
  
    /**
     * Preloader
     */
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    }
  
    /**
     * Scroll top button
     */
    let scrollTop = document.querySelector('.scroll-top');
  
    function toggleScrollTop() {
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
    }
    if (scrollTop)
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
  
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  
    /**
     * Animation on scroll function and init
     */
    // function aosInit() {
    //   if (AOS){
    //     AOS.init({
    //       duration: 600,
    //       easing: 'ease-in-out',
    //       once: true,
    //       mirror: false
    //     });
    //     }
    // }
    // window.addEventListener('DOMContentLoaded', aosInit);
  
    /**
     * Init swiper sliders
     */
    function initSwiper() {
      document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
        let config = JSON.parse(
          swiperElement.querySelector(".swiper-config").innerHTML.trim()
        );
  
        if (swiperElement.classList.contains("swiper-tab")) {
          initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      });
    }
  
    window.addEventListener("load", initSwiper);

    document.addEventListener("DOMContentLoaded", function () {
        const themeToggle = document.getElementById("themeToggle");
        const htmlElement = document.documentElement;
    
        // Get available themes from config
        let themes = window.availableThemes || ["dark", "light", "neon", "forest"];    
        let currentTheme = htmlElement.getAttribute("data-bs-theme");
    
        // Get stored theme or use default from config
        const storedTheme = localStorage.getItem("bs-theme");
        if (storedTheme && themes.includes(storedTheme)) {
            currentTheme = storedTheme;
            htmlElement.setAttribute("data-bs-theme", storedTheme);
        }
    
        function getOldThemeStylesheet() {
            let currentTheme = htmlElement.getAttribute("data-bs-theme");
            let themeData = window.themeStyles[currentTheme];
        
            if (themeData) {
                return Array.from(document.querySelectorAll("link[rel='stylesheet']")).find(
                    (link) => link.integrity === themeData.integrity
                );
            }
            return null;
        }
    
        // Function to switch to the next theme in the list
        function switchTheme() {
            let currentIndex = themes.indexOf(currentTheme);
            let nextIndex = (currentIndex + 1) % themes.length;
            let newTheme = themes[nextIndex];
        
            htmlElement.setAttribute("data-bs-theme", newTheme);
            localStorage.setItem("bs-theme", newTheme);
        
            console.log(`Switching theme from '${currentTheme}' to '${newTheme}'`);
        
            let oldLink = getOldThemeStylesheet(); // Get the correct old stylesheet
        
            let themeData = window.themeStyles[newTheme];
            if (themeData) {
                let newLink = document.createElement("link");
                newLink.rel = "stylesheet";
                newLink.href = themeData.link;
                newLink.integrity = themeData.integrity;
                newLink.crossOrigin = "anonymous";
                newLink.setAttribute("data-theme", newTheme);
        
                newLink.onload = function () {
                    if (oldLink && oldLink.parentNode) {
                        oldLink.parentNode.removeChild(oldLink); // Remove the old stylesheet safely
                    }
                };
        
                document.head.appendChild(newLink);
                currentTheme = newTheme;
            }
        }
        
    
        themeToggle.addEventListener("click", switchTheme);
    });
    
  
  })();