import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import { endorsementsInDB, addToDB } from "./firebase.js";

import { generateEndorsementContainerHTML, addEventListenersToLikeICOs } from "./HTMLGenerator.js";


function clearEndorsementsSupercontainer() {
    endorsementsSupercontainer.innerHTML = "";
}

function appendEndorsementContainer(DBEntry) {
    const endorsementContainer = document.createElement("div");
    endorsementContainer.classList.add("div-endorsement-container");
    endorsementContainer.innerHTML = generateEndorsementContainerHTML(DBEntry);
    endorsementsSupercontainer.append(endorsementContainer);
}

function establishRealtimeConnectionWithDB() {
    onValue(endorsementsInDB, snapshot => {
        if (snapshot.exists()) {
            const DBentriesArr = Object.entries(snapshot.val());
            DBentriesArr.reverse();
            clearEndorsementsSupercontainer()
            for (let DBEntry of DBentriesArr) {
                const currentItemID = DBEntry[0];
                const currentItemValue = DBEntry[1];
                appendEndorsementContainer(DBEntry);
            }
            addEventListenersToLikeICOs(DBentriesArr);
        } else {
            endorsementsSupercontainer.innerHTML = "";
        }
    });
}

//

function clearInputFields() {
    inputFromEl.value = "";
    inputToEl.value = "";
    inputTextEl.value = "";
}

function formEndorsement() {
    const valueFrom = inputFromEl.value;
    const valueTo = inputToEl.value;
    const valueText = inputTextEl.value;
    if (valueFrom && valueTo && valueText) {
        const endorsement = 
        {
            from: inputFromEl.value,
            to: inputToEl.value,
            text: inputTextEl.value,
            likes: 0
        }
        return endorsement;
    } else {
        hintTimeOutId ? clearTimeout(hintTimeOutId) : null;
        creatorHint.classList.remove("hidden");
        hintTimeOutId = setTimeout(
            () => {
                creatorHint.classList.add("hidden");
            }, 
            2000
        );

        
    }
}

function renderDBWrite() {
    const endorsement = formEndorsement();
    if (endorsement) {
        addToDB(endorsement);
        clearInputFields();
    }
}

////

function enableEventListeners() {
    btnPublish.addEventListener("click", renderDBWrite)
}


//if __name__ == "__main__":
const inputTextEl = document.getElementById("input-text");
const inputFromEl = document.getElementById("input-from");
const inputToEl = document.getElementById("input-to");
const btnPublish = document.getElementById("btn-publish");
const creatorHint = document.getElementById("creator-hint");
const endorsementsSupercontainer = document.getElementById("div-endorsements-supercontainer");

let hintTimeOutId;

establishRealtimeConnectionWithDB();
enableEventListeners();
