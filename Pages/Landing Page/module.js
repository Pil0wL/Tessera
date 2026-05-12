import { signIn } from "https://esm.sh/aws-amplify/auth";

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stops the page from reloading

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { isSignedIn, nextStep } = await signIn({
            username: email,
            password: password,
        });

        if (isSignedIn) {
            alert("Login Successful!");
            window.location.href = '/dashboard.html'; // Redirect user
        } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
            alert("Please confirm your email first.");
        }
    } catch (error) {
        console.error('Error signing in', error);
        alert(error.message); // Show error (e.g., "Incorrect password")
    }
});