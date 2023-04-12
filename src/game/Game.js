import Player from "./Entities/Player.js";

export default class Game
{
    constructor(){
        this.state = {
            players: {},
        }
    }

    addPlayer(playerId) {
        var player = new Player(playerId);
        this.state.players[player.playerId] = player;

        return player;
    }

    removePlayer(playerId) {
        delete this.state.players[playerId];
    }

    updatePlayer(player) {
        this.state.players[player.id] = player;
    }

    setState(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }
}