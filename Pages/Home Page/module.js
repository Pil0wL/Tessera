import { handleSignOut, getUserRole, changePreferredUsername } from "../.././local_modules/aws main.js";
import { fetchAuthSession } from "https://esm.sh/@aws-amplify/auth";

// logout
document.getElementById("logout").addEventListener("click", async () => {
  await handleSignOut("../.././index.html");
});

  
const Button_GoToAdminPanel = document.getElementById("gotoadminpanel");
Button_GoToAdminPanel.style.display = "none";
const { user_presedence, highest_precedence_role } = await getUserRole();

console.log("user_presedence = ", user_presedence);
if (user_presedence < 5) {
  Button_GoToAdminPanel.style.display = "flex";

  Button_GoToAdminPanel.addEventListener("click", () => {
    window.location.href=".././Admin Panel/Admin Panel.html";
  });
}

changePreferredUsername("Super Cool User");
