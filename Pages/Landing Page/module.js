
import { getUser, delay } from "../.././local_modules/aws main.js";
import { signIn, signInWithRedirect, fetchAuthSession } from "https://esm.sh/aws-amplify/auth";
import { post } from "https://esm.sh/aws-amplify/api";


const guestPrompt = document.getElementById("notloggedin");
const alreadyLoggedInPrompt = document.getElementById("loggedin");

guestPrompt.style.display = "none";
alreadyLoggedInPrompt.style.display = "none";

async function attemptCreationDatabaseEntry() {
    let currentUser = await getUser();
    if (!currentUser) {
        return false; // no user is logged in; is a guest
    }
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString(); 
        const restOperation = post({
            apiName: "Tessera-RestAPI",
            path: "/Tessera-CreateUserDataEntry",
            options: {
                headers: {
                    Authorization: token
                },
                body: {}
            }
        });

        const response = await restOperation.response;
        console.log("Successfully checked if the user has a data base entry or not!");

        guestPrompt.style.display = "none";
        alreadyLoggedInPrompt.style.display = "block";
        return true;
    } catch (error) {
        console.error("database entry verification error:", error.message, "if it says its a network error, try checking the lambda to see if something crashed it");
        return false;
    }

    
}
let checking_if_created = await attemptCreationDatabaseEntry();
if (!checking_if_created) {
    guestPrompt.style.display = "block";
}


const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stops the page from reloading

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("attempting to log in manually...");
    try {
        console.log("1");
        const { isSignedIn, nextStep } = await signIn({
            username: email,
            password: password,
        });
        console.log("2");

        if (isSignedIn) {
            alert("Login Successful!");
            attemptCreationDatabaseEntry();
        } else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
            alert("Please confirm your email first.");
        }
    } catch (error) {
        console.error("Error signing in: ", error);
        alert("Login error: " + error.message);
    }
});

const googleBtn = document.getElementById("googlelogin");

googleBtn.addEventListener("click", async () => {
    console.log("Loggin in with google...");
    try {
        // This redirects the entire page to the Google/Cognito login screen
        await signInWithRedirect({ provider: "Google" });
    } catch (error) {
        console.error("Error starting Google login", error);
    }
});
