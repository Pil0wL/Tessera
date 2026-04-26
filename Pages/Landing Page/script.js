function openPopup(id) {
  document.querySelectorAll(".homepage-individual-panel").forEach(p => {
    p.style.display = "none";
  });

  document.getElementById(id).style.display = "flex";
}

function myactivityOpenPage(id) {
  document.querySelectorAll(".homepage-myactivity-container").forEach(p => {
    p.style.display = "none";
  });

  document.getElementById(id).style.display = "flex";
}

window.addEventListener("load", () => {
  myactivityOpenPage("my_activity_1");
});
