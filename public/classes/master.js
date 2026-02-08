import { Renderer } from './renderer.js';
import { Editor } from './masters/editor/editor.js';
import { Presenter } from './presenter.js';
import { Visualiser } from './visualiser.js';

class Master {
    constructor() {
        this.renderer = new Renderer();
        this.visualiser = new Visualiser();
        this.editor = new Editor();
        this.presenter = new Presenter();
        console.log("master Initialised")
    }
}
