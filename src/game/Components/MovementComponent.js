import { randomNumber } from "../../utils/utils";
export default class MovementComponent {
    constructor() {
        this.x = randomNumber(0, 200);
        this.y = randomNumber(0, 200);
    }
}