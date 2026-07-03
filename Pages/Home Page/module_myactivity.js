
import { generateUI_ActiveTickets, prompt_RetrieveNewTitleAndDescription, display_Progress, prompt_Confirmation, officiate_dropdown, filter_givenTickets, displayTicketDescription } from "../.././local_modules/ui related.js";
import { getAllMyActiveTickets, getTicketHistory } from "../.././local_modules/aws main.js";
import { fetchAuthSession } from "https://esm.sh/@aws-amplify/auth";
import { post } from "https://esm.sh/aws-amplify/api";
import ApexCharts from 'https://cdn.jsdelivr.net/npm/apexcharts/+esm';


{ // first page
  let debounce_my_activity_activeticketcontainer = false;
  const my_activity_activeticketcontainer = document.getElementById("my_activity_activeticketcontainer");
  const my_activity_activeticket_details = document.getElementById("homepage-myactivity-1-details");



  let currentGeneratedTickets = [];
  async function refreshMyActivityTicketContainer() {
    if (debounce_my_activity_activeticketcontainer) return;
    debounce_my_activity_activeticketcontainer = true;
    
    while (my_activity_activeticketcontainer.firstChild) { // replaceChildren() but this is more tuff
      my_activity_activeticketcontainer.removeChild(my_activity_activeticketcontainer.lastChild);
    }

    const currentTickets = await getAllMyActiveTickets();
    debounce_my_activity_activeticketcontainer = false;
    my_activity_activeticket_details.textContent = "Click on a ticket of yours!";

    currentGeneratedTickets = generateUI_ActiveTickets(my_activity_activeticketcontainer, currentTickets, (card, data) => {
      console.log(data);

      displayTicketDescription(my_activity_activeticket_details, data);
      
      selectedActiveTicket = data;
    });
  }

  document.getElementById("my_activity_activeticketrefresh").addEventListener("click", refreshMyActivityTicketContainer);

  document.getElementById("homepage_myactivity_1_details_edit").addEventListener("click", async () => {
    if (!selectedActiveTicket) return;
    const deepCopy = structuredClone(selectedActiveTicket);
    prompt_RetrieveNewTitleAndDescription(
      deepCopy,
    async (success, newTitle, newDescription) => {
      if (!success) return;

      const successFromRequest = await display_Progress("Submitting your request to edit ticket...", async () => {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString(); 
        const restOperation = post({
          apiName: "Tessera-RestAPI",
          path: "/Tessera-BasicUser-EditMyTicket",
          options: {
            headers: {
              Authorization: token
            },
            body: {
              targetID: deepCopy.ID,
              title: newTitle,
              description: newDescription,

            }
          }
        });
        await restOperation.response;
      });

      if (successFromRequest) {
        refreshMyActivityTicketContainer();
      }
    
    });


  });
  document.getElementById("homepage_myactivity_1_details_remove").addEventListener("click", async () => {
    if (!selectedActiveTicket) return;

    const targetID = selectedActiveTicket.ID;

    prompt_Confirmation("Are you sure you want to archive this ticket? you cannot undo it",
      async (result) => {
        if (!result) return;

        const successFromRequest = await display_Progress("Submitting your request to archive ticket...", async () => {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString(); 
          const restOperation = post({
            apiName: "Tessera-RestAPI",
            path: "/Tessera-BasicUser-ArchiveMyTicket",
            options: {
              headers: {
                Authorization: token
              },
              body: {
                targetID: targetID
              }
            }
          });
          await restOperation.response;
        });

        if (successFromRequest) {
          refreshMyActivityTicketContainer();
        }
      }
    )


  });

  let filtering_SortBy = 0;
  let filtering_searchString = "";
  const search_input = document.querySelector("#my_activity_searchfilter input");
  function updateFiltering() {
    filter_givenTickets(currentGeneratedTickets, {
      sortBy: filtering_SortBy,
      searchString: search_input.value
    });
  }
  officiate_dropdown("Sort By: ", document.getElementById("my_activity_quickfilter"), (selected) => {
    filtering_SortBy = selected;
    updateFiltering();
  });


  document.querySelector("#my_activity_searchfilter button").addEventListener("click", updateFiltering);
  
  await refreshMyActivityTicketContainer();
  updateFiltering();
}


{ // second page
  let debounce_my_ticket_history_container = false;
  const my_ticket_history_container = document.getElementById("my-ticket-history-container");
  const my_ticket_history_details = document.getElementById("ticket-history-details");

  let currentGeneratedTickets = [];
  async function refreshMyTicketHistoryContainer() {
    if (debounce_my_ticket_history_container) return;
    debounce_my_ticket_history_container = true;
    
    while (my_ticket_history_container.firstChild) { // replaceChildren() but this is more tuff
      my_ticket_history_container.removeChild(my_ticket_history_container.lastChild);
    }

    const currentTickets = await getTicketHistory();
    debounce_my_ticket_history_container = false;
    my_ticket_history_details.textContent = "Click on a ticket of yours!";

    currentGeneratedTickets = generateUI_ActiveTickets(my_ticket_history_container, currentTickets, (card, data) => {
      console.log(data);

      displayTicketDescription(my_ticket_history_details, data);

      selectedSingularHistoryTicket = data;
    });
  }
  
  let filtering_SortBy = 0;
  let filtering_searchString = "";
  const search_input = document.querySelector("#my-ticket-history-search input");
  function updateFiltering() {
    filter_givenTickets(currentGeneratedTickets, {
      sortBy: filtering_SortBy,
      searchString: search_input.value
    });
  }
  officiate_dropdown("Sort By: ", document.getElementById("my-ticket-history-quickfilter"), (selected) => {
    filtering_SortBy = selected;
    updateFiltering();
  });
  document.querySelector("#my-ticket-history-search button").addEventListener("click", updateFiltering);
  
  
  document.getElementById("my-ticket-history-refresh").addEventListener("click", refreshMyTicketHistoryContainer);
  await refreshMyTicketHistoryContainer();
  updateFiltering();
}



{ // third page
  const target_container = document.getElementById("my-ticket-history-chart");

  

  const ActiveTickets = await getAllMyActiveTickets();
  const HistoricalTickets = await getTicketHistory();

  const series_active = []
  const series_historical = []

  series_active.length = 0;
  series_historical.length = 0;
  series_active.length = 12;
  series_historical.length = 12;

  const targetYear = 2026;
  for (const indexedActive of ActiveTickets) {
    const dateObj = new Date(indexedActive.timestamp);
    if (dateObj.getFullYear() != targetYear) continue;

    const thisMonth = dateObj.getMonth();
    series_active[thisMonth] = series_active[thisMonth] ? series_active[thisMonth] + 1 : 1
  }
  for (const indexedHistorical of HistoricalTickets) {
    const dateObj = new Date(indexedHistorical.timestamp);
    if (dateObj.getFullYear() != targetYear) continue;
    
    const thisMonth = dateObj.getMonth();
    series_historical[thisMonth] = series_historical[thisMonth] ? series_historical[thisMonth] + 1 : 1
  }
  const barOptions = {
    title: {
      text: `My Ticket Frequency for ${String(targetYear)}` , // Your title text
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
    },
    chart: {
      type: "bar",
      height: 300
    },
    series: [{
      name: "Active",
      data: series_active
    },{
      name: "Historical",
      data: series_historical
    }],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    colors: ["#3498db", "#556169"]
  };

  // Render the Bar Graph
  const barChart = new ApexCharts(target_container, barOptions);
  barChart.render();




}