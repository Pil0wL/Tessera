
import { getUserAttributes, delay, getUserRole, _moderator_GetUsers } from "../.././local_modules/aws main.js";
import { officiate_dropdown, generateUI_UserListElement, generateUI_ActiveTickets, displayTicketDescription, filter_givenTickets, prompt_RetrieveNewString, prompt_RetrieveNewInteger, prompt_Message, prompt_Confirmation, display_Progress } from "../.././local_modules/ui related.js";

import { updateUserAttributes, fetchAuthSession } from "https://esm.sh/@aws-amplify/auth";
import { post } from "https://esm.sh/aws-amplify/api";

const { user_presedence, highest_precedence_role } = await getUserRole();

document.getElementById("topbar").textContent = "Getting user info...";
const currentUser = await getUserAttributes();
document.getElementById("topbar").textContent = `${currentUser.preferred_username || "N/A"} - ${highest_precedence_role}`;

if (user_presedence < 2) {
  const admin_only = [
    "UserMaButton",
    "SystemRecButton",
    "ReportsButton",
    "SettingsButton"
  ];

  for (const to_enable of admin_only) {
    document.getElementById(to_enable).style.display = "inline-block";
  }
}


{ // Pending Tickets
  const pending_tickets_user_list = document.getElementById("pending-tickets-user-list");
  const pending_tickets_user_active_tickets = document.getElementById("pending-tickets-active-tickets");
  const pending_tickets_user_description = document.getElementById("pending-tickets-description");

  let currentGeneratedTickets = [];
  let currentlySelectedTicket = null;
  let currentlySelectedUserID = null;
  function clearActiveTickets() {
    while (pending_tickets_user_active_tickets.firstChild) { // replaceChildren() but this is more tuff
      pending_tickets_user_active_tickets.removeChild(pending_tickets_user_active_tickets.lastChild);
    }
    currentGeneratedTickets = [];
    pending_tickets_user_description.textContent = "Click on a ticket!";

    currentlySelectedTicket = null;
  }



  let filtering_SortBy = 0;
  const search_input = document.querySelector("#pending-tickets-active-search input");
  function updateFiltering() {
    filter_givenTickets(currentGeneratedTickets, {
      sortBy: filtering_SortBy,
      searchString: search_input.value
    });
  }
  officiate_dropdown("Sort By: ", document.getElementById("pending-tickets-active-filter1"), (selected) => {
    filtering_SortBy = selected;
    updateFiltering();
  });
  document.querySelector("#pending-tickets-active-search button").addEventListener("click", updateFiltering);



  let onClick_debounce = false;
  async function onClick(card, userData) {
    if (onClick_debounce) return;
    onClick_debounce = true
    clearActiveTickets();

    console.log(userData.ID);
    let currentTickets = [];
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const restOperation = post({
        apiName: "Tessera-RestAPI",
        path: "/Privileged/Tessera-Moderator-GetTicketsOfUser",
        options: {
          headers: {
            Authorization: token
          },
          body: {
            targetUserID: userData.ID
          }
        }
      });

      const response = await restOperation.response;
      const responseBody = await response.body.json();
      console.log("GetTicketsOfUser, Success!");

      currentTickets = responseBody.items;
    } catch (error) {
      console.error("GetTicketsOfUser | ", error.message);
    }

    onClick_debounce = false;
    currentlySelectedUserID = userData.ID;

    currentGeneratedTickets = generateUI_ActiveTickets(pending_tickets_user_active_tickets, currentTickets, (card, data) => {
      displayTicketDescription(pending_tickets_user_description, data);
      currentlySelectedTicket = data;
    });

    updateFiltering();

  }



  let ascending = true;
  let indexBy = 0;
  officiate_dropdown("Sort By: ", document.getElementById("pending-tickets-user-filter"), async (selected) => {
    switch (selected) {

      case 0:
        ascending = false;
        indexBy = 0;
        break;

      case 1:
        ascending = true;
        indexBy = 0;
        break;

      case 2:
        ascending = false;
        indexBy = 1;
        break;

      case 3:
        ascending = true;
        indexBy = 1;
        break;

    }
    clearActiveTickets();

    let current_users = await _moderator_GetUsers(ascending, indexBy);
    generateUI_UserListElement(pending_tickets_user_list, current_users, onClick);

  });

  document.getElementById("pending-tickets-note").addEventListener("click", async () => {
    if (!currentlySelectedTicket) return;
    prompt_RetrieveNewString("Note Contents", async (success, newString) => {
      if (!success) return;


      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        const restOperation = post({
          apiName: "Tessera-RestAPI",
          path: "/Privileged/Tessera-Moderator-ModifyTicket",
          options: {
            headers: {
              Authorization: token
            },
            body: {
              targetID: currentlySelectedTicket.ID,
              modificationType: 0,
              data: {
                note: newString
              }
            }
          }
        });
        const response = await restOperation.response;
        const responseBody = await response.body.json();

        console.log("Pending Tickets, Note, Success!");
      } catch (error) {
        console.error("Pending Tickets, Note | ", error.message);
      }

    })
  });
  document.getElementById("pending-tickets-set-status").addEventListener("click", async () => {
    if (!currentlySelectedTicket) return;


    prompt_RetrieveNewInteger("0 = active, 1 = pending, 2 = closed", async (success, newInteger) => {
      if (!success) return;
      if (newInteger < 0 || newInteger > 2) {
        prompt_Message("Error", "Out of range", () => { });
        return;
      }


      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        const restOperation = post({
          apiName: "Tessera-RestAPI",
          path: "/Privileged/Tessera-Moderator-ModifyTicket",
          options: {
            headers: {
              Authorization: token
            },
            body: {
              targetID: currentlySelectedTicket.ID,
              modificationType: 1,
              data: {
                state: newInteger
              }
            }
          }
        });
        const response = await restOperation.response;
        const responseBody = await response.body.json();

        console.log("Pending Tickets, Change State | Success!");
      } catch (error) {
        console.error("Pending Tickets, Change State | ", error.message);
      }

    })
  });
  document.getElementById("pending-tickets-archive").addEventListener("click", async () => {
    if (!currentlySelectedTicket || !currentlySelectedUserID) return;

    prompt_Confirmation("Are you sure you want to archive this ticket? you cannot undo it",
      async (result) => {
        if (!result) return;

        const successFromRequest = await display_Progress("Submitting your request to archive ticket...", async () => {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString();
          const restOperation = post({
            apiName: "Tessera-RestAPI",
            path: "/Privileged/Tessera-Moderator-ModifyTicket",
            options: {
              headers: {
                Authorization: token
              },
              body: {
                targetID: currentlySelectedTicket.ID,
                modificationType: 2,
                data: {
                  userId: currentlySelectedUserID
                }
              }
            }
          });

          await restOperation.response;
        });
      }
    )
  });

}