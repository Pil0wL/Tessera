import { signUp, confirmSignUp } from "https://esm.sh/aws-amplify/auth";

const signupForm = document.getElementById("signupForm");

function toggleVerificationContainer(value) {
  document.getElementById("main-registration-container").style.display = value ? "none" : "block";
  document.getElementById("verification-container").style.display = value ? "block" : "none";
}

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
            username: email,
            password: password,
            options: {
                userAttributes: {
                    email: email,
                    preferred_username: email,
                    name: email
                }
            }
        });

        console.log("Sign up success:", userId);
        
        toggleVerificationContainer(true);

    } catch (error) {
        console.error("Error signing up", error);
        alert(error.message);
    }
});


// email verification
const confirmForm = document.getElementById("confirmForm");
confirmForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const code = document.getElementById("verification-input").value;

    try {
        const { isSignUpComplete } = await confirmSignUp({
            username: email,
            confirmationCode: code
        });

        if (isSignUpComplete) {
            alert("Verification successful! You can now log in.");

            location.href = "index.html";
        }
    } catch (error) {
        console.error("Error confirming sign up", error);
        alert(error.message);
    }
});

toggleVerificationContainer(false);