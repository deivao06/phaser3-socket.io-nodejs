import { Server } from 'socket.io';
import Game from './Game.js';

export default class GameServer
{
    constructor(server){
        this.io = new Server(server);
        this.handleSocketEvents();

        this.game = new Game();
    }

    handleSocketEvents(){
        this.io.on('connection', (socket) => {
            console.log(`User ${socket.id} connected`);

            socket.on('new player', () => {
                var player = this.game.addPlayer(socket.id);
                socket.player = player;

                socket.emit('new player', player);
                this.io.emit('create players', this.game.getState());
            });

            socket.on('update player position', (position) => {
                socket.player.x = position.x;
                socket.player.y = position.y;               
                socket.player.animation = position.animation;

                socket.broadcast.emit('update player position', socket.player);
            });

            socket.on('disconnect', (reason) => {
                console.log(`User ${socket.id} disconnected`);

                var player = socket.player;
                
                this.game.removePlayer(player.playerId);
                this.io.emit('update state', this.game.getState());
            })
        });
    }
}