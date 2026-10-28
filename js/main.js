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
});

/* Bokningsystemet */
/* element */
const form = document.querySelector("#bookingform");
const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");

const = document.querySelector("#errorlist");
const = document.querySelector("#bookings");

/* Arrayen för felmeddelanden */
let errors = [];

/* Array för bokningar */
let bookings = [];

/* Kollar att bokningsformuläret finns innan den kör koden */
if (form !== null) {
    form.noValidate = true;

    /* Gör så att man får bara välja ett datum i framtid, inte tidigare */
    dateInput.min = new Date().toLocaleDateString("sv-SE");

    function validateForm() {
        /* Tar bort tidigare felmeddelanden */
        errors = [];

        /* Kollar om namnet är infyllt */
        if (fullnameInput.value.trim() === "") {
            errors.push("Du måste fylla i ditt namn.");
        }

        /* Kollar om e-posten är infyllt */
        if (emailInput.value.trim() === "") {
            errors.push("Du måste fylla i din e-post.");
        }

        /* Kollar om telefonnumret är infyllt */
        if (phoneInput.value.trim() === "") {
            errors.push("Du måste fylla i ditt telefonnummer.");
        }

        /* Kollar om ett datum har valts */
        if (dateInput.value.trim() === "") {
            errors.push("Du måste välja rätt datum.");
        } else {
            const selectedDate = new Date(dateInput.value + "T12:00:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            /* Kollar om datumet har redan gått */
            if (selectedDate < today) {
                errors.push("Du får inte boka ett datum som har passerat.");
            }
        }

    }
}
