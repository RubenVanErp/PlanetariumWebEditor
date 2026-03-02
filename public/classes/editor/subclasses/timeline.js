import * as func from "../functions/editorFunctions.js";

export class Timeline {
    constructor(editor) {
        this.editor = editor;
        this.currentTime = editor?.timestamp ?? 0;
        this.isDragging = false;
        this.lastTick = null;

        const existing = document.getElementById('timeLineContainer');
        if (existing) {
            existing.remove();
        }

        this.createDivs();
        this.bindEvents();

        const initialDuration = this.editor?.currentSlide?.animationDuration ?? 10;
        this.totalDurationInput.value = initialDuration;
        this.setCurrentTime(this.editor?.timestamp ?? 0);
        this.updateAnimatedToggle(this.editor?.currentSlide);

        if (!this.isPaused()) {
            requestAnimationFrame(this.tick);
        }

        window.addEventListener('resize', this.updateMarkerFromTime);
    }

    isPaused = () => this.editor?.paused ?? true;

    getTotalDuration = () => {
        if (this.editor?.currentSlide?.animationDuration != null) {
            return this.editor.currentSlide.animationDuration;
        }
        return parseFloat(this.totalDurationInput.value) || 1;
    };

    setTotalDuration = (value) => {
        const duration = Math.max(0, value || 0);
        this.totalDurationInput.value = duration;
        if (this.editor?.currentSlide) {
            this.editor.currentSlide.animationDuration = duration;
        }
        this.updateMarkerFromTime();
    };

    setCurrentTime = (value) => {
        const duration = this.getTotalDuration();
        const clamped = Math.min(Math.max(0, value || 0), duration);
        this.currentTime = clamped;
        this.currentTimeInput.value = clamped.toFixed(2);
        if (this.editor) {
            this.editor.timestamp = clamped;
        }
        this.updateMarkerFromTime();
    };

    updateMarkerFromTime = () => {
        const duration = this.getTotalDuration();
        const rect = this.timelineTrack.getBoundingClientRect();
        if (!rect.width || duration <= 0) {
            this.marker.style.left = '0px';
            return;
        }
        const ratio = this.currentTime / duration;
        this.marker.style.left = `${ratio * rect.width}px`;
    };

    updateTimeFromPosition = (clientX) => {
        const rect = this.timelineTrack.getBoundingClientRect();
        const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const duration = this.getTotalDuration();
        const newTime = duration * (x / rect.width);
        this.setCurrentTime(newTime);
    };

    tick = (now) => {
        if (this.isPaused()) {
            return;
        }
        if (this.lastTick == null) {
            this.lastTick = now;
        }
        const deltaSeconds = (now - this.lastTick) / 1000;
        this.lastTick = now;
        const duration = this.getTotalDuration();
        if (duration > 0) {
            let nextTime = this.currentTime + deltaSeconds;
            if (nextTime >= duration) {
                nextTime = nextTime % duration;
            }
            this.setCurrentTime(nextTime);
        }
        requestAnimationFrame(this.tick);
    };

    setPaused = (paused) => {
        if (this.editor) {
            this.editor.paused = paused;
        }
        this.playPauseButton.textContent = this.isPaused() ? 'Play' : 'Pause';
        if (!this.isPaused()) {
            this.lastTick = null;
            requestAnimationFrame(this.tick);
        }
    };

    bindEvents() {
        this.onKeyDown = (e) => {
            if (e.code !== 'Space' || e.repeat) {
                return;
            } 
            const target = e.target;
            const isFormField = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
            if (isFormField) {
                return;
            }
            e.preventDefault();
            this.setPaused(!this.isPaused());
        };

        this.onPointerMove = (e) => {
            if (!this.isDragging) return;
            this.updateTimeFromPosition(e.clientX);
        };

        this.stopDragging = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.marker.classList.remove('timeline-marker-dragging');
            document.removeEventListener('mousemove', this.onPointerMove);
            document.removeEventListener('mouseup', this.stopDragging);
        };

        this.marker.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.setPaused(true);
            this.isDragging = true;
            this.marker.classList.add('timeline-marker-dragging');
            document.addEventListener('mousemove', this.onPointerMove);
            document.addEventListener('mouseup', this.stopDragging);
        });

        this.timelineTrack.addEventListener('mousedown', (e) => {
            this.setPaused(true);
            this.updateTimeFromPosition(e.clientX);
            this.isDragging = true;
            this.marker.classList.add('timeline-marker-dragging');
            document.addEventListener('mousemove', this.onPointerMove);
            document.addEventListener('mouseup', this.stopDragging);
        });

        this.playPauseButton.addEventListener('click', () => {
            this.setPaused(!this.isPaused());
        });

        this.animatedToggleInput.addEventListener('change', (e) => {
            if (this.editor?.currentSlide) {
                this.editor.currentSlide.isAnimated = e.target.checked;
                func.updateOptions(this.editor.currentElement)
            }
        });

        this.currentTimeInput.addEventListener('blur', () => {
            this.setCurrentTime(parseFloat(this.currentTimeInput.value));
        });

        this.totalDurationInput.addEventListener('input', (e) => {
            this.setTotalDuration(parseFloat(e.target.value));
        });

        this.totalDurationInput.addEventListener('blur', () => {
            this.setTotalDuration(parseFloat(this.totalDurationInput.value));
        });

        window.addEventListener('keydown', this.onKeyDown);
    }

    updateAnimatedToggle(slide) {
        if (!this.animatedToggleInput) {
            return;
        }
        this.animatedToggleInput.checked = slide?.isAnimated ?? false;
    }

    syncFromSlide(slide) {
        if (!slide) {
            return;
        }
        this.totalDurationInput.value = slide.animationDuration ?? 10;
        this.setCurrentTime(0);
        this.updateAnimatedToggle(slide);
    }

    createDivs() {
            this.timeLineContainer = document.createElement('div');
            this.timeLineContainer.id = 'timeLineContainer';
            this.timeLineContainer.className = 'timeline-container';

            this.leftControls = document.createElement('div');
            this.leftControls.className = 'timeline-left-controls';

            this.playPauseButton = document.createElement('button');
            this.playPauseButton.className = 'timeline-play-button';
            this.playPauseButton.textContent = this.isPaused() ? 'Play' : 'Pause';

            this.animatedToggleLabel = document.createElement('label');
            this.animatedToggleLabel.className = 'timeline-toggle';
            this.animatedToggleInput = document.createElement('input');
            this.animatedToggleInput.type = 'checkbox';
            this.animatedToggleInput.className = 'timeline-toggle-checkbox';
            this.animatedToggleText = document.createElement('span');
            this.animatedToggleText.className = 'timeline-toggle-text';
            this.animatedToggleText.textContent = 'Animated';
            this.animatedToggleLabel.appendChild(this.animatedToggleInput);
            this.animatedToggleLabel.appendChild(this.animatedToggleText);

            this.currentTimeGroup = document.createElement('div');
            this.currentTimeGroup.className = 'timeline-input-group';

            this.currentTimeLabel = document.createElement('div');
            this.currentTimeLabel.className = 'timeline-input-label';
            this.currentTimeLabel.textContent = 'Time';

            this.currentTimeInput = document.createElement('input');
            this.currentTimeInput.type = 'number';
            this.currentTimeInput.min = '0';
            this.currentTimeInput.step = '0.01';
            this.currentTimeInput.className = 'timeline-input';

            this.timelineTrack = document.createElement('div');
            this.timelineTrack.className = 'timeline-track';

            this.line = document.createElement('div');
            this.line.className = 'timeline-line';

            this.marker = document.createElement('div');
            this.marker.className = 'timeline-marker';

            this.totalDurationGroup = document.createElement('div');
            this.totalDurationGroup.className = 'timeline-input-group';

            this.totalDurationLabel = document.createElement('div');
            this.totalDurationLabel.className = 'timeline-input-label';
            this.totalDurationLabel.textContent = 'Total';

            this.totalDurationInput = document.createElement('input');
            this.totalDurationInput.type = 'number';
            this.totalDurationInput.min = '0.01';
            this.totalDurationInput.step = '0.01';
            this.totalDurationInput.className = 'timeline-input';

            this.timelineTrack.appendChild(this.line);
            this.timelineTrack.appendChild(this.marker);
            this.currentTimeGroup.appendChild(this.currentTimeLabel);
            this.currentTimeGroup.appendChild(this.currentTimeInput);
            this.totalDurationGroup.appendChild(this.totalDurationLabel);
            this.totalDurationGroup.appendChild(this.totalDurationInput);
            this.leftControls.appendChild(this.playPauseButton);
            this.leftControls.appendChild(this.animatedToggleLabel);
            this.timeLineContainer.appendChild(this.leftControls);
            this.timeLineContainer.appendChild(this.currentTimeGroup);
            this.timeLineContainer.appendChild(this.timelineTrack);
            this.timeLineContainer.appendChild(this.totalDurationGroup);

            document.body.appendChild(this.timeLineContainer);

    }
}

