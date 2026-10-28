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

const errorList = document.querySelector("#errorlist");
const bookingSection = document.querySelector("#bookings");

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

            /* Kontrollerar veckodagen och öppettiderna */
            const day = selectedDate.getDay();
            if (day === 0) {
                errors.push("Salongen är stängd på söndagar.");
            } else if (day === 5) {
                errors.push("Vi har inga bokningstider på fredagar.");
            } else if (day === 6) {

                /* Lördag: öppet 10.00–15.00 */
                if (
                    timeInput.value !== "" &&
                    (Number(timeInput.value.split(":")[0]) < 10 ||
                    Number(timeInput.value.split(":")[0]) >= 15)
                ) {
                    errors.push("På lördagar kan du boka mellan 10.00 och 14.00.");
                }
            } else if (day === 1) {

                /* Måndag: öppet 9.00–19.00 */
                if (
                    timeInput.value !== "" &&
                    (Number(timeInput.value.split(":")[0]) < 9 ||
                    Number(timeInput.value.split(":")[0]) >= 19)
                ) {
                    errors.push("På måndagar kan du boka mellan 9.00 och 18.00.");
                }
            } else {
                /* Tisdag–torsdag: öppet 9.00–17.00 */
                if (
                    timeInput.value !== "" &&
                    (Number(timeInput.value.split(":")[0]) < 9 ||
                    Number(timeInput.value.split(":")[0]) >= 17)
                ) {
                    errors.push("Tisdag–torsdag kan du boka mellan 9.00 och 16.00.");
                }
            }
        }

        /* Kollar att en tid har valts */
        if (timeInput.value === "") {
            errors.push("Du måste välja en tid.");
        }

        /* Visa felmeddelanden */
        displayErrors();

        /* "Return true" om det inte finns några fel */
        return errors.length === 0;
    }

    /* Visar felmeddelanden på sidan */
    function displayErrors() {
        /* Tar bort förra felmeddelanden */
        errorList.innerHTML = "";

        /* Lägger alla fel i en lista */
        errors.forEach(function(error) {
            const listItem = document.createElement("li");
            listItem.textContent = error;
            errorList.appendChild(listItem)
        });
    }

    /* Skapar en bokningen utifrån formuläret */
    function createBooking() {
        /* Skapar ett objekt med kundens information */
        const booking = {
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            date: dateInput.value.trim,
            time: timeInput.value.trim
        };

        /* Kontrollerar om tiden är redan bokad */
        const alreadyExists = booking.some(function(savedBooking) {
            return (
                savedBooking.date === booking.date &&
                savedBooking.time === booking.time
            );
        });

        if (alreadyExists) {
            errors.push("Den här tiden är redan bokad. Välj en annan tid.");
            displayErrors();
            return;
        }

        /* Lägg till bokningen på början av arrayen */
        bookings.unshift(booking);

        /* Sparar och visar bokningarna */
        saveBookings();
        renderBookings();

        /* Rensar formuläret efter en bokning */
        form.reset();

        /* Tar bort tidigare felmeddelanden */
        errors = [];
        displayErrors();
    }
}
