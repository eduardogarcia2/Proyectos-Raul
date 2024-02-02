import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyBXyN_cr_9tfT4k5ovRvKfSbgBV9qw4PaY",
    authDomain: "proyecto-d19a8.firebaseapp.com",
    projectId: "proyecto-d19a8",
    storageBucket: "proyecto-d19a8.appspot.com",
    messagingSenderId: "1005098631564",
    appId: "1:1005098631564:web:73b95ea7405335dd39d6a9",
    measurementId: "G-XZB0S1DDS5"
};

const app = initializeApp(firebaseConfig);

export const imageDb = getStorage(app)