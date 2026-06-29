window.addEventListener("load", () => {
    for (const element of document.querySelectorAll(".container-fit-to-screen")) {
        const rect = element.getBoundingClientRect();

        element.style.width = rect.width + "px";
        element.style.height = rect.height + "px";
    }


});

