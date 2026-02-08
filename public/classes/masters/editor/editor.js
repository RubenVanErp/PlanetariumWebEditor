import { Presentation } from '../../presentation.js';
import { Slide } from '../../slide.js';
import { Element } from '../../element.js';
import * as func from "./editorFunctions.js";

export class Editor {
    constructor(master) {
        this.master = master;
        this.currentPresentation = null;
        this.currentSlide = null;
        this.currentElement = null;
        this.copyBufferSlide = null;
        this.copyBufferElement = null;
        this.createEditingEnvironment()
    }

    createEditingEnvironment() {
        func.createMenuBar(this)
        func.createSideBar(this)
        func.createWorkspace(this)
        func.createElementBar(this)
        func.createEditingOptionBar(this)
        func.createElementMenuBar(this)
        func.createTimeLine(this)
    }

    renderCurrentSlide() {
        
    }

    copySlide() {
        
    }

    pasteSlide() {
        
    }

    copyElement() {
        
    }

    pasteElement() {
        
    }

    playSlide() {
        
    }

    pauseSlide() {
        
    }

    setCurrentSlide(s) {
        this.currentSlide = s
        this.setCurrentElement(s.elements[0])
        func.updateElementBar(this)

    }

    setCurrentElement(e) {
        this.currentElement = e
        func.updateOptions(e)
        func.updateHighlightedSlideAndElement(this)
    }

    setCurrentPresentation(p) {
        this.currentPresentation = p
        this.setCurrentSlide(p.slides[0])
        func.updateSideBar(this)
    }
    

}


