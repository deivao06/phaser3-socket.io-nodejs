import InputHandlerComponent from "../Components/InputHandlerComponent.js";
import SpriteComponent from "../Components/SpriteComponent.js";
import Player from "../Entities/Player.js";
import Game from "../Game.js";

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
    this.socket.on('update player position', this.onUpdatePlayerPosition.bind(this));
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
    this.player.fromJson(player);

    this.player.addComponent(new SpriteComponent(this.physics, this.anims));
    this.player.addComponent(new InputHandlerComponent(this.player, this.cursors, this.socket));

    this.player.components.SpriteComponent.addSprite(this.player.spawnX, this.player.spawnY, 'tileset');

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

    this.handleOtherPlayersDisconnection();    
  }

  onUpdatePlayerPosition(player) {
    var otherPlayer = this.otherPlayers[player.playerId];

    if(player.x < otherPlayer.components.SpriteComponent.sprite.x){
      otherPlayer.components.SpriteComponent.sprite.setFlipX(true);
    }else if(player.x > otherPlayer.components.SpriteComponent.sprite.x){
      otherPlayer.components.SpriteComponent.sprite.setFlipX(false);
    }

    otherPlayer.components.SpriteComponent.sprite.x = player.x;
    otherPlayer.components.SpriteComponent.sprite.y = player.y;

    if (otherPlayer.components.SpriteComponent.sprite.anims.isPlaying && 
        otherPlayer.components.SpriteComponent.sprite.anims.currentAnim.key != 
        player.animation) {
        otherPlayer.components.SpriteComponent.playAnim(player.animation);
    }
  }

  onCreateOtherPlayers(state) {
    this.gameClass.setState(state);
    
    for (const [id, player] of Object.entries(this.gameClass.state.players)) {
      if(id != this.player.playerId){
        this.createOtherPlayer(player);
      }
    }
  }

  createOtherPlayer(playerJson) {
    var player = new Player(playerJson.playerId);
    player.fromJson(playerJson);

    player.addComponent(new SpriteComponent(this.physics, this.anims));

    player.components.SpriteComponent.addSprite(player.spawnX, player.spawnY, 'tileset');

    player.components.SpriteComponent.setCollideWorldBounds(true);
    player.components.SpriteComponent.setScale(2);
    player.components.SpriteComponent.setSize(16, 16);
    player.components.SpriteComponent.setOffset(0, 16);
    player.components.SpriteComponent.setTint(0xfff000);
    player.components.SpriteComponent.setPushable(false);

    player.components.SpriteComponent.playAnim('idle');

    this.physics.add.collider(this.player.components.SpriteComponent.sprite, player.components.SpriteComponent.sprite);
    this.otherPlayers[player.playerId] = player;
  }

  handlePlayerInput() {
    if(Object.keys(this.player).length !== 0){
      this.player.components.InputHandlerComponent.handleInput();
    }
  }

  handleOtherPlayersDisconnection() {
    if(Object.keys(this.otherPlayers).length > 0){
      for (const [id, otherPlayer] of Object.entries(this.otherPlayers)) {
        if(!this.gameClass.state.players.hasOwnProperty(id)){
          otherPlayer.components.SpriteComponent.sprite.destroy();
          delete this.otherPlayers[id];
        }
      }
    }
  }
}
