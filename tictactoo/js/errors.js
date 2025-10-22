export class InvalidMoveLocationError extends Error {
    constructor(message) {
        super(message);
        this.name="InvalidMoveLocationError";
    }
}
