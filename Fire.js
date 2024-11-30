import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZuEjCoyN0SG9sPGBcFZXq2JjVL4HCAH8",
  authDomain: "testproject-fb68f.firebaseapp.com",
  databaseURL: "https://testproject-fb68f-default-rtdb.firebaseio.com",
  projectId: "testproject-fb68f",
  storageBucket: "testproject-fb68f.appspot.com",
  messagingSenderId: "394987814241",
  appId: "1:394987814241:web:c5807cb87d56fc71f69920",
  measurementId: "G-EH9WKS2F3E",
};

class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid;
        callback(null, user);
      } else {
        signInAnonymously(auth).catch((error) => {
          callback(error);
        });
      }
    });
  }

  getLists(callback) {
    const ref = query(collection(getFirestore(), "users", this.userId, "lists"), orderBy("name"));
    this.unsubscribe = onSnapshot(ref, (snapshot) => {
      const lists = [];
      snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });

      callback(lists);
    });
  }

  addList(list) {
    const ref = collection(getFirestore(), "users", this.userId, "lists");
    addDoc(ref, list);  // Add new list to Firestore
  }

  updateList(list) {
    const ref = doc(getFirestore(), "users", this.userId, "lists", list.id);
    updateDoc(ref, list);  // Update the existing list
  }

  getUserId() {
    return this.userId;
  }

  detach() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default Fire;
