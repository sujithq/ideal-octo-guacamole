document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const htmlElement = document.documentElement;

    // Get available themes from config
    let themes = window.availableThemes || ["dark", "light", "neon"];    let currentTheme = htmlElement.getAttribute("data-bs-theme");

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

        // Get the new stylesheet information
    let themeData = window.themeStyles[newTheme];
    if (themeData) {
        let oldLink = document.querySelector("link[rel='stylesheet']");

        // Create a new <link> element
        let newLink = document.createElement("link");
        newLink.rel = "stylesheet";
        newLink.href = themeData.link;
        newLink.integrity = themeData.integrity;
        newLink.crossOrigin = "anonymous";

        // Ensure the new stylesheet is loaded before removing the old one
        newLink.onload = function () {
            oldLink.parentNode.removeChild(oldLink); // Remove the old <link> after new one loads
        };

        // Insert new stylesheet before the old one (so styles apply instantly)
        oldLink.parentNode.insertBefore(newLink, oldLink);

        // Update the current theme
        currentTheme = newTheme;
    }

    }

    themeToggle.addEventListener("click", switchTheme);
});
