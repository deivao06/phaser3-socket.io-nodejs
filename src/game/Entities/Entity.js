export default class Entity {
    constructor() {
        this.components = {};
    }

    addComponent(component) {
        this.components[component.name] = component;
    }

    removeComponent(component) {
        delete this.components[component.name];
    }
}