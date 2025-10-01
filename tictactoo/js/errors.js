export class InvalidMoveFormatError extends Error {
    constructor(message) {
        super(message);
        this.name="InvalidMoveFormatError";
    }
}

export class InvalidMoveLocationError extends Error {
    constructor(message) {
        super(message);
        this.name="InvalidMoveLocationError";
    }
}
