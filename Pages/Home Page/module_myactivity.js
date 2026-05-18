
import { prompt_RetrieveNewTitleAndDescription } from "../.././local_modules/ui related.js";


document.getElementById("homepage_myactivity_1_details_edit").addEventListener("click", async () => {
  if (!selectedActiveTicket) return;
  prompt_RetrieveNewTitleAndDescription(
    selectedActiveTicket.data.ti, 
    selectedActiveTicket.data.des, 
  async (success, newTitle, newDescription) => {

  });
});