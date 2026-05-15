import { post } from "https://esm.sh/aws-amplify/api";
import { fetchAuthSession } from "https://esm.sh/aws-amplify/auth";

document.getElementById("button_submit_ticket_review_3").addEventListener("click", async () => {
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
          id: 'ticket-123', // Your Partition Key
          type: 'VIP',      // Your Sort Key (if applicable)
          status: 'active'
        }
      }
    });

    const response = await restOperation.response;
    console.log('Success!', await response.body.json());
  } catch (e) {
    console.error('Post failed', e);
  }
});