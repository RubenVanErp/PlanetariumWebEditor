import { Interval } from "./subclasses/interval.js";


export class Element {
    constructor(parentSlide, name, mediaType, mediaPath, projection) {
        this.parentSlide = parentSlide
        this.name = name;
        this.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.mediaType = mediaType;
        this.position = [new Interval(this, "position", 0, Infinity, { phi: 0, theta: 0 }, { phi: 0, theta: 0 }, 0, "static")];
        this.scale = [new Interval(this, "scale", 0, Infinity, 1, 1, 0, "static")];
        this.rotation = [new Interval(this, "rotation", 0, Infinity, 0, 0, 0, "static")];
        this.opacity = [new Interval(this, "opacity", 0, Infinity, 1, 1, 0, "static")];
        this.layer = [new Interval(this, "layer", 0, Infinity, 0, 0, 0, "static")];
        this.paused = [new Interval(this, "paused", 0, Infinity, false, false, 0, "static")];
        this.looping = [new Interval(this, "looping", 0, Infinity, true, true, 0, "static")];
        this.mediaPath = mediaPath;
        this.projection = projection;
    }


    moveElement(position) {
        this.position[0].startValue = position
        this.position[0].endValue = position
    }

    rotateElement(rotation) {
        this.rotation[0].startValue = rotation
        this.rotation[0].endValue = rotation
    }

    scaleElement(scale) {
        this.scale[0].startValue = scale
        this.scale[0].endValue = scale
    }

    togglePause() {
        this.paused[0].startValue != this.paused[0].startValue
        this.paused[0].endValue != this.paused[0].endValue
    }

    setOpacity(opacity) {
        this.opacity[0].startValue = opacity
        this.opacity[0].endValue = opacity
    }

    setLayer(layer) {
        this.layer[0].startValue = layer
        this.layer[0].endValue = layer
    }

    setProjection(projection) {
        this.projection = projection
    }

    setMediaPath(MediaPath) {
        this.MediaPath = MediaPath
    }

    getInterval(t, parameter) {
        const parameterDict = {"position" : this.position, "scale" : this.scale, "rotation" : this.rotation, "opacity" : this.opacity, "layer" : this.layer, "paused" : this.paused, "looping" : this.looping}
        let intervals = parameterDict[parameter]
        let finalInterval = null
        for (let interval of intervals) {
            if (interval.startTime <= t && interval.endTime >= t){
                finalInterval = interval
            }
        }
        return finalInterval
    }

    deleteMe() {
        console.log("hit")
        this.parentSlide.removeElement(this)
    }

    getOptions() {
        const imageOptions = [
            { label: "Position", type: "doubleSlider", parameters: [[-180, -360], [180, 360], [0, 0]] },
            { label: "Scale", type: "slider", parameters: [0, 100, 1] },
            { label: "Rotation", type: "slider", parameters: [-360, 360, 0] },
            { label: "Opacity", type: "slider", parameters: [0, 100, 100] },
            { label: "Layer", type: "numberBox", parameters: [0, Infinity, 0] },
            { label: "Projection Type", type: "dropdown", parameters: [["Regular", "Regular-Bottom-Down", "Panoramic", "Cylindrical", "Fulldome"], "Regular"] },
            { label: "Media Path", type: "textBox", parameters: ["", ""] },
            { label: "Delete Element", type: "button", parameters: ["deleteMe"]}
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
            { label: "Media Path", type: "textBox", parameters: ["", ""] },
            { label: "Delete Element", type: "button", parameters: ["deleteMe"]}
        ]
        const textOptions = [
            { label: "Content", type: "textBox", parameters: ["", "Hello World"] },
            { label: "Position", type: "doubleSlider", parameters: [[-360, -180], [360, 180], [0, 0]] },
            { label: "Scale", type: "slider", parameters: [0, 100, 1] },
            { label: "Rotation", type: "slider", parameters: [-360, 360, 0] },
            { label: "Opacity", type: "slider", parameters: [0, 100, 100] },
            { label: "Layer", type: "numberBox", parameters: [0, Infinity, 0] },
            { label: "Projection Type", type: "dropdown", parameters: [["Panoramic", "Regular", "Regular-Bottom-Down", "Cylindrical", "Fulldome"], "Panoramic"] },
            { label: "Delete Element", type: "button", parameters: ["deleteMe"]}
        ]
        const dict = { "image": imageOptions, "video": videoOptions, "text": textOptions }
        return dict[this.mediaType]
    }
}
