"use strict";

/* Burger menyn */
const menuButton = document.querySelector("#menuButton");
const mainMenu = document.querySelector("#mainMenu");

/* När någon klickar på menyknappen */
menuButton.addEventListener("click", function() {

    /* Öppna/stäng menyn */
    mainMenu.hidden = !mainMenu.hidden;

    /* Uppdaterar om menyn är öppen */
    menuButton.setAttribute(
        "aria-expanded", !mainMenu.hidden
    );

    /* Ändrar knappens beskrivning */
    if (mainMenu.hidden) {
        menuButton.setAttribute("aria-label", "Öppna meny");
    } else {
        menuButton.setAttribute("aria-label", "Stäng meny");
    }
})


