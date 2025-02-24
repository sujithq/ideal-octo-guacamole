document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const htmlElement = document.documentElement;

    // Get available themes from config
    let themes = window.availableThemes || ["watercolor", "sunset", "forest", "neon", "monochrome", "ocean", "lava"];    let currentTheme = htmlElement.getAttribute("data-bs-theme");

    // Get stored theme or use default from config
    const storedTheme = localStorage.getItem("bs-theme");
    if (storedTheme && themes.includes(storedTheme)) {
        currentTheme = storedTheme;
        htmlElement.setAttribute("data-bs-theme", storedTheme);
    }

    // Function to switch to the next theme in the list
    function switchTheme() {
        let currentIndex = themes.indexOf(currentTheme);
        let nextIndex = (currentIndex + 1) % themes.length; // Cycle through themes
        let newTheme = themes[nextIndex];

        htmlElement.setAttribute("data-bs-theme", newTheme);
        localStorage.setItem("bs-theme", newTheme);

        console.log(`Switching theme from '${currentTheme}' to '${newTheme}'`); // Log theme change

        currentTheme = newTheme;
    }

    themeToggle.addEventListener("click", switchTheme);
});
