import firebase from "./config";

const facebookProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/user.birthday.read");
googleProvider.addScope("https://www.googleapis.com/auth/user.gender.read");
googleProvider.addScope(
  "https://www.googleapis.com/auth/user.phonenumbers.read"
);
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");


export { googleProvider, facebookProvider };

// export const twitterProvider = new firebase.auth.TwitterAuthProvider().('https://www.googleapis.com/auth/userinfo.profile');
