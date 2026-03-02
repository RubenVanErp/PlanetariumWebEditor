import * as optionsFunc from "./editingOptions.js";

export function createWorkspace(editor) {
    const viewport = document.createElement('div');
    viewport.id = 'viewport';
    document.body.appendChild(viewport);
}

export function createSideBar(editor) {
    const sideBar = document.createElement('div');
    sideBar.id = 'sideBar';
    document.body.appendChild(sideBar);

    updateSideBar(editor)
}

export function createMenuBar(editor) {
    const logo = document.createElement('a');
    logo.id = 'logo';
    logo.href = 'https://www.artis.nl/planetarium';
    logo.target = '_blank';
    logo.rel = 'noopener noreferrer';
    document.body.appendChild(logo);


    const menuBar = document.createElement('div');
    menuBar.id = 'menuBar';
    document.body.appendChild(menuBar);

    const menuBarButtons = ["add Slide", "save", "load", "export", "visualiser", "upload"];

    const buttonHandlers = {
        addSlide: () => {editor.currentPresentation.addBlankSlide()},
        save: () => {
            if (!editor.currentPresentation) {
                console.warn('No currentPresentation to save.');
                return;
            }
            editor.currentPresentation.savePresentation();
        },
        load: () => console.log('Load clicked'),
        export: () => console.log('Export clicked'),
        test: () => console.log('Test clicked'),
        upload: () => {editor.mediaStorage.openUploadDialog()}
    };

    menuBarButtons.forEach((label) => {
        const button = document.createElement('div');
        button.className = 'menuBar-item majorButton';
        const buttonText = label.charAt(0).toUpperCase() + label.slice(1);
        button.textContent = buttonText;
        button.setAttribute('data-text', buttonText);
        button.onclick = buttonHandlers[label.replace(/ /g,'')] || (() => {});
        menuBar.appendChild(button);
    });
}

export function createElementMenuBar(editor) {
    const elementMenuBar = document.createElement('div');
    elementMenuBar.id = 'elementMenuBar';
    document.body.appendChild(elementMenuBar);

    const menuBarButtons = ["add Photo or Video", "copy element", "paste element", "add Text"];

    const buttonHandlers = {
        addPhotoorVideo: () => {
            editor.mediaStorage.openPickerDialog({
                onSelect: (item) => {
                    if (!editor.currentSlide || !item) {
                        return;
                    }
                    const projection = "Regular";
                    const mediaType = item.kind === "video" ? "video" : "image";
                    const name = item.name || "media";
                    const mediaPath = item.url;
                    const newElement = new Element(editor.currentSlide, name, mediaType, mediaPath, projection);
                    editor.currentSlide.addElement(newElement);
                    editor.updateElementAndSlideBar();
                    ;
                }
            });
        },
        addText: () => {
            const projection = "Panoramic";
            const mediaType = "text";
            const name = "Text item";
            const mediaPath = null;
            const newElement = new Element(editor.currentSlide, name, mediaType, mediaPath, projection);
            editor.currentSlide.addElement(newElement);
            editor.updateElementAndSlideBar();
        }
    };

    menuBarButtons.forEach((label) => {
        const button = document.createElement('div');
        button.className = 'menuBar-item majorButton';
        const buttonText = label.charAt(0).toUpperCase() + label.slice(1);
        button.textContent = buttonText;
        button.setAttribute('data-text', buttonText);
        button.onclick = buttonHandlers[label.replace(/ /g,'')] || (() => {});
        elementMenuBar.appendChild(button);
    });
}

export function createElementBar(editor) {
    const elementBar = document.createElement('div');
    elementBar.id = 'elementBar';
    document.body.appendChild(elementBar);

    updateElementBar(editor)
}

export function createEditingOptionBar(editor) {
    const editingOptionBar = document.createElement('div');
    editingOptionBar.id = 'editingOptionBar';
    document.body.appendChild(editingOptionBar);
}

export function updateOptions(e) {
    var optionsBar = document.getElementById("editingOptionBar")
    optionsBar.innerHTML = ''
    const dict = {
        "slider": optionsFunc.addSlider,
        "doubleSlider": optionsFunc.addDoubleSlider,
        "toggle": optionsFunc.addToggle,
        "textBox": optionsFunc.addTextBox,
        "numberBox": optionsFunc.addNumberBox,
        "dropdown": optionsFunc.addDropdown,
        "button": optionsFunc.addButton
    }
    if (e) {
        var options = e.getOptions()
        options.forEach((option) => {
            const func = dict[option.type];
            var domElement = func(option.label, ...option.parameters, e)
            if (e.parentSlide.isAnimated) {
                domElement.classList.add("animatedOptionItem")
            }
            if(domElement) {optionsBar.appendChild(domElement)};
        })
    }
}

export function updateSideBar(editor) {
    const sideBar = document.getElementById("sideBar")
    sideBar.innerHTML = '';
    const sideBarItemOnClick = (i, item) => {
        editor.setCurrentSlide(item.slide)
    };

    const n = editor?.currentPresentation?.slides?.length ?? 0;

    for (let i = 0; i < n; i++) {
        const item = document.createElement('div');
        item.className = 'sideBar-item pressable';
        if (i==0) {item.classList.add("selected")}
        item.onclick = () => sideBarItemOnClick(i, item);
        item.slide = editor.currentPresentation.slides[i]
        item.id = item.slide.id
        sideBar.appendChild(item);
    }
}

export function updateElementBar(editor) {
    const elementBar = document.getElementById("elementBar")
    elementBar.innerHTML = '';
    const elementBarItemOnClick = (i, item) => {
        editor.setCurrentElement(item.element)
    };

    const n = editor?.currentSlide?.elements?.length ?? 0;

    for (let i = 0; i < n; i++) {
        const item = document.createElement('div');
        item.className = 'elementBar-item pressable';
        if (i==editor.currentSlide.elements.indexOf(editor.currentElement)) {item.classList.add("selected")}
        item.onclick = () => elementBarItemOnClick(i, item);
        item.element = editor.currentSlide.elements[i]
        item.id = item.element.id
        elementBar.appendChild(item);
    }
}

export function updateHighlightedSlideAndElement(editor){
    // Remove selected class from all items
    const allSlideItems = document.querySelectorAll('.sideBar-item');
    allSlideItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    const allElementItems = document.querySelectorAll('.elementBar-item');
    allElementItems.forEach(item => {
        item.classList.remove('selected');
    });

    // Add selected class to current slide and element
    var currentSlide = editor.currentSlide;
    var currentElement = editor.currentElement;

    if (currentSlide) {
        var slideInDom = document.getElementById(currentSlide.id);
        if (slideInDom) {
            slideInDom.classList.add('selected');
        }
    }
    
    if (currentElement) {
        var elementInDom = document.getElementById(currentElement.id);
        if (elementInDom) {
            elementInDom.classList.add('selected');
        }
    }
}

