import { signIn, signInWithRedirect } from "https://esm.sh/@aws-amplify/auth";
import { IsLoggedIn } from "./local_modules/aws main.js";

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stops the page from reloading

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("attempting to log in manually...");
    try {
        const { isSignedIn, nextStep } = await signIn({
            username: email,
            password: password,
        });

        if (isSignedIn) {
            alert("Login Successful!");
            location.href = "./Pages/Home Page/Home Page.html";
        } else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
            alert("Please confirm your email first.");
        }
    } catch (error) {
        console.error("Error signing in", error);
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


let logged_in = await IsLoggedIn();
document.getElementById("notloggedin").style.display = logged_in ? "none" : "block";
document.getElementById("loggedin").style.display = logged_in ? "block" : "none";