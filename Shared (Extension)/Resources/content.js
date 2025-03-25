function getCell(cellNumber) {
  return document.querySelector(`div[data-cell="${cellNumber}"]`);
}

function getCandidateCell(cellNumber) {
  return document.querySelector(`.su-candidates:nth-child(${cellNumber})`);
}

function getNumberCell(cellNumber) {
  return document.querySelector(`.su-keyboard__number:nth-child(${cellNumber})`);
}

function checkCells() {
    let candidateIndex = 82; // first index of .su-candidates element
    const cellsToFill = new Map();

    for (let cellIndex = 0; cellIndex < 81; cellIndex++) {
        const suCell = getCell(cellIndex);

        if (suCell.getAttribute("aria-label") === "empty") {
            const candidateCellsContainer = getCandidateCell(candidateIndex);
            
            if (candidateCellsContainer.children.length === 1) {
                const candidateCell = candidateCellsContainer.children[0];
                const number = candidateCell.getAttribute("data-number");
                const numberCell = getNumberCell(number);
                
                cellsToFill.set(suCell, numberCell);
          }

          ++candidateIndex;
        }
      }
    
    return cellsToFill;
}

function markCells() {
    const cellsToFill = checkCells();

    for (const [suCell, numberCell] of cellsToFill) {
        // select the cell
        window.requestAnimationFrame(() => suCell.click());
                      
        // click on its number cell
        window.requestAnimationFrame(() => numberCell.click());
    }
    
    // if cellsToFill is not empty it means some cells are going to be clicks and the board is going to change
    // so call markCells recursivly after all the cells are clicked in order to detect new changes
    if (cellsToFill.size > 0) {
        window.requestAnimationFrame(() => markCells());
    }
}

function turnOnCandidates() {
    const candidatesCheckbox = document.querySelector((".su-keyboard__checkbox"))
    if (!candidatesCheckbox.checked) {
        candidatesCheckbox.click();
    }
}

function turnOnNormalMode() {
    const normalModeButton = document.querySelector((".su-keyboard__mode"))
    normalModeButton.click();
}

function fillSingleSelectionCells() {
    turnOnNormalMode();
    turnOnCandidates();

    window.requestAnimationFrame(markCells);
}

function addAutoFillButton () {
    const buttonsContainer = document.querySelector(".su-keyboard__container");
    const isButtonAdded = document.querySelector(".su-keyboard__fill") !== null;
    
    if (buttonsContainer && !isButtonAdded) {
        const helpButton = document.createElement("div");
        helpButton.role = "button";
        helpButton.classList.add("su-keyboard__delete");
        helpButton.classList.add("su-keyboard__fill");
        helpButton.style.backgroundImage = "unset";
        helpButton.style.display = "grid";
        helpButton.style.placeItems = "center";
        helpButton.style.textAlign = "center";
        helpButton.textContent = "Auto fill";
        helpButton.addEventListener("click", fillSingleSelectionCells);

        buttonsContainer.appendChild(helpButton);
    }
}

function queueAddAutoFillButton() {
    window.setTimeout(() => {
        window.requestAnimationFrame(addAutoFillButton);
    }, 250);
}

window.addEventListener("DOMContentLoaded", queueAddAutoFillButton);
window.addEventListener("readystatechange", queueAddAutoFillButton);
window.addEventListener("popstate", queueAddAutoFillButton);
window.addEventListener("load", () => {
    queueAddAutoFillButton();
    const wrapperNode = document.querySelector(".pz-game-wrapper");
    if (wrapperNode !== null) {
        const mutationObserver = new MutationObserver(queueAddAutoFillButton);
        mutationObserver.observe(wrapperNode, {childList: true, subtree: true});
    }
});
