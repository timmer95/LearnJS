function createColorF(r, g, b) {
  return {
    values: [r, g, b],
  };
}

function createColorFFF(r, g, b) {
    values = [r, g, b]

    return {values}
}

function createColorFFF(r, g, b) {
    const values = [r, g, b]

    return {values}
}

function createColorFF(r, g, b) {  // approaches class instance so is stupid. You don't use this within function? 
    this.values = [r, g, b]

    return {values}
}