import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwxyosx7GnNGVYxeZyHhJH-KNjo3-UQfA",
  authDomain: "instaxpert.firebaseapp.com",
  projectId: "instaxpert",
  storageBucket: "instaxpert.appspot.com",
  messagingSenderId: "851631088009",
  appId: "1:851631088009:web:f13854e2aeef0dea4c4158"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in: ", result);
    return result;
  } catch (error) {
    console.error("Error during Google sign-in: ", error);
  }
};

export const signInWithFacebookPopup = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log("User signed in with Facebook: ", result);
    return result;
  } catch (error) {
    console.error("Error during Facebook sign-in: ", error);
  }
};
