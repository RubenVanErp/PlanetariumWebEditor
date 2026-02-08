import { Element } from "./element.js";

export class Slide {
    constructor(id) {
        this.elements = [];
        this.id = id
    }

    addElement(e) {
        this.elements.push(e)
    }

    removeElement(e) {
        const index = this.elements.indexOf(e);
        if (index > -1) {
            this.elements.splice(index, 1); 
        }
    }

    getElement(id) {
        return this.elements.find(element => element.id === id);
    }
}
