import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADpidmY-mZnNSoPeqNDikFc-biVIS510Q",
  authDomain: "tripfinder-d9408.firebaseapp.com",
  projectId: "tripfinder-d9408",
  storageBucket: "tripfinder-d9408.firebasestorage.app",
  messagingSenderId: "514094282421",
  appId: "1:514094282421:web:6acc414ec772a2395d30fc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);