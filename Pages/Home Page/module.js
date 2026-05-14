import { handleSignOut } from "/local_modules/aws main.js";

// logout
document.getElementById("logout").addEventListener("click", async () => {
  await handleSignOut();
});