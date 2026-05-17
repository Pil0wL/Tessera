import { post } from "https://esm.sh/aws-amplify/api";
import { fetchAuthSession } from "https://esm.sh/aws-amplify/auth";


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
          des: tosend_ticketDescription
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