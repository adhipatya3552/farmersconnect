import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBy1f8s3vq7h6wMSO-8KIOCkwPjruEnU7U",
//   authDomain: "signal-clone-yt-build-2effe.firebaseapp.com",
//   projectId: "signal-clone-yt-build-2effe",
//   storageBucket: "signal-clone-yt-build-2effe.appspot.com",
//   messagingSenderId: "19054707600",
//   appId: "1:19054707600:web:ea409e232dcb12b4afe915"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAYIKiL3hiqvqHKwf8sT0Ph4Uh7MamLSD4",
  authDomain: "farmers-connect-6c527.firebaseapp.com",
  projectId: "farmers-connect-6c527",
  storageBucket: "farmers-connect-6c527.appspot.com",
  messagingSenderId: "176702036420",
  appId: "1:176702036420:web:2ab2a99ff257dfedf5ec91"
};

let app;
if (firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}


const db = app.firestore();
const auth = firebase.auth();

export { db, auth };