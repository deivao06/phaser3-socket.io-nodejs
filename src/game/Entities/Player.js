import Entity from "./Entity.js";

export default class Player extends Entity {
    constructor(playerId) {
        super();
        
        this.playerId = playerId;
    }
}