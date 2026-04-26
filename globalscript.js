window.addEventListener("load", () => {
    document.querySelectorAll(".container-fit-to-screen").forEach(el => {
        const rect = el.getBoundingClientRect();

        el.style.width = rect.width + "px";
        el.style.height = rect.height + "px";
    });
});