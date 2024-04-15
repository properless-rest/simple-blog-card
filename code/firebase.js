import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


export function addToDB(object) {
    push(endorsementsInDB, object);
}


export function updateInDB(entryID, updatedObject) {
    update(ref(database, `endorsements/${entryID}`), updatedObject);
}


//if __name__ == "__main__"
const firebaseConfig = {
  databaseURL: "https://we-are-the-champions-2e242-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const endorsementsInDB = ref(database, "endorsements");
