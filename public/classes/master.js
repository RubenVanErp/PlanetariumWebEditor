import { Editor } from './editor/editor.js';
import { Presentation } from './presentation/presentation.js';
import { Presenter } from './presenter/presenter.js';
import { Visualiser } from './visualiser/visualiser.js';

export class Master {
    constructor() {
        this.visualiser = new Visualiser(this);        
        this.presenter = new Presenter(this);
        this.editor = new Editor(this);
        this.presentation = new Presentation("default", this);
        this.editor.setCurrentPresentation(this.presentation)
    }
}
