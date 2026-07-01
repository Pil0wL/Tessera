
import { getUserAttributes, delay, getUserRole } from "../.././local_modules/aws main.js";
import { updateUserAttributes } from "https://esm.sh/@aws-amplify/auth";


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