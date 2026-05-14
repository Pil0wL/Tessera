import { Amplify } from "https://esm.sh/aws-amplify";
import { getCurrentUser, signOut } from "https://esm.sh/@aws-amplify/auth";
import { Hub } from "https://esm.sh/@aws-amplify/core";

// live laugh larp

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-1_cdZf5ewMs",
      userPoolClientId: "78r1qfg9l38fot8i0nkg838uto",
      loginWith: {
        email: true,
        oauth: {
          domain: "ap-southeast-1cdzf5ewms.auth.ap-southeast-1.amazoncognito.com",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: ["https://127.0.0.1:5500/index.html", "https://pil0wl.github.io/Tessera/"],
          redirectSignOut: ["https://127.0.0.1:5500/index.html", "https://pil0wl.github.io/Tessera/"],
          responseType: "code"
        }
      }
    }
  }
});
// */

/*
Hub.listen("auth", ({ payload }) => {
    console.log("Auth Event:", payload.event);
    if (payload.event === "signedIn") {
        alert("Google Login Successful!");
        window.location.href = "./Pages/Home Page/Home Page.html";
    }
    if (payload.event === "signInWithRedirect_failure") {
        console.error("The OAuth flow failed:", payload.data);
    }
    if (payload.event === "signInWithRedirect") {
      console.log("is logged in = ", IsLoggedIn());
    }
    if (payload.event === "customOAuthState") {
      //setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
      console.log("wawa");
    }
});
// */

export async function IsLoggedIn() {
  try {
    const user = await getCurrentUser();
    console.log("User is logged in:", user);
    return user;
  } catch (error) {
    console.log("User is not logged in");
  }
}

export async function handleSignOut(indexpath) {
  try {
    await signOut();
    // The Hub listener we set up earlier will detect this 
    // and you can redirect the user or update the UI there.
    window.location.href = indexpath; 
  } catch (error) {
    console.error('Error signing out: ', error);
  }
}