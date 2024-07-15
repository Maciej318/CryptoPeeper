import firebaseConfig from "./pages/fierbaseConfig";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { initializeApp } from 'firebase/app'

const fierbaseApp = initializeApp(firebaseConfig);

const auth = getAuth(fierbaseApp);
const db = getFirestore(fierbaseApp)

export { auth, db}