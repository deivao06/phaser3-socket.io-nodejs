import InputHandlerComponent from "../Components/InputHandlerComponent.js";
import SpriteComponent from "../Components/SpriteComponent.js";
import Player from "../Entities/Player.js";
import Game from "../Game.js";
import { randomNumber } from "../../utils/utils.js";

export default class MainScene extends Phaser.Scene {
  constructor () {
    super("main-scene");

    this.cursors = null;
  }

  preload() {
    this.load.spritesheet("tileset", "assets/tileset.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    this.socket = io();

    this.gameClass = new Game();

    this.player = {};
    this.otherPlayers = {};

    this.cursors = this.input.keyboard.createCursorKeys()
    this.eventHandlers();
  }

  update() {
    this.handlePlayerInput();
  }

  eventHandlers() {
    this.socket.on('connect', this.onSocketConnected)
    this.socket.on('disconnect', this.onSocketDisconnect)

    this.socket.on('new player', this.onNewPlayer.bind(this))
    this.socket.on('create players', this.onCreateOtherPlayers.bind(this));
    this.socket.on('update state', this.onUpdateState.bind(this));
  }

  onSocketConnected() {
    console.log('Connected to socket server');
    this.emit('new player');
  }

  onSocketDisconnect() {
    console.log('Disconnected off socket server');
  }

  onNewPlayer(player) {
    this.player = new Player(player.playerId);
    this.player.addComponent(new SpriteComponent(this.physics, this.anims));
    this.player.addComponent(new InputHandlerComponent(this.player, this.cursors));

    this.player.components.SpriteComponent.addSprite(randomNumber(0, 200), 
                                                      randomNumber(0, 200),
                                                      'tileset');

    this.player.components.SpriteComponent.setCollideWorldBounds(true);
    this.player.components.SpriteComponent.setScale(2);
    this.player.components.SpriteComponent.setSize(16, 16);
    this.player.components.SpriteComponent.setOffset(0, 16);

    this.player.components.SpriteComponent.createAnim({
      name: 'idle',
      start: '72',
      end: '74',
      frameRate: 8,
      repeat: -1,
      tileset: 'tileset'
    });

    this.player.components.SpriteComponent.createAnim({
      name: 'run',
      start: '75',
      end: '79',
      frameRate: 12,
      repeat: -1,
      tileset: 'tileset'
    });
  }

  onUpdateState(state) {
    this.gameClass.setState(state);

    this.handleOtherPlayersAnimation();
    this.handleOtherPlayersMovement();    
    this.handleOtherPlayersDisconnection();    
  }

  onCreateOtherPlayers(state) {
    this.gameClass.setState(state);

    for (const [id, player] of Object.entries(this.gameClass.state.players)) {
      if(id != this.player.id){
        this.createOtherPlayer(player);
      }
    }
  }

  createOtherPlayer(player) {
    player.sprite = this.physics.add.sprite(player.x, player.y, 'tileset');
    player.sprite.setCollideWorldBounds(true);
    player.sprite.setScale(2);
    player.sprite.tint = 0xfff000;
    player.sprite.setSize(16, 16);
    player.sprite.setOffset(0, 16);
    player.sprite.setPushable(false);

    player.sprite.anims.play(player.animation);

    this.physics.add.collider(this.player.sprite, player.sprite);

    this.otherPlayers[player.id] = player;
  }

  handlePlayerInput() {
    if(Object.keys(this.player).length !== 0){
      this.player.components.InputHandlerComponent.handleInput();
    }
  }

  handleOtherPlayersMovement() {
    if(Object.keys(this.otherPlayers).length > 0){
      for (const [id, otherPlayer] of Object.entries(this.otherPlayers)) {
        if(this.gameClass.state.players.hasOwnProperty(id)){
          if(otherPlayer.sprite.x < this.gameClass.state.players[id].x){
            otherPlayer.sprite.setFlipX(false);
          }else if(otherPlayer.sprite.x > this.gameClass.state.players[id].x){
            otherPlayer.sprite.setFlipX(true);
          }
          
          otherPlayer.sprite.x = this.gameClass.state.players[id].x;
          otherPlayer.sprite.y = this.gameClass.state.players[id].y;
        }
      }
    }
  }

  handleOtherPlayersAnimation() {
    if(Object.keys(this.otherPlayers).length > 0){
      for (const [id, otherPlayer] of Object.entries(this.otherPlayers)) {
        if(this.gameClass.state.players.hasOwnProperty(id)){
          if (otherPlayer.sprite.anims.isPlaying && otherPlayer.sprite.anims.currentAnim.key != this.gameClass.state.players[id].animation) {
            otherPlayer.sprite.anims.play(this.gameClass.state.players[id].animation);
          }
        }
      }
    }
  }

  handleOtherPlayersDisconnection() {
    if(Object.keys(this.otherPlayers).length > 0){
      for (const [id, otherPlayer] of Object.entries(this.otherPlayers)) {
        if(!this.gameClass.state.players.hasOwnProperty(id)){
          otherPlayer.sprite.destroy();
          delete this.otherPlayers[id];
        }
      }
    }
  }
}
