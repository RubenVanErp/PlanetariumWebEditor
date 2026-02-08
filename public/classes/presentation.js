import { Slide } from "./slide.js";

export class Presentation {
    constructor(projectName = "planetariumPresentation") {
        this.projectName = projectName
        this.slides = [];
        this.addBlankSlide();
    }

    getSlide(n) {
        if (n >= 0 && n < this.slides.length) {
            return this.slides[n];
        }
        return null;
    }

    savePresentation(filename = this.projectName+".json") {
        const data = {
            slides: this.slides.map((slide) => ({
                ...slide,
                elements: slide.elements.map((element) => ({
                    ...element
                }))
            }))
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        return json;
    }

    addBlankSlide() {
        const uniqueId = `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.slides.push(new Slide(uniqueId));
    }

    removeSlide(slide) {
        
    }
}
