export default class Game
{
    constructor(){
        this.state = {
            players: {},
        }
    }

    addPlayer(playerId) {
        var player = {
            id: playerId,
            x: this.getRandomInt(0, 200),
            y: this.getRandomInt(0, 200),
            animation: 'idle',
        }

        this.state.players[playerId] = player;

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

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}