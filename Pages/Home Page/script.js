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

let tosend_ticketDescription;
function submitaticketOpenPage(id) {
  document.querySelectorAll("#submit_ticket .homepage-internal-panel-container").forEach(p => {
    p.style.display = "none";
  });

  // this is the start of a long if-chain, normally you wouldn't do this, but its less of a hassle on the html side
  if (id === "submit_ticket_review") { 
    const writtenText = document.getElementById("submit_ticket_forum_textarea").value;
    document.getElementById("submit_ticket_review_toreview").textContent = writtenText;
    tosend_ticketDescription = writtenText;
  }

  document.getElementById(id).style.display = "block";
}
function submitaticketConfirmationPage(success, error_message) { // aint this bittersweet
  submitaticketOpenPage("submit_ticket_confirmation")

  const successScreen = document.getElementById("submit_ticket_confirmation_success");
  const errorScreen = document.getElementById("submit_ticket_confirmation_error");
  successScreen.style.display = "none";
  errorScreen.style.display = "none";
  if (success) {
    successScreen.style.display = "block";
  } else {
    errorScreen.textContent = "Error: " + error_message;
    errorScreen.style.display = "block";
  }
  
}


window.addEventListener("load", () => {
  myactivityOpenPage("my_activity_1");
  submitaticketOpenPage("submit_ticket_greetings");

  { // quick access button links
    const to_link = [
      "my_activity",
      "submit_ticket",
      "messages",
      "my_account"
    ];

    for (const this_id of to_link) {
      document.getElementById("popup_" + this_id).addEventListener("click", () => {
        openPopup(this_id);
      });
    }
    document.getElementById("gotoadminpanel").addEventListener("click", () => {
      window.location.href=".././Admin Panel/Admin Panel.html";
    });
  }

  { // my activity button links
    for (let i = 1; i < 4; i++) {
      const stringedNum = String(i)
      document.getElementById("my_activity_button_" + stringedNum).addEventListener("click", () => {
        myactivityOpenPage("my_activity_" + stringedNum);
      });
    }
  }

  { // submit a ticket
    const to_link = {
      button_submit_ticket_greetings: "submit_ticket_forum",
      button_submit_ticket_forum: "submit_ticket_review",

      // atp i am contemplating about jst using class identifiers
      button_submit_ticket_review_1: "submit_ticket_forum",
      button_submit_ticket_review_2: "submit_ticket_greetings",
      //button_submit_ticket_review_3: "submit_ticket_confirmation", // is now handled by module_submitticket.js

      button_submit_ticket_confirmation: "submit_ticket_greetings"
    };

    for (const key in to_link) {
      document.getElementById(key).addEventListener("click", () => {
        submitaticketOpenPage(to_link[key]);
      });
    }
  }
});

