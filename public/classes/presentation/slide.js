import { Element } from "./element.js";

export class Slide {
    constructor(id, parentPresentation) {
        this.parentPresentation = parentPresentation
        this.elements = [];
        this.id = id
        this.isAnimated = false;
        this.paused = true;
        this.animationDuration = 10;
    }

    addElement(e) {
        this.elements.push(e)
    }

    removeElement(e) {
        const index = this.elements.indexOf(e);
        if (index > -1) {
            this.elements.splice(index, 1); 
        }
        this.parentPresentation.editor.setCurrentElement(null)
        this.parentPresentation.editor.updateElementAndSlideBar() 
    }

    getElement(id) {
        return this.elements.find(element => element.id === id);
    }
}
