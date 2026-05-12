import { Amplify } from "https://esm.sh/aws-amplify";
import { getCurrentUser } from "https://esm.sh/@aws-amplify/auth";

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