"use strict";

/* Burger menyn */
const menuBTN = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuBTN.addEventListener("click", function(){
    if(menu.classList.contains("open")){
        menu.classList.remove("open")
    } else {
        menu.classList.add("open")
    }
})


