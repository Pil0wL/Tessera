window.addEventListener("load", () => {
    for (const element of document.querySelectorAll(".container-fit-to-screen")) {
        const rect = element.getBoundingClientRect();

        element.style.width = rect.width + "px";
        element.style.height = rect.height + "px";
    }


    for (const element of document.querySelectorAll(".container-dropdown")) {
        const content = element.querySelector(".container-dropdown-content");

        var toggled = true;
        var toggler = () => {
            toggled = !toggled;
            content.style.display = toggled ? "flex" : "none";
        };

        toggler();
        element.addEventListener("click", toggler);
    }

});

