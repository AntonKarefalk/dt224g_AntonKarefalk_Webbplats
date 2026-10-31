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
            date: dateInput.value.trim(),
            time: timeInput.value.trim()
        };

        /* Kontrollerar om tiden är redan bokad */
        const alreadyExists = bookings.some(function(savedBooking) {
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

    /* Sparar bokningarna i localStorage */
    function saveBookings() {
        /* Gör om arrayen till en JSON sträng */
        localStorage.setItem("salonBookings", JSON.stringify(bookings));
    }

    /* Läser in tidigare bokningar */
    function loadBookings() {
        /* Hämtar dem sparade bokningarna */
        const savedBookings = localStorage.getItem("salonBookings");

        if (savedBookings !== null) {
            try {
                /* Gör om JSON strängen till JavaScript */
                const savedData = JSON.parse(savedBookings);

                /* Kollar om informationen är en array */
                if (Array.isArray(savedData)) {
                    bookings = savedData.filter(function(booking) {
                        return booking !== null &&
                        typeof booking === "object" &&
                        typeof booking.fullname === "string" &&
                        typeof booking.email === "string" &&
                        typeof booking.phone === "string" &&
                        typeof booking.date === "string" &&
                        typeof booking.time === "string";
                    });
                } else {
                    bookings = [];
                }
            } catch (error) {
                /* Använder en tom array om informationen inte fungerar */
                bookings = [];
            }
        }

        /* Visar bokningarna */
        renderBookings();
    }

    /* Visar alla bokningar */
    function renderBookings() {
        /* Tar bort gamla visade bokningar */
        bookingSection.innerHTML = "";

        /* Felmeddelande om det inte finns några bokningar */
        if (bookings.length === 0) {
            bookingSection.textContent = "Inga bokningar ännu.";
        }

        /* Går igenom alla bokningar */
        bookings.forEach(function(booking) {
            /* Skapar ett element för bokningen */
            const card = document.createElement("div");

            /* Visar användarens namn */
            const name = document.createElement("p");
            name.textContent = "Namn: " + booking.fullname;

            /* Visar datumet */
            const date = document.createElement("p");
            date.textContent = "Datum: " + booking.date;

            /* Visar tiden */
            const time  = document.createElement("p");
            time.textContent = "Tid: " + booking.time;

            /* Lägger till informationen i bokningen */
            card.appendChild(name);
            card.appendChild(date);
            card.appendChild(time);

            /* Lägger en linje för att seperera bokningarna */
            const divider = document.createElement("hr");
            card.appendChild(divider);

            /* Lägger till bokningen på sidan */
            bookingSection.appendChild(card);
        });
    }

    /* Eventlyssnaren */
    form.addEventListener("submit", function(event) {
        /* Stoppar sidan att laddas om */
        event.preventDefault();

        /* Skapar en bokning om allt fungerar */
        if (validateForm()) {
            createBooking();
        }
    });

    /* När sidan laddas om så kommer de gamla bokningarna att visas */
    loadBookings();
}
