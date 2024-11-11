export class Piece {
    public shape: number[][];
    public id: string;
    public rotation?: number;
    public flip?: number;

    constructor(id: string, shape: number[][]) {
        this.id = id;
        this.shape = shape
        this.rotation = 0;
        this.flip = 0;
    }
}