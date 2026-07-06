import { handleSignOut, getUserRole, changePreferredUsername, getUserAttributes } from "../.././local_modules/aws main.js";
import { fetchAuthSession } from "https://esm.sh/@aws-amplify/auth";
import { post } from "https://esm.sh/aws-amplify/api";

// logout
document.getElementById("logout").addEventListener("click", async () => {
  await handleSignOut("../.././index.html");
});


const Button_GoToAdminPanel = document.getElementById("gotoadminpanel");
Button_GoToAdminPanel.style.display = "none";
const { user_presedence, highest_precedence_role } = await getUserRole();
const currentUser = await getUserAttributes();

document.getElementById("welcome-message").textContent = `Welcome to Tessera! ${currentUser.email}`;



console.log("user_presedence = ", user_presedence);
if (user_presedence < 5) {
  Button_GoToAdminPanel.style.display = "flex";

  Button_GoToAdminPanel.addEventListener("click", () => {
    window.location.href = ".././Admin Panel/Admin Panel.html";
  });
}

changePreferredUsername("Super Cool User");

try {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  const restOperation = post({
    apiName: "Tessera-RestAPI",
    path: "/Statistics/Tessera-BasicUser-LogActivity",
    options: {
      headers: {
        Authorization: token
      },
      body: {}
    }
  });

  const response = await restOperation.response;
  console.log("Statistics | Successfully logged activity!", await response.body.json());
} catch (error) {
  console.error("Statistics | Failed to log activity", error.message);
}


