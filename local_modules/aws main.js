import { Amplify } from "https://esm.sh/aws-amplify";
import { getCurrentUser, signOut } from "https://esm.sh/@aws-amplify/auth";

// live laugh larp

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_cdZf5ewMs',
      userPoolClientId: '78r1qfg9l38fot8i0nkg838uto',
      loginWith: {
        email: true,
        oauth: {
          domain: 'https://ap-southeast-1cdzf5ewms.auth.ap-southeast-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://127.0.0.1:5500/index.html'],
          redirectSignOut: ['http://127.0.0.1:5500/index.html'],
          responseType: 'code'
        }
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

export async function handleSignOut() {
  try {
    await signOut();
    // The Hub listener we set up earlier will detect this 
    // and you can redirect the user or update the UI there.
    window.location.href = "index.html"; 
  } catch (error) {
    console.error('Error signing out: ', error);
  }
}