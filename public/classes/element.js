export class Element {
    constructor(name, mediaType, mediaPath, projection) {
        this.name = name;
        this.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.mediaType = mediaType;
        this.position = { phi: 0, theta: 0 };
        this.scale = 1.0;
        this.rotation = 0.0;
        this.opacity = 1.0;
        this.layer = 0;
        this.paused = false;
        this.looping = true;
        this.mediaPath = mediaPath;
        this.projection = projection;
    }


    moveElement(position) {
        this.position = position
    }

    rotateElement(alpha) {
        this.rotation = alpha
    }

    scaleElement(scale) {
        this.scale = scale
    }

    togglePause() {
        paused = !paused
    }

    setOpacity(opacity) {
        this.opacity = opacity
    }

    setLayer(layer) {
        this.layer = layer
    }

    setProjection(projection) {
        this.projection = projection
    }

    setMediaPath(MediaPath) {
        this.MediaPath = MediaPath
    }

    getOptions() {
        const imageOptions = [
            { label: "Position", type: "doubleSlider", parameters: [[-360, -180], [360, 180], [0, 0]] },
            { label: "Scale", type: "slider", parameters: [0, 100, 1] },
            { label: "Rotation", type: "slider", parameters: [-360, 360, 0] },
            { label: "Opacity", type: "slider", parameters: [0, 100, 100] },
            { label: "Layer", type: "numberBox", parameters: [0, Infinity, 0] },
            { label: "Projection Type", type: "dropdown", parameters: [["Regular", "Regular-Bottom-Down", "Panoramic", "Cylindrical", "Fulldome"], "Regular"] },
            { label: "Media Path", type: "textBox", parameters: ["", ""] }
        ]
        const videoOptions = [
            { label: "Paused", type: "toggle", parameters: [false] },
            { label: "Looping", type: "toggle", parameters: [true] },
            { label: "Position", type: "doubleSlider", parameters: [[-360, -180], [360, 180], [0, 0]] },
            { label: "Scale", type: "slider", parameters: [0, 100, 1] },
            { label: "Rotation", type: "slider", parameters: [-360, 360, 0] },
            { label: "Opacity", type: "slider", parameters: [0, 100, 100] },
            { label: "Layer", type: "numberBox", parameters: [0, Infinity, 0] },
            { label: "Projection Type", type: "dropdown", parameters: [["Regular", "Regular-Bottom-Down", "Panoramic", "Cylindrical", "Fulldome"], "Regular"] },
            { label: "Media Path", type: "textBox", parameters: ["", ""] }
        ]
        const textOptions = [
            { label: "Content", type: "textBox", parameters: ["", "Hello World"] },
            { label: "Position", type: "doubleSlider", parameters: [[-360, -180], [360, 180], [0, 0]] },
            { label: "Scale", type: "slider", parameters: [0, 100, 1] },
            { label: "Rotation", type: "slider", parameters: [-360, 360, 0] },
            { label: "Opacity", type: "slider", parameters: [0, 100, 100] },
            { label: "Layer", type: "numberBox", parameters: [0, Infinity, 0] },
            { label: "Projection Type", type: "dropdown", parameters: [["Panoramic", "Regular", "Regular-Bottom-Down", "Cylindrical", "Fulldome"], "Panoramic"] },
            { label: "Media Path", type: "textBox", parameters: ["", ""] }
        ]
        const dict = { "image": imageOptions, "video": videoOptions, "text": textOptions }
        return dict[this.mediaType]
    }
}
