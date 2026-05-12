

function disableAll() {
  document.querySelectorAll(".admin-category-button").forEach(p => {
    p.style.opacity = "0.5";
  });
  document.querySelectorAll(".admin-container-individual-categorypanel").forEach(p => {
    p.style.display = "none";
  });
}
function switchCategory(id) {
  disableAll();

  document.getElementById(id + "Button").style.opacity = "1.0";
  document.getElementById(id + "Panel").style.display = "flex";
}

window.addEventListener("load", () => {
  disableAll();
});


