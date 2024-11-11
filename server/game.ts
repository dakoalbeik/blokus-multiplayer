// src/game.ts

export type Player = {
    id: string;
    name: string;
    color: string; // Color assigned to player pieces
};

export type Move = {
    playerId: string;
    pieceId: string;
    position: { x: number; y: number };
    rotation: number;
    flip: boolean;
};

export type GameState = {
    players: Player[];
    board: number[][]; // 20x20 grid representing the Blokus board
    currentTurn: string; // ID of the player whose turn it is
};

export class Game {
    private readonly state: GameState;

    constructor() {
        this.state = {
            players: [],
            board: Array(20).fill(Array(20).fill(0)), // 20x20 empty board
            currentTurn: ''
        };
    }

    addPlayer(player: Player) {
        if (this.state.players.length < 4) {
            this.state.players.push(player);
            if (this.state.players.length === 1) {
                this.state.currentTurn = player.id; // First player starts
            }
        }
    }

    makeMove(move: Move): boolean {
        // Placeholder logic for validating and making a move
        if (move.playerId !== this.state.currentTurn) return false; // Only allow current player
        // Update board, change turn, etc.
        // For now, let's assume the move is always valid
        this.state.currentTurn = this.getNextPlayerId();
        return true;
    }

    getState(): GameState {
        return this.state;
    }

    private getNextPlayerId(): string {
        const index = this.state.players.findIndex(p => p.id === this.state.currentTurn);
        return this.state.players[(index + 1) % this.state.players.length].id;
    }
}
