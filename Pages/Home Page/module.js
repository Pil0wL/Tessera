import { handleSignOut, getAllMyActiveTickets } from "../.././local_modules/aws main.js";
import { generateUI_ActiveTickets } from "../.././local_modules/ui related.js";

// logout
document.getElementById("logout").addEventListener("click", async () => {
  await handleSignOut("../.././index.html");
});



let debounce_my_activity_activeticketcontainer = false;
const my_activity_activeticketcontainer = document.getElementById("my_activity_activeticketcontainer");
const my_activity_activeticket_details = document.getElementById("homepage-myactivity-1-details");
async function refreshMyActivityTicketContainer() {
  if (debounce_my_activity_activeticketcontainer) return;
  debounce_my_activity_activeticketcontainer = true;

  const currentTickets = await getAllMyActiveTickets();
  debounce_my_activity_activeticketcontainer = false;
  my_activity_activeticket_details.textContent = "Click on a ticket of yours!";

  generateUI_ActiveTickets(my_activity_activeticketcontainer, currentTickets, (card, data) => {
    console.log(data);

    my_activity_activeticket_details.textContent = `Title: ${data.data.ti}
    \n\nDescription: ${data.data.des}
    \n\nDate: ${data.timestamp.split("T")[0]}`;

    selectedActiveTicket = data;
  });
}


refreshMyActivityTicketContainer();