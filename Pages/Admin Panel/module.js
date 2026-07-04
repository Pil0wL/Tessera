
import { getUserAttributes, delay, getUserRole, _moderator_GetUsers } from "../.././local_modules/aws main.js";
import { officiate_dropdown, generateUI_UserListElement, generateUI_ActiveTickets, displayTicketDescription, filter_givenTickets, prompt_RetrieveNewString, prompt_RetrieveNewInteger, prompt_Message, prompt_Confirmation, display_Progress, formatDate, officiate_chart } from "../.././local_modules/ui related.js";

import { updateUserAttributes, fetchAuthSession } from "https://esm.sh/@aws-amplify/auth";
import { post } from "https://esm.sh/aws-amplify/api";

import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts/+esm';

const { user_presedence, highest_precedence_role } = await getUserRole();

document.getElementById("topbar").textContent = "Getting user info...";
const currentUser = await getUserAttributes();
document.getElementById("topbar").textContent = `${currentUser.preferred_username || "N/A"} - ${highest_precedence_role}`;

if (user_presedence < 2) {
  const admin_only = [
    "UserMaButton",
    "SystemRecButton",
    //"ReportsButton",
    //"SettingsButton"
  ];

  for (const to_enable of admin_only) {
    document.getElementById(to_enable).style.display = "inline-block";
  }
}

const arrayUserFilters = [
  [false, 0],
  [true, 0],
  [false, 1],
  [true, 1],
]

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
    ascending = arrayUserFilters[selected][0];
    indexBy = arrayUserFilters[selected][1];
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

    });
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

    });
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
    );
  });

}


{ // User Management
  const user_management_user_list = document.getElementById("user-management-user-list");
  const user_management_user_information = document.getElementById("user-management-user-information");

  let currentlySelectedUser;
  function clear() {
    currentlySelectedUser = null;
    user_management_user_information.textContent = "Click on a User!";

  }
  let ascending = true;
  let indexBy = 0;
  officiate_dropdown("Sort By: ", document.getElementById("user-management-user-filter"), async (selected) => {
    ascending = arrayUserFilters[selected][0];
    indexBy = arrayUserFilters[selected][1];
    clear();

    let current_users = await _moderator_GetUsers(ascending, indexBy);
    generateUI_UserListElement(user_management_user_list, current_users, async (card, userData) => {
      console.log(userData);
      currentlySelectedUser = userData;

      user_management_user_information.textContent = `
        Full Created Date: ${formatDate(userData.createdAt)}
        \n\nEmail: ${userData.email}
        \n\nID: ${userData.ID}
        \n\nStatus: ${userData.currentStatus}`;
    });

  });


  document.getElementById("user-management-give-moderator").addEventListener("click", async () => {
    if (!currentlySelectedUser) return;

    prompt_Confirmation("Are you sure you want to give this user the moderator role?",
      async (result) => {
        if (!result) return;

        const successFromRequest = await display_Progress("Submitting your request...", async () => {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString();
          const restOperation = post({
            apiName: "Tessera-RestAPI",
            path: "/Privileged/Tessera-Admin-ModifyUser",
            options: {
              headers: {
                Authorization: token
              },
              body: {
                targetID: currentlySelectedUser.ID,
                modificationType: 0,
                data: {}
              }
            }
          });

          await restOperation.response;
        });

        if (successFromRequest) {
          console.log("Give Moderator, Success!");
        }
      }
    );



  });

  document.getElementById("user-management-remove-moderator").addEventListener("click", async () => {
    if (!currentlySelectedUser) return;

    prompt_Confirmation("Are you sure you want to REMOVE the moderator role from this user?",
      async (result) => {
        if (!result) return;

        const successFromRequest = await display_Progress("Submitting your request...", async () => {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString();
          const restOperation = post({
            apiName: "Tessera-RestAPI",
            path: "/Privileged/Tessera-Admin-ModifyUser",
            options: {
              headers: {
                Authorization: token
              },
              body: {
                targetID: currentlySelectedUser.ID,
                modificationType: 1,
                data: {}
              }
            }
          });

          await restOperation.response;
        });

        if (successFromRequest) {
          console.log("Remove Moderator, Success!");
        }
      }
    );



  });
}



{ // system records
  const system_records_list = document.getElementById("system-records-list");
  const system_records_description = document.getElementById("system-records-information");

  function clear() {
    while (system_records_list.firstChild) { // replaceChildren() but this is more tuff
      system_records_list.removeChild(system_records_list.lastChild);
    }

    system_records_description.textContent = "Click on a log!";
  }

  let ascending = true;
  let moderationType = 0;


  const _arrayModerationTypes = ["Ticket", "User"];
  function onClick(moderationLog) {
    console.log(moderationLog);
    system_records_description.textContent = `Moderation Type: ${_arrayModerationTypes[moderationLog.moderationType]}
    \n\nDate: ${formatDate(moderationLog.timestamp)}
    \n\nJSON data: ${JSON.stringify(moderationLog.data)}`;
  }

  async function refreshSystemRecords() {

    let returnedData = [];
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const restOperation = post({
        apiName: "Tessera-RestAPI",
        path: "/Privileged/Tessera-Admin-GetStatistics",
        options: {
          headers: {
            Authorization: token
          },
          body: {
            dataType: 0,
            data: {
              moderationType: moderationType,
              ascending: ascending
              // startKey
            }
          }
        }
      });

      const response = await restOperation.response;
      const responseBody = await response.body.json();
      console.log("get system records, Success!");
      returnedData = responseBody.items.data

    } catch (error) {
      console.error("get system records | ", error.message);
    }
    console.log(returnedData);

    clear();

    for (const moderationLog of returnedData) {
      const card = document.createElement("li");
      card.classList.add("container-ticket");

      // title
      const titleElement = document.createElement("div");
      titleElement.textContent = moderationLog.ID;
      titleElement.classList.add("primary");
      titleElement.style.zIndex = 5;
      card.appendChild(titleElement);

      // border
      const borderElement = document.createElement("div");
      borderElement.classList.add("border");
      borderElement.style.left = "calc(80% - 60px)";
      titleElement.style.zIndex = 5;
      card.appendChild(borderElement);

      // date added
      const dateElement = document.createElement("div");
      dateElement.textContent = moderationLog.timestamp.split("T")[0];
      dateElement.classList.add("secondary");
      dateElement.style.zIndex = 5;
      card.appendChild(dateElement);

      // the actual button
      const buttonElement = document.createElement("button");
      buttonElement.classList.add("container-fit-to-container");
      buttonElement.style.cursor = "pointer";
      buttonElement.style.zIndex = 10;
      buttonElement.addEventListener("click", () => {
        onClick(moderationLog);
      });
      card.appendChild(buttonElement);



      system_records_list.appendChild(card);
    }
  }
  officiate_dropdown("Sort By: ", document.getElementById("system-records-filter1"), async (selected) => {
    if (selected === 0) {
      ascending = false;
    } else {
      ascending = true;
    }

    await refreshSystemRecords();
  });
  officiate_dropdown("Modification Type: ", document.getElementById("system-records-filter2"), async (selected) => {
    moderationType = selected;

    await refreshSystemRecords();
  });
  document.getElementById("system-records-list-refresh").addEventListener("click", refreshSystemRecords);

  { // chart

    const target_container = document.getElementById("system-records-moderation-chart");


    const series_moderations = [];
    const categories = [];

    const barOptions = {
      title: {
        text: `Total Moderation Logs`,
        align: "center",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
      },
      chart: {
        type: "bar",
        height: 300,
        toolbar: {
          show: false
        },
      },
      series: [{
        name: "Total Moderations",
        data: series_moderations
      }],
      xaxis: {
        categories: categories
      },
      colors: ["#3498db", "#556169"]
    };

    async function refresh() {

      series_moderations.length = 0;
      categories.length = 0;

      let returnedData = {};
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        const restOperation = post({
          apiName: "Tessera-RestAPI",
          path: "/Privileged/Tessera-Admin-GetStatistics",
          options: {
            headers: {
              Authorization: token
            },
            body: {
              dataType: 1,
              data: {}
            }
          }
        });

        const response = await restOperation.response;
        const responseBody = await response.body.json();
        console.log("admin statistics, Success!");
        returnedData = responseBody.items.ModificationsByPriveleged

      } catch (error) {
        console.error("admin statistics | ", error.message);
      }
      for (const emailName in returnedData) {
        categories.push(emailName);
        series_moderations.push(returnedData[emailName]);
      }

    }
    officiate_chart(target_container, barOptions, refresh);
  }


}