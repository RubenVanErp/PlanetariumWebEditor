export function addSlider(label, min = 0, max = 100, value = 50, element) {
    const parameterDict = {
        "Rotation": "rotation",
        "Scale": "scale",
        "Opacity": "opacity"
    };

    const parameterKey = parameterDict[label];
    const interval = parameterKey ? element[parameterKey]?.[0] : null;
    const currentValue = interval?.startValue ?? value;
    
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
    valueBox.style.width = '2vw';
    valueBox.style.padding = '5px';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = "slider"
    slider.min = min;
    slider.max = max;
    slider.value = currentValue;
    slider.style.flex = '1';
    
    // Textbox is authority - when it changes, update slider
    valueBox.addEventListener('input', (e) => {
        slider.value = e.target.value;
        const newValue = parseFloat(e.target.value);
        if (interval) {
            interval.startValue = newValue;
            interval.endValue = newValue;
        } else if (parameterKey) {
            element[parameterKey] = newValue;
        }
    });
    
    valueBox.addEventListener('blur', (e) => {
        let newValue = parseFloat(e.target.value) || currentValue;
        valueBox.value = newValue;
        slider.value = newValue;
    });
    
    // Slider changes update textbox
    slider.addEventListener('input', (e) => {
        valueBox.value = e.target.value;
        const newValue = parseFloat(e.target.value);
        if (interval) {
            interval.startValue = newValue;
            interval.endValue = newValue;
        } else if (parameterKey) {
            element[parameterKey] = newValue;
        }
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
    
    const interval = element.position?.[0] ?? null;
    const currentPhi = interval?.startValue?.phi ?? value[0];
    const currentTheta = interval?.startValue?.theta ?? value[1];
    
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
        const nextValue = {
            phi: parseFloat(phiValueBox.value),
            theta: parseFloat(thetaValueBox.value)
        };
        if (interval) {
            interval.startValue = nextValue;
            interval.endValue = nextValue;
        } else {
            element.moveElement(nextValue);
        }
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
    const parameterDict = {
        "Paused": "paused",
        "Looping": "looping"
    };

    const parameterKey = parameterDict[label];
    const interval = parameterKey && Array.isArray(element[parameterKey]) ? element[parameterKey][0] : null;
    const currentValue = interval?.startValue ?? (parameterKey ? element[parameterKey] : checked) ?? checked;
    
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
        const nextValue = e.target.checked;
        if (interval) {
            interval.startValue = nextValue;
            interval.endValue = nextValue;
        } else if (parameterKey) {
            element[parameterKey] = nextValue;
        }
    });
    
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(labelEl);
    container.appendChild(checkboxContainer);
    
    return container;
}

export function addTextBox(label, placeholder = '', value = '', element) {
    const parameterDict = {
        "Media Path": "mediaPath",
        "Content": "content"
    };

    const parameterKey = parameterDict[label];
    const interval = parameterKey && Array.isArray(element[parameterKey]) ? element[parameterKey][0] : null;
    const currentValue = interval?.startValue ?? (parameterKey ? element[parameterKey] : value) ?? value;
    
    const container = document.createElement('div');
    container.className = 'editingOptionBar-item';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.className = 'option-label';
    
    const textarea = document.createElement('textarea');
    textarea.placeholder = placeholder;
    textarea.value = currentValue;
    textarea.className = 'text-input';
    textarea.rows = 1;
    
    // Auto-resize function
    const autoResize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };
    
    textarea.addEventListener('input', (e) => {
        autoResize();
        const nextValue = e.target.value;
        if (interval) {
            interval.startValue = nextValue;
            interval.endValue = nextValue;
        } else if (parameterKey) {
            element[parameterKey] = nextValue;
        }
    });
    
    // Initial resize
    setTimeout(autoResize, 0);
    
    container.appendChild(labelEl);
    container.appendChild(textarea);
    
    return container;
}

export function addNumberBox(label, min = -Infinity, max = Infinity, value = 0, element) {
    const parameterDict = {
        "Layer": "layer"
    };

    const parameterKey = parameterDict[label];
    const interval = parameterKey ? element[parameterKey]?.[0] : null;
    const currentValue = interval?.startValue ?? (parameterKey ? element[parameterKey] : value) ?? value;
    
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
        const newValue = parseInt(e.target.value) || currentValue;
        if (interval) {
            interval.startValue = newValue;
            interval.endValue = newValue;
        } else if (parameterKey) {
            element[parameterKey] = newValue;
        }
    });
    
    input.addEventListener('blur', (e) => {
        let newValue = parseInt(e.target.value) || currentValue;
        if (min !== -Infinity) newValue = Math.max(min, newValue);
        if (max !== Infinity) newValue = Math.min(max, newValue);
        input.value = newValue;
        if (interval) {
            interval.startValue = newValue;
            interval.endValue = newValue;
        } else if (parameterKey) {
            element[parameterKey] = newValue;
        }
    });
    
    container.appendChild(labelEl);
    container.appendChild(input);
    
    return container;
}

export function addDropdown(label, options = [], selectedValue = '', element) {
    const parameterDict = {
        "Projection Type": "projection"
    };

    const parameterKey = parameterDict[label];
    const interval = parameterKey && Array.isArray(element[parameterKey]) ? element[parameterKey][0] : null;
    const currentValue = interval?.startValue ?? (parameterKey ? element[parameterKey] : selectedValue) ?? selectedValue;
    
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
        const nextValue = e.target.value;
        if (interval) {
            interval.startValue = nextValue;
            interval.endValue = nextValue;
        } else if (parameterKey) {
            element[parameterKey] = nextValue;
        }
    });
    
    container.appendChild(labelEl);
    container.appendChild(select);
    
    return container;
}

export function addButton(label, functionName, element) {
    const container = document.createElement('div');
    container.className = 'editingOptionBar-item';

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.className = 'option-label';

    const button = document.createElement('button');
    button.textContent = label;
    button.className = 'minorButton';

    button.addEventListener('click', () => {
        if (!element || !functionName) {
            return;
        }
        if (typeof functionName === 'function') {
            functionName.call(element);
            return;
        }
        const normalizedName = String(functionName).trim().replace(/\(\)\s*$/, "");
        const targetFunc = element[normalizedName];
        if (typeof targetFunc === 'function') {
            targetFunc.call(element, element);
        }
    });

    container.appendChild(labelEl);
    container.appendChild(button);

    return container;
}

