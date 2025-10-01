export function placeSymbolInBox (x, y, symbol) {
    const boxId = x.toString().concat(" ", y.toString());
    document.getElementById(boxId).textContent = symbol;
}


export function addFunctionToButton(buttonId, functionToAdd) {
    document.getElementById(buttonId).addEventListener("click", functionToAdd);
}
