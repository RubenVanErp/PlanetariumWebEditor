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
    const logo = document.createElement('div');
    logo.id = 'logo';
    document.body.appendChild(logo);


    const menuBar = document.createElement('div');
    menuBar.id = 'menuBar';
    document.body.appendChild(menuBar);

    const menuBarButtons = ["save", "load", "export", "visualiser"];

    const buttonHandlers = {
        save: () => {
            if (!editor.currentPresentation) {
                console.warn('No currentPresentation to save.');
                return;
            }
            editor.currentPresentation.savePresentation();
        },
        load: () => console.log('Load clicked'),
        export: () => console.log('Export clicked'),
        test: () => console.log('Test clicked')
    };

    menuBarButtons.forEach((label) => {
        const button = document.createElement('div');
        button.className = 'menuBar-item majorButton';
        const buttonText = label.charAt(0).toUpperCase() + label.slice(1);
        button.textContent = buttonText;
        button.setAttribute('data-text', buttonText);
        button.onclick = buttonHandlers[label] || (() => {});
        menuBar.appendChild(button);
    });
}

export function createElementMenuBar(editor) {
    const elementMenuBar = document.createElement('div');
    elementMenuBar.id = 'elementMenuBar';
    document.body.appendChild(elementMenuBar);

    const menuBarButtons = ["upload", "copy element", "paste element"];

    const buttonHandlers = {
        upload: () => console.log('Upload clicked'),
    };

    menuBarButtons.forEach((label) => {
        const button = document.createElement('div');
        button.className = 'menuBar-item majorButton';
        const buttonText = label.charAt(0).toUpperCase() + label.slice(1);
        button.textContent = buttonText;
        button.setAttribute('data-text', buttonText);
        button.onclick = buttonHandlers[label] || (() => {});
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

export function createTimeLine(editor) {
    const timeLine = document.createElement('div');
    timeLine.id = 'timeLine';
    document.body.appendChild(timeLine);
}

export function updateOptions(e) {
    var optionsBar = document.getElementById("editingOptionBar")
    optionsBar.innerHTML = ''
    const dict = {
        "slider": addSlider,
        "doubleSlider": addDoubleSlider,
        "toggle": addToggle,
        "textBox": addTextBox,
        "numberBox": addNumberBox,
        "dropdown": addDropdown
    }
    if (e) {
        var options = e.getOptions()
        options.forEach((option) => {
            const func = dict[option.type];
            var domElement = func(option.label, ...option.parameters, e)
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
        if (i==0) {item.classList.add("selected")}
        item.onclick = () => elementBarItemOnClick(i, item);
        item.element = editor.currentSlide.elements[i]
        item.id = item.element.id
        elementBar.appendChild(item);
    }
}

export function addSlider(label, min = 0, max = 100, value = 50, element) {
    const functionDict = {
        "Rotation": [element.rotateElement.bind(element), element.rotation],
        "Scale": [element.scaleElement.bind(element), element.scale],
        "Opacity": [element.setOpacity.bind(element), element.opacity]
    };
    
    const currentEditingFunc = functionDict[label][0];
    const currentValue = functionDict[label][1];
    
    const container = document.createElement('div');
    container.className = 'editingOptionBar-item';
    
    const labelEl = document.createElement('label');
    labelEl.className = "option-label"
    labelEl.textContent = label;
    labelEl.style.display = 'block';
    labelEl.style.marginBottom = '5px';
    
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'flex';
    sliderContainer.style.gap = '10px';
    sliderContainer.style.alignItems = 'center';
    
    const valueBox = document.createElement('input');
    valueBox.type = 'number';
    valueBox.value = currentValue;
    valueBox.style.width = '3vw';
    valueBox.style.padding = '5px';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = currentValue;
    slider.style.flex = '1';
    
    // Textbox is authority - when it changes, update slider
    valueBox.addEventListener('input', (e) => {
        slider.value = e.target.value;
        currentEditingFunc(parseFloat(e.target.value));
    });
    
    valueBox.addEventListener('blur', (e) => {
        let newValue = parseFloat(e.target.value) || currentValue;
        valueBox.value = newValue;
        slider.value = newValue;
    });
    
    // Slider changes update textbox
    slider.addEventListener('input', (e) => {
        valueBox.value = e.target.value;
        currentEditingFunc(parseFloat(e.target.value));
    });

    sliderContainer.appendChild(valueBox);
    sliderContainer.appendChild(slider);
    
    container.appendChild(labelEl);
    container.appendChild(sliderContainer);
    return container;
}

export function addDoubleSlider(label, minRange = [0, 0], maxRange = [100, 100], value = [25, 75], element) {
    const container = document.createElement('div');
    container.className = 'editingOptionBar-item';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.className = "option-label"
    labelEl.style.display = 'block';
    labelEl.style.marginBottom = '5px';
    
    // Get current position values
    const currentPhi = element.position?.phi ?? value[0];
    const currentTheta = element.position?.theta ?? value[1];
    
    // First slider (Phi)
    const phiContainer = document.createElement('div');
    phiContainer.style.display = 'flex';
    phiContainer.style.gap = '10px';
    phiContainer.style.alignItems = 'center';
    phiContainer.style.marginBottom = '5px';
    
    const phiLabel = document.createElement('span');
    phiLabel.className = "option-label"
    phiLabel.textContent = 'Up-down:';
    phiLabel.style.width = '70px';
    
    const phiValueBox = document.createElement('input');
    phiValueBox.type = 'number';
    phiValueBox.value = currentPhi;
    phiValueBox.style.width = '2vw';
    phiValueBox.style.padding = '5px';
    
    const phiSlider = document.createElement('input');
    phiSlider.type = 'range';
    phiSlider.min = minRange[0];
    phiSlider.max = maxRange[0];
    phiSlider.value = currentPhi;
    phiSlider.style.flex = '1';
    
    // Second slider (Theta)
    const thetaContainer = document.createElement('div');
    thetaContainer.style.display = 'flex';
    thetaContainer.style.gap = '10px';
    thetaContainer.style.alignItems = 'center';
    
    const thetaLabel = document.createElement('span');
    thetaLabel.className = "option-label"
    thetaLabel.textContent = 'Around:';
    thetaLabel.style.width = '70px';
    
    const thetaValueBox = document.createElement('input');
    thetaValueBox.type = 'number';
    thetaValueBox.value = currentTheta;
    thetaValueBox.style.width = '2vw';
    thetaValueBox.style.padding = '5px';
    
    const thetaSlider = document.createElement('input');
    thetaSlider.type = 'range';
    thetaSlider.min = minRange[1];
    thetaSlider.max = maxRange[1];
    thetaSlider.value = currentTheta;
    thetaSlider.style.flex = '1';
    
    // Update function
    const updatePosition = () => {
        element.moveElement({
            phi: parseFloat(phiValueBox.value),
            theta: parseFloat(thetaValueBox.value)
        });
    };
    
    // Phi events
    phiValueBox.addEventListener('input', (e) => {
        phiSlider.value = e.target.value;
        updatePosition();
    });
    
    phiValueBox.addEventListener('blur', (e) => {
        let newValue = parseFloat(e.target.value) || currentPhi;
        phiValueBox.value = newValue;
        phiSlider.value = newValue;
    });
    
    phiSlider.addEventListener('input', (e) => {
        phiValueBox.value = e.target.value;
        updatePosition();
    });
    
    // Theta events
    thetaValueBox.addEventListener('input', (e) => {
        thetaSlider.value = e.target.value;
        updatePosition();
    });
    
    thetaValueBox.addEventListener('blur', (e) => {
        let newValue = parseFloat(e.target.value) || currentTheta;
        thetaValueBox.value = newValue;
        thetaSlider.value = newValue;
    });
    
    thetaSlider.addEventListener('input', (e) => {
        thetaValueBox.value = e.target.value;
        updatePosition();
    });
    
    // Assemble phi container
    phiContainer.appendChild(phiLabel);
    phiContainer.appendChild(phiValueBox);
    phiContainer.appendChild(phiSlider);
    
    // Assemble theta container
    thetaContainer.appendChild(thetaLabel);
    thetaContainer.appendChild(thetaValueBox);
    thetaContainer.appendChild(thetaSlider);
    
    // Assemble main container
    container.appendChild(labelEl);
    container.appendChild(phiContainer);
    container.appendChild(thetaContainer);
    
    return container;
}


export function addToggle(label, checked = false, element) {
    const functionDict = {
        "Paused": [element.togglePause.bind(element), element.paused],
        "Looping": [(val) => { element.looping = val; }, element.looping]
    };
    
    const currentEditingFunc = functionDict[label]?.[0];
    const currentValue = functionDict[label]?.[1] ?? checked;
    
    const container = document.createElement('div');
    container.className = 'editingOptionBar-item';
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'toggle-container';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = currentValue;
    checkbox.className = 'toggle-checkbox';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.className = 'toggle-label option-label';
    
    checkbox.addEventListener('change', (e) => {
        if (currentEditingFunc) {
            if (label === "Paused") {
                currentEditingFunc();
            } else {
                currentEditingFunc(e.target.checked);
            }
        }
    });
    
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(labelEl);
    container.appendChild(checkboxContainer);
    
    return container;
}

export function addTextBox(label, placeholder = '', value = '', element) {
    const functionDict = {
        "Media Path": [element.setMediaPath.bind(element), element.mediaPath],
        "Content": [(val) => { element.content = val; }, element.content ?? value]
    };
    
    const currentEditingFunc = functionDict[label]?.[0];
    const currentValue = functionDict[label]?.[1] ?? value;
    
    const container = document.createElement('div');
    container.className = 'editingOptionBar-item';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.className = 'option-label';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.value = currentValue;
    input.className = 'text-input';
    
    input.addEventListener('input', (e) => {
        if (currentEditingFunc) {
            currentEditingFunc(e.target.value);
        }
    });
    
    container.appendChild(labelEl);
    container.appendChild(input);
    
    return container;
}

export function addNumberBox(label, min = -Infinity, max = Infinity, value = 0, element) {
    const functionDict = {
        "Layer": [element.setLayer.bind(element), element.layer]
    };
    
    const currentEditingFunc = functionDict[label]?.[0];
    const currentValue = functionDict[label]?.[1] ?? value;
    
    const container = document.createElement('div');
    container.className = 'editingOptionBar-item';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.className = 'option-label';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.min = min;
    input.max = max;
    input.className = 'number-input';
    
    input.addEventListener('input', (e) => {
        if (currentEditingFunc) {
            currentEditingFunc(parseInt(e.target.value) || currentValue);
        }
    });
    
    input.addEventListener('blur', (e) => {
        let newValue = parseInt(e.target.value) || currentValue;
        if (min !== -Infinity) newValue = Math.max(min, newValue);
        if (max !== Infinity) newValue = Math.min(max, newValue);
        input.value = newValue;
        if (currentEditingFunc) {
            currentEditingFunc(newValue);
        }
    });
    
    container.appendChild(labelEl);
    container.appendChild(input);
    
    return container;
}

export function addDropdown(label, options = [], selectedValue = '', element) {
    const functionDict = {
        "Projection Type": [element.setProjection.bind(element), element.projection]
    };
    
    const currentEditingFunc = functionDict[label]?.[0];
    const currentValue = functionDict[label]?.[1] ?? selectedValue;
    
    const container = document.createElement('div');
    container.className = 'editingOptionBar-item';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.className = 'option-label';
    
    const select = document.createElement('select');
    select.className = 'dropdown-select';
    
    // Populate options
    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (optionValue === currentValue) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    // Update element when selection changes
    select.addEventListener('change', (e) => {
        if (currentEditingFunc) {
            currentEditingFunc(e.target.value);
        }
    });
    
    container.appendChild(labelEl);
    container.appendChild(select);
    
    return container;
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