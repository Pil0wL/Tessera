

function disableAll() {
  document.querySelectorAll(".admin-category-button").forEach(p => {
    p.style.opacity = "0.5";
    p.style.zIndex = 1;
  });
  document.querySelectorAll(".admin-container-individual-categorypanel").forEach(p => {
    p.style.display = "none";
  });
}
function switchCategory(id) {
  disableAll();
  let thisButton = document.getElementById(id + "Button");
  thisButton.style.opacity = "1.0";
  thisButton.style.zIndex = 5;
  document.getElementById(id + "Panel").style.display = "flex";
}



const disable_by_default = [
  "UserMaButton",
  "SystemRecButton",
  //"ReportsButton",
  //"SettingsButton"
];
for (const id_to_disable of disable_by_default) {
  document.getElementById(id_to_disable).style.display = "none";
}


window.addEventListener("load", () => {
  disableAll();




  const to_link = {
    OverviewButton: "Overview",
    PendingTicketsButton: "PendingTickets",
    UserMaButton: "UserMa",
    SystemRecButton: "SystemRec",
    //ReportsButton: "Reports",
    //SettingsButton: "Settings",
  };

  for (const key in to_link) {
    document.getElementById(key).addEventListener("click", () => {
      switchCategory(to_link[key]);
    });
  }


  
});


