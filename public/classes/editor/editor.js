import * as func from "./functions/editorFunctions.js";
import { Timeline } from "./subclasses/timeline.js";
import { MediaStorage } from './subclasses/mediaStorage.js';

export class Editor {
    constructor(master) {
        this.master = master;
        this.currentPresentation = null;
        this.currentSlide = null;
        this.currentElement = null;
        this.copyBufferSlide = null;
        this.copyBufferElement = null;
        this.paused = true;
        this.timestamp = 0;
        this.timeline = null;
        this.mediaStorage = null;
        this.createEditingEnvironment()
    }

    createEditingEnvironment() {
        this.mediaStorage = new MediaStorage(this)
        func.createMenuBar(this)
        func.createSideBar(this)
        func.createWorkspace(this)
        func.createElementBar(this)
        func.createEditingOptionBar(this)
        func.createElementMenuBar(this)
        this.timeline = new Timeline(this)

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
        //remember to change parent slide
    }

    playSlide() {
        
    }

    pauseSlide() {
        
    }

    updateElementAndSlideBar() {
        func.updateSideBar(this)
        func.updateElementBar(this)
        func.updateOptions(this.currentElement)
    }

    setCurrentSlide(s) {
        this.currentSlide = s
        this.timeline.syncFromSlide(s)
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


