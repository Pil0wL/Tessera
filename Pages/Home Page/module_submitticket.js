import { post } from "https://esm.sh/aws-amplify/api";
import { fetchAuthSession } from "https://esm.sh/aws-amplify/auth";
import { getAllMyActiveTickets } from "../.././local_modules/aws main.js";
import { generateUI_ActiveTickets, prompt_Message, officiate_dropdown } from "../.././local_modules/ui related.js";



{ // first page
  let debounce = false;
  const target_container = document.getElementById("submit_ticket_active_tickets");

  async function refreshMyActivityTicketContainer() {
    if (debounce) return;
    debounce = true;
    
    while (target_container.firstChild) { // replaceChildren() but this is more tuff
      target_container.removeChild(target_container.lastChild);
    }

    const currentTickets = await getAllMyActiveTickets();
    generateUI_ActiveTickets(target_container, currentTickets, (card, data) => {});
    debounce = false;
  }

  await refreshMyActivityTicketContainer();
}


let tosend_ticketDescription;
let tosend_ticketTitle;
let tosend_category;
{ // second page

  const textarea_description = document.getElementById("submit_ticket_forum_textarea");
  const input_title = document.getElementById("submit_ticket_forum_title");

  const thirdpage_description = document.getElementById("submit_ticket_review_toreview_description");
  const thirdpage_title = document.getElementById("submit_ticket_review_toreview_title");
  const thirdpage_category = document.getElementById("submit_ticket_review_toreview_category");

  officiate_dropdown("Category: ", document.getElementById("submit_ticket_forum_category"), (selected) => {
    tosend_category = selected;
  });

  const forReviewButton = document.getElementById("button_submit_ticket_forum");
  forReviewButton.addEventListener("click", () => {


    const writtenText = textarea_description.value;
    if (writtenText.length > 300) {
      prompt_Message("Warning", "Description cannot exceed 300 characters", () => {});
      return
    }

    const writtenTitle = input_title.value;
    if (writtenTitle.length > 20) {
      prompt_Message("Warning", "Title cannot exceed 20 characters", () => {});
      return
    }

    const categoryConverter = [ // in conjunction with the local module, ui related.js
      "Technical",
      "Network",
      "Human Resource"
    ];
    

    thirdpage_description.textContent = writtenText;
    thirdpage_title.textContent = writtenTitle;
    thirdpage_category.textContent = "Category: " + categoryConverter[tosend_category];
    tosend_ticketDescription = writtenText;
    tosend_ticketTitle = writtenTitle
    submitaticketOpenPage("submit_ticket_review");

  });



}

function submitaticketConfirmationPage(success, error_message) { // aint this bittersweet
  submitaticketOpenPage("submit_ticket_confirmation");

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

const submitATicketButton = document.getElementById("button_submit_ticket_review_3");
const submitATicketButton_spinner = document.getElementById("button_submit_ticket_review_3_loading");
submitATicketButton.addEventListener("click", async () => {
  console.log("tosend_ticketDescription = ", tosend_ticketDescription);

  submitATicketButton.style.display = "flex";
  submitATicketButton_spinner.style.display = "block";
  
  try {

    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString(); 
    
    const restOperation = post({
      apiName: "Tessera-RestAPI",
      path: "/BasicUser-SubmitTicket",
      options: {
        headers: {
          Authorization: token
        },
        body: {
          description: tosend_ticketDescription,
          title: tosend_ticketTitle,
          category: tosend_category
        }
      }
    });

    const response = await restOperation.response;
    console.log("Success!", await response.body.json());
    submitaticketConfirmationPage(true, "");
  } catch (e) {
    console.error("Ticket Submission Fail: ", e);
    submitaticketConfirmationPage(false, e);
  }

  submitATicketButton.style.display = "flex";
  submitATicketButton_spinner.style.display = "none";
});

