
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
 
const firebaseConfig = {
  apiKey: "AIzaSyDaHAICglcNhC3bbERXJegdcVS41Vmq3Zs",
  authDomain: "fir-m-s-1675d.firebaseapp.com",
  projectId: "fir-m-s-1675d",
  storageBucket: "fir-m-s-1675d.firebasestorage.app",
  messagingSenderId: "247553862386",
  appId: "1:247553862386:web:6af8d660ea8cdd4457be6b",
  measurementId: "G-VGK5EVBC85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app);
export const db = getFirestore(app); 