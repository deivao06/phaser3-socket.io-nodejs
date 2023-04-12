import { randomNumber } from "../../utils/utils.js";
import Entity from "./Entity.js";

export default class Player extends Entity {
    constructor(playerId) {
        super();
        
        this.playerId = playerId;

        this.spawnX = randomNumber(0, 200);
        this.spawnY = randomNumber(0, 200);
    }
    
    fromJson(json) {
        this.spawnX = json.spawnX;
        this.spawnY = json.spawnY;
    }
}