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
