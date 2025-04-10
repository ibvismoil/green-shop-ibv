
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNWvX9gVEI-fbtd8AhKLMmZBUm5SAIBHA",
  authDomain: "green-shop-ibv.firebaseapp.com",
  projectId: "green-shop-ibv",
  storageBucket: "green-shop-ibv.firebasestorage.app",
  messagingSenderId: "113934630731",
  appId: "1:113934630731:web:7353032e97f944fb86b2ce",
  measurementId: "G-7NXSCG4492"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export { signInWithGoogle };
