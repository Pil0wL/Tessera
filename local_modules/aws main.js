import { Amplify } from "https://esm.sh/aws-amplify";
import { fetchAuthSession, getCurrentUser, signOut } from "https://esm.sh/@aws-amplify/auth";
import { post } from "https://esm.sh/aws-amplify/api";
import "https://esm.sh/aws-amplify/auth/enable-oauth-listener";

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
          redirectSignIn: ["http://127.0.0.1:5500/index.html", "https://pil0wl.github.io/Tessera/"],
          redirectSignOut: ["http://127.0.0.1:5500/index.html", "https://pil0wl.github.io/Tessera/"],
          responseType: "code"
        }
      }
    }
  },
  API: {
    REST: {
      "Tessera-RestAPI": { 
        endpoint: "https://msiext399k.execute-api.ap-southeast-1.amazonaws.com/prod",
        region: "ap-southeast-1"
      }
    }
  }
});

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

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let _activeTicketsCache = [];
let _activeTicketsRequestTime = 0;
export async function getAllMyActiveTickets() {
  let toReturn = _activeTicketsCache;

  if (Date.now() < _activeTicketsRequestTime) return toReturn; // debounce
  _activeTicketsRequestTime = Date.now() + 2000; // current date + 2 seconds in milisec

  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString(); 

    const restOperation = post({
    apiName: "Tessera-RestAPI",
    path: "/Tessera-BasicUser-GetMyActiveTickets", // return my pages
    options: {
      headers: {
        Authorization: token
      },
      body: {}
    }});

    const response = await restOperation.response;
    const responseBody = await response.body.json();
    console.log("getAllMyActiveTickets, Success!");

    toReturn = responseBody.items;
  } catch(e) {
    console.log("getAllMyActiveTickets, something happed ( an erro bro ):", e);
  }
  return toReturn;
}

async function checkUserGroups() {
  try {
    const session = await fetchAuthSession();
    const groups = session.tokens.idToken.payload["cognito:groups"] || [];

    if (groups.includes('admin')) {
      console.log("Welcome, Overlord.");
    }

    if (groups.includes('ticket checker')) {
      console.log("Ready to scan some tickets!");
    }
    
    return groups;
  } catch (err) {
    console.error("Error fetching session:", err);
    return [];
  }
}






