
import { generateUI_ActiveTickets, prompt_RetrieveNewTitleAndDescription, display_Progress } from "../.././local_modules/ui related.js";
import { getAllMyActiveTickets } from "../.././local_modules/aws main.js";
import { fetchAuthSession } from "https://esm.sh/@aws-amplify/auth";
import { post } from "https://esm.sh/aws-amplify/api";




let debounce_my_activity_activeticketcontainer = false;
const my_activity_activeticketcontainer = document.getElementById("my_activity_activeticketcontainer");
const my_activity_activeticket_details = document.getElementById("homepage-myactivity-1-details");
async function refreshMyActivityTicketContainer() {
  if (debounce_my_activity_activeticketcontainer) return;
  debounce_my_activity_activeticketcontainer = true;
  
  while (my_activity_activeticketcontainer.firstChild) { // replaceChildren() but this is more tuff
    my_activity_activeticketcontainer.removeChild(my_activity_activeticketcontainer.lastChild);
  }

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


document.getElementById("my_activity_activeticketrefresh").addEventListener("click", refreshMyActivityTicketContainer);
refreshMyActivityTicketContainer();


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
    });

    if (successFromRequest) {
      refreshMyActivityTicketContainer();
    }
  
  });


});
