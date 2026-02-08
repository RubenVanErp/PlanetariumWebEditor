import { Renderer } from './renderer.js';
import { Editor } from './editor/editor.js';
import { Presenter } from './presenter.js';
import { Visualiser } from './visualiser.js';
import { Presentation } from '../presentation.js';
import { Element } from '../element.js';

export class Master {
    constructor() {
        this.renderer = new Renderer(this);
        this.visualiser = new Visualiser(this);
        this.editor = new Editor(this);
        this.presenter = new Presenter(this);
        this.templatePresentation = new Presentation("template")
        this.populateTemplatePresentation()
    }

     populateTemplatePresentation() { // Just for testing
        const typeCycle = ["image", "video", "text"]
        for (let i=0; i<8; i++){
            this.templatePresentation.addBlankSlide()
            for (let j=0; j<=i; j++){
                const backgroundElement = new Element(
                    "background",           // name
                    typeCycle[j%3],         // type
                    "calibrationImage.jpg", // mediaPath
                    "fullDome"              // projection
                );
                this.templatePresentation.slides[i].addElement(backgroundElement)
            }
        }
        this.editor.setCurrentPresentation(this.templatePresentation)
     }
}
