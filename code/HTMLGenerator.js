import { updateInDB } from "./firebase.js";


function determineHeartICOState(entryValue) {
    let unpressedVisibility = "";
    let pressedVisibility = "";
    const likesNumber = entryValue.likes;
    likesNumber === 0 ? unpressedVisibility = "" : unpressedVisibility = "hidden";
    likesNumber === 0 ? pressedVisibility = "hidden" : pressedVisibility = "";
    return { unpressedVisibility, pressedVisibility }
}


export function generateEndorsementContainerHTML(DBEntry) {
    const entryID = DBEntry[0];
    const entryValue = DBEntry[1];   
    const { unpressedVisibility, pressedVisibility } = determineHeartICOState(entryValue);
    // note: path to static must remain specified relevant to the HTML-file location;
    const endorsementContainerHTML = 
    `
    <h3 class="endorsement-title">To ${entryValue.to}</h3>
    <p class="endorsement-msg">${entryValue.text}</p>
    <div class="div-endorsement-footer">
        <span>From ${entryValue.from}</span>
        <div class="div-likes">
            <img id="unpressed-${entryID}" class="likes-img ${unpressedVisibility} js-unpressed" 
            src="./assets/likes-unpressed-icon.png" alt="heart-likes-icon-unpressed">
            <img id="pressed-${entryID}" class="likes-img ${pressedVisibility} js-pressed" 
            src="./assets/likes-pressed-icon.png" alt="heart-likes-icon-pressed">
            <span id="likes-${entryID}" class="likes-quantity">${entryValue.likes}</span>
        </div>
    </div>
    `;
    return endorsementContainerHTML;
}

////

function findRelevantHeartICO(prefix, identicIDpart) {
    let pressedHearts = document.querySelectorAll(`.js-${prefix}`);
    pressedHearts = Object.values(pressedHearts);
    const relevantPressedHeart = pressedHearts.find(
        pressedHeart => { return pressedHeart.id === `${prefix}-${identicIDpart}` }
    );
    return relevantPressedHeart;
}

function findRelevantLikesCounter(identicIDpart) {
    const likesCounter = document.getElementById(`likes-${identicIDpart}`);
    return likesCounter;
}

function synchronizeLikesWithDB(_relevantDBEntry, _hiddenHeartType, _visibleHeartEL, _updatedLikesNumber, _visibleHeartIndex) {
    const identicIDpart = _relevantDBEntry[0];
    const pressedHeart = findRelevantHeartICO(_hiddenHeartType, identicIDpart);
    _visibleHeartEL.classList.add("hidden");
    pressedHeart.classList.remove("hidden");
    const likesCounter = findRelevantLikesCounter(identicIDpart);
    updateInDB(identicIDpart, {likes: _updatedLikesNumber});
    likesCounter.textContent = _relevantDBEntry[1].likes;
}

export function addEventListenersToLikeICOs(DBEntriesArr) {
    const unpressedHearts = document.querySelectorAll(".js-unpressed");
    unpressedHearts.forEach( 
        (unpressedHeart, unpressedHeartIndex) => {
            unpressedHeart.addEventListener(
                "click",
                () => {
                    const relevantDBEntry = DBEntriesArr[unpressedHeartIndex];
                    synchronizeLikesWithDB(relevantDBEntry, "pressed", unpressedHeart, 1, unpressedHeartIndex)
                }
            );
        }
    );
    
    const pressedHearts = document.querySelectorAll(".js-pressed");
    pressedHearts.forEach( 
        (pressedHeart, pressedHeartIndex) => {
            pressedHeart.addEventListener(
                "click",
                () => {
                    const relevantDBEntry = DBEntriesArr[pressedHeartIndex];
                    synchronizeLikesWithDB(relevantDBEntry, "unpressed", pressedHeart, 0, pressedHeartIndex)
                }
            );
        }
    );
}

