/**
 * Created by archibold on 16/07/2018.
 */
import * as firebase from "firebase";


const config = {
    apiKey: "AIzaSyCad5XBg9hAXn_hkRLA1gc-rZclCwQ1B1k",
    authDomain: "grossarylist.firebaseapp.com",
    databaseURL: "https://grossarylist.firebaseio.com",
    projectId: "grossarylist",
    storageBucket: "grossarylist.appspot.com",
    messagingSenderId: "1098104858964"
};
const firebaseApp = firebase.initializeApp(config);



export default firebaseApp;