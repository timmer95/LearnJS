export function placeSymbolInBox (x, y, symbol) {
    const boxId = x.toString().concat(" ", y.toString());
    document.getElementById(boxId).textContent = symbol;
}

export function emptyAllBoxes() {
    const allBoxes = document.getElementsByClassName("box");
    for (const element of allBoxes) {
        element.textContent = "";
    };
}

export function addFunctionToButton(buttonId, functionToAdd) {
    document.getElementById(buttonId).addEventListener("click", functionToAdd);
}
