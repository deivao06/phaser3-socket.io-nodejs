export default class Game
{
    constructor(){
        this.state = {
            players: [],
        }
    }

    addPlayer(playerId) {
        var player = {
            id: playerId,
            x: this.getRandomInt(0, 200),
            y: this.getRandomInt(0, 200)
        }

        this.state.players.push(player);

        return player;
    }

    removePlayer(playerId) {
        this.state.players = this.state.players.filter((player) => {
            return player.id != playerId;
        });
    }

    updatePlayer(player) {
        var updatedPlayers = this.state.players.map( statePlayer => {
            if(statePlayer.id == player.id) {
                return player;
            }

            return statePlayer;
        });

        this.state.players = updatedPlayers
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