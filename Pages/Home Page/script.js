function openPopup(id) {
  document.querySelectorAll(".homepage-individual-panel").forEach(p => {
    p.style.display = "none";
  });

  if (id === "submit_ticket") { // might remove this honestly so that the user can keep doing whatever they're doing
    submitaticketOpenPage("submit_ticket_greetings");
  }

  document.getElementById(id).style.display = "flex";
}

function myactivityOpenPage(id) {
  document.querySelectorAll("#my_activity .homepage-internal-panel-container").forEach(p => {
    p.style.display = "none";
  });

  document.getElementById(id).style.display = "block";
}

function submitaticketOpenPage(id) {
  document.querySelectorAll("#submit_ticket .homepage-internal-panel-container").forEach(p => {
    p.style.display = "none";
  });

  // this is the start of a long if-chain, normally you wouldn't do this, but its less of a hassle on the html side
  if (id === "submit_ticket_review") { 
    document.getElementById("submit_ticket_review_toreview").textContent = document.getElementById("submit_ticket_forum_textarea").value;
  }

  document.getElementById(id).style.display = "block";
}

window.addEventListener("load", () => {
  myactivityOpenPage("my_activity_1");
  submitaticketOpenPage("submit_ticket_greetings");
});

