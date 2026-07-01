import { Amplify } from "https://esm.sh/aws-amplify";
import { fetchAuthSession, getCurrentUser, signOut, fetchUserAttributes, updateUserAttributes } from "https://esm.sh/@aws-amplify/auth";
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
          scopes: ["openid", "email", "profile", "aws.cognito.signin.user.admin"],
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

export async function getUser() {
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

    _activeTicketsCache = responseBody.items;
    toReturn = _activeTicketsCache;
  } catch(e) {
    console.log("getAllMyActiveTickets, something happed ( an erro bro ):", e);
  }
  return toReturn;
}

let _historyTicketsCache = [];
let _historyTicketsRequestTime = 0;
export async function getTicketHistory() {
  let toReturn = _historyTicketsCache;

  if (Date.now() < _historyTicketsRequestTime) return toReturn; // debounce
  _historyTicketsRequestTime = Date.now() + 2000; // current date + 2 seconds in milisec

  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString(); 

    const restOperation = post({
    apiName: "Tessera-RestAPI",
    path: "/Tessera-BasicUser-GetMyTicketHistory", // return my pages
    options: {
      headers: {
        Authorization: token
      },
      body: {}
    }});

    const response = await restOperation.response;
    const responseBody = await response.body.json();
    console.log("GetMyTicketHistory, Success!");

    _historyTicketsCache = responseBody.items;
    toReturn = _historyTicketsCache;
  } catch(e) {
    console.log("GetMyTicketHistory, something happed ( an erro bro ):", e);
  }
  return toReturn;
}


export async function getUserRole() {
  const defaultRetry_ms = 1000;
  const rolePresedenceConverter = {
    Admin: 1,
    Moderator: 2,
  }

  let running = true;


  let user_presedence = 10;
  let highest_precedence_role = "N/A";

  while (running) {
    try {
      const session = await fetchAuthSession();
      
      if (!session.tokens?.idToken) { // user is not logged in
        running = false;
        continue;
      }
      const groups = session.tokens.idToken.payload["cognito:groups"] || [];
      
      for (const thisRole of groups) {
        const thisPresedence = rolePresedenceConverter[thisRole];
        if (!thisPresedence) continue;

        if (thisPresedence < user_presedence) {
          user_presedence = thisPresedence;
          highest_precedence_role = thisRole;
        }
      }

      
      
      running = false;
    } catch (error) {
      console.warn("getUserRole() | Attempt failed fetching auth session:", error);
      
      // If we have retries left, wait and try again
      console.log(`getUserRole() | Retrying in ${defaultRetry_ms}ms...`);
      await delay(defaultRetry_ms);
    }
  }

  return {
    user_presedence: user_presedence,
    highest_precedence_role: highest_precedence_role
  };
}


export async function getUserAttributes() {
  try {
    const attributes = await fetchUserAttributes();
    console.log("Retrieved user attributes:", attributes);

    return attributes;
  } catch (error) {
    console.error("Error when fetching attributes: ", error);
    return null;
  }
}


export async function changePreferredUsername(newUsername) {
  try {
    const result = await updateUserAttributes({
      userAttributes: {
        preferred_username: newUsername
      }
    });

    console.log("Update result:", result);
    
  } catch (error) {
    console.error("Error updating preferred username:", error);
  }
}