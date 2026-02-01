class ImageTransformer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        this.canvas.width = displayWidth * dpr;
        this.canvas.height = displayHeight * dpr;
        this.gl = this.canvas.getContext('webgl');
        this.program = null;
        this.texture = null;
        this.timeLocation = null;
        this.textureLocation = null;
        this.thetaLocation = null;
        this.phiLocation = null;
        this.alphaLocation = null;
        this.widthLocation = null;
        this.heightLocation = null;
        this.startTime = 0;
        this.video = null;
        this.image = null;
        this.currentTheta = 0.0;
        this.currentPhi = 0;
        this.currentWidth = 1;
        this.currentHeight = 1;
        this.currentAlpha = 0.0;
        this.setupSliders();
    }

    setupSliders() {
        const thetaSlider = document.getElementById('thetaSlider');
        const phiSlider = document.getElementById('phiSlider');
        const widthSlider = document.getElementById('widthSlider');
        const heightSlider = document.getElementById('heightSlider');
        const alphaSlider = document.getElementById('alphaSlider');

        if (thetaSlider) {
            thetaSlider.addEventListener('input', (e) => {
                this.currentTheta = parseFloat(e.target.value);
            });
        }
        if (phiSlider) {
            phiSlider.addEventListener('input', (e) => {
                this.currentPhi = parseFloat(e.target.value);
            });
        }
        if (widthSlider) {
            widthSlider.addEventListener('input', (e) => {
                this.currentWidth = parseFloat(e.target.value);
            });
        }
        if (heightSlider) {
            heightSlider.addEventListener('input', (e) => {
                this.currentHeight = parseFloat(e.target.value);
            });
        }
        if (alphaSlider) {
            alphaSlider.addEventListener('input', (e) => {
                this.currentAlpha = parseFloat(e.target.value);
            });
        }
    }

    initShaders() {
        const vertexShader = `
            attribute vec2 position;
            attribute vec2 texCoord;
            varying vec2 vTexCoord;
            
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
                vTexCoord = texCoord;
            }
        `;

        const fragmentShader = `
            precision mediump float;
            const float PI = 3.14159265358979323846;
            uniform sampler2D uTexture;
            uniform float uTime;
            uniform float uTheta;
            uniform float uPhi;
            uniform float uAlpha;
            uniform float uWidth;
            uniform float uHeight;
            varying vec2 vTexCoord;

            // sph = (r, phi, theta) where theta is azimuth, phi is elevation
            vec3 sphToCart(vec3 sph) {
                float r = sph.x;
                float theta = sph.z;
                float phi = sph.y;
                float sphi = sin(phi);
                return vec3(
                    r * sphi * cos(theta),
                    r * sphi * sin(theta),
                    r * cos(phi)
                );
            }

            vec2 rotateVec2d(vec2 vector, float angle) {
                mat2 rotationMatrix = mat2(
                cos(angle), -sin(angle),
                sin(angle), cos(angle)
                );
                
                return rotationMatrix * vector;
            }

            // Rotate vector v around axis by angle
            vec3 rotateVec(vec3 v, vec3 axis, float angle) {
                vec3 a = normalize(axis);
                float c = cos(angle);
                float s = sin(angle);
                float t = 1.0 - c;

                mat3 rotationMatrix = mat3(
                    t*a.x*a.x + c,     t*a.x*a.y - s*a.z, t*a.x*a.z + s*a.y,
                    t*a.x*a.y + s*a.z, t*a.y*a.y + c,     t*a.y*a.z - s*a.x,
                    t*a.x*a.z - s*a.y, t*a.y*a.z + s*a.x, t*a.z*a.z + c
                );
                return rotationMatrix * v;
            }


            // Cylindrical projection parameters (uTheta = theta of center, uPhi = z of center. uHeight in z, uWidth in theta)
            vec2 cylindrical(vec2 uv) {
                float x = (uv.x-0.5)*2.0;
                float y = (uv.y-0.5)*2.0;
                float phi = PI/2.0*sqrt(x*x + y*y);
                float theta = atan(y,x);
                
                x = (mod((theta - uTheta)+0.5*PI,2.0*PI)-0.5*PI);
                y = (tan(PI/2.0 - phi)- uPhi);

                vec2 rotatedVec = rotateVec2d(vec2(x,y), uAlpha);

                vec2 scaledVec = vec2(rotatedVec.x/uWidth + 0.5, rotatedVec.y/uHeight + 0.5);

                return scaledVec;
            }



            // panoramic projection parameters (uTheta = theta of center, uPhi = phi of center. uHeight in phi, uWidth in theta)
            vec2 panoramic(vec2 uv) {
                float x = (uv.x-0.5)*2.0;
                float y = (uv.y-0.5)*2.0;
                float phi = PI/2.0*sqrt(x*x + y*y);
                float theta = atan(y,x);
                
                x = (mod((theta - uTheta) +0.5*PI, 2.0 * PI)-0.5 * PI);
                y = (mod((-phi  - uPhi)   +0.5*PI, 2.0 * PI)-0.5 * PI);

                vec2 rotatedVec = rotateVec2d(vec2(x,y), uAlpha);

                vec2 scaledVec = vec2(rotatedVec.x/uWidth + 0.5, rotatedVec.y/uHeight + 0.5);

                return scaledVec;
            }




            vec2 sphericalTangent(vec2 uv) {
                vec3 n = sphToCart(vec3(1,uPhi,uTheta));
                vec3 s = normalize(cross(n, sphToCart(vec3(1.0, PI/2.0, uTheta))));
                vec3 t = cross(n, s);

                float x = (uv.x-0.5)*2.0;
                float y = (uv.y-0.5)*2.0;
                float r = PI/2.0*sqrt(x*x + y*y);
                float theta = atan(y,x);
                vec3 domeOfPixel = sphToCart(vec3(1.0, r, theta));
                // Scale domeOfPixel so (domeOfPixel - n) is orthogonal to n: dot(domeOfPixel, n) = dot(n, n) = 1.
                float denom = dot(domeOfPixel, n);
                if (abs(denom) > 1e-5) {
                    float s = 1.0 / denom;
                    if (s < 0.0) {
                        return vec2(-1, -1); 
                    }
                    domeOfPixel *= s;
                } else {
                    return vec2(-1, -1);    
                }

                domeOfPixel = rotateVec(domeOfPixel, n, uAlpha);

                float xs = dot(s,(domeOfPixel-n));
                float ys = dot(t,(domeOfPixel-n));

            if (abs(xs) < uWidth/2.0 && abs(ys) < uHeight/2.0) {
                    return vec2((xs+uWidth/2.0)/uWidth, (ys+uHeight/2.0)/uHeight);
                } else {
                    return vec2(-1, -1);
                }
            }






            vec2 sphericalTangentAlwaysBottonDown(vec2 uv) {
                vec3 n = sphToCart(vec3(1,uPhi,uTheta));
                vec3 s = normalize(cross(sphToCart(vec3(1.0, 0.001, uTheta)), n));
                vec3 t = cross(n, s);

                float x = (uv.x-0.5)*2.0;
                float y = (uv.y-0.5)*2.0;
                float r = PI/2.0*sqrt(x*x + y*y);
                float theta = atan(y,x);
                vec3 domeOfPixel = sphToCart(vec3(1.0, r, theta));
                // Scale domeOfPixel so (domeOfPixel - n) is orthogonal to n: dot(domeOfPixel, n) = dot(n, n) = 1.
                float denom = dot(domeOfPixel, n);
                if (abs(denom) > 1e-5) {
                    float s = 1.0 / denom;
                    if (s < 0.0) {
                        return vec2(-1, -1);
                    }
                    domeOfPixel *= s;
                } else {
                    return vec2(-1, -1);    
                }

                domeOfPixel = rotateVec(domeOfPixel, n, uAlpha);

                float xs = dot(s,(domeOfPixel-n));
                float ys = dot(t,(domeOfPixel-n));

            if (abs(xs) < uWidth/2.0 && abs(ys) < uHeight/2.0) {
                    return vec2((xs+uWidth/2.0)/uWidth, (ys+uHeight/2.0)/uHeight);
                } else {
                    return vec2(-1, -1);
                }
            }



            void main() {
                vec2 uv = sphericalTangent(vTexCoord);

                if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                    return;
                }
                vec4 texColor = texture2D(uTexture, uv);
                gl_FragColor = vec4(texColor.rgb, 0.9); //Example: set alpha to 0.5
            }
        `;

        const vertShader = this.compileShader(vertexShader, this.gl.VERTEX_SHADER);
        const fragShader = this.compileShader(fragmentShader, this.gl.FRAGMENT_SHADER);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertShader);
        this.gl.attachShader(this.program, fragShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
        }

        this.gl.useProgram(this.program);
        this.timeLocation = this.gl.getUniformLocation(this.program, 'uTime');
        this.textureLocation = this.gl.getUniformLocation(this.program, 'uTexture');
        this.thetaLocation = this.gl.getUniformLocation(this.program, 'uTheta');
        this.phiLocation = this.gl.getUniformLocation(this.program, 'uPhi');
        this.alphaLocation = this.gl.getUniformLocation(this.program, 'uAlpha');
        this.widthLocation = this.gl.getUniformLocation(this.program, 'uWidth');
        this.heightLocation = this.gl.getUniformLocation(this.program, 'uHeight');
    }

    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    setupBuffers() {
        const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
        const texCoords = [0, 0, 1, 0, 0, 1, 1, 1];

        const posBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        const posAttrib = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(posAttrib);
        this.gl.vertexAttribPointer(posAttrib, 2, this.gl.FLOAT, false, 0, 0);

        const texBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords), this.gl.STATIC_DRAW);

        const texAttrib = this.gl.getAttribLocation(this.program, 'texCoord');
        this.gl.enableVertexAttribArray(texAttrib);
        this.gl.vertexAttribPointer(texAttrib, 2, this.gl.FLOAT, false, 0, 0);
    }

    loadVideoTexture(videoElement) {
        return new Promise((resolve) => {
            this.video = videoElement;
            this.video.crossOrigin = 'anonymous';
            this.video.playsInline = true;
            this.video.muted = true;
            this.video.addEventListener('error', (e) => {
                console.error('Video error/loading failed', e, this.video?.error);
            });

            const onReady = () => {
                this.texture = this.gl.createTexture();
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
                this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

                // Initialize texture with first frame
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.video);
                // Keep canvas at fixed 1000x1000 drawing buffer
                this.canvas.width = 1000;
                this.canvas.height = 1000;

                resolve();
            };

            if (this.video.readyState >= 2) {
                onReady();
            } else {
                this.video.addEventListener('loadeddata', onReady, { once: true });
            }

            // Autoplay if possible; ignore promise rejection (user gesture may be needed)
            this.video.play().catch(() => {});
        });
    }

    loadImageTexture(imageElement) {
        return new Promise((resolve) => {
            this.image = imageElement;
            const onReady = () => {
                this.texture = this.gl.createTexture();
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
                this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
                // Keep canvas at fixed 1000x1000 drawing buffer
                this.canvas.width = 1000;
                this.canvas.height = 1000;
                resolve();
            };

            if (this.image.complete) {
                onReady();
            } else {
                this.image.addEventListener('load', onReady, { once: true });
            }
        });
    }

    render(elapsedSeconds) {
        this.gl.useProgram(this.program);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);  // transparent
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        if (this.video && this.video.readyState >= 2) {
            // Update texture with current video frame
            this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, 0, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.video);
        }
        this.gl.uniform1i(this.textureLocation, 0);
        this.gl.uniform1f(this.timeLocation, elapsedSeconds);
        this.gl.uniform1f(this.thetaLocation, this.currentTheta || 0.0);
        this.gl.uniform1f(this.phiLocation, this.currentPhi || 0);
        this.gl.uniform1f(this.alphaLocation, this.currentAlpha || 0.0);
        this.gl.uniform1f(this.widthLocation, this.currentWidth || 1);
        this.gl.uniform1f(this.heightLocation, this.currentHeight || 1);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    animate() {
        const now = performance.now();
        const elapsedSeconds = (now - this.startTime) / 1000;
        this.render(elapsedSeconds);
        requestAnimationFrame(() => this.animate());
    }

    async initWithVideo(videoElement) {
        this.initShaders();
        this.setupBuffers();
        await this.loadVideoTexture(videoElement);
        this.startTime = performance.now();
        this.animate();
    }

    async initWithImage(imageElement) {
        this.initShaders();
        this.setupBuffers();
        await this.loadImageTexture(imageElement);
        this.startTime = performance.now();
        this.animate();
    }

    async initWithMedia(source) {
        const isString = typeof source === 'string';
        const isVideoUrl = (url) => /\.(mp4|webm|ogg)$/i.test(url);

        if (isString) {
            if (isVideoUrl(source)) {
                const video = document.createElement('video');
                video.src = source;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                await this.initWithVideo(video);
            } else {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = source;
                await this.initWithImage(img);
            }
            return;
        }

        if (source instanceof HTMLVideoElement) {
            await this.initWithVideo(source);
        } else if (source instanceof HTMLImageElement) {
            await this.initWithImage(source);
        } else {
            throw new Error('Unsupported media source. Provide URL, HTMLVideoElement, or HTMLImageElement.');
        }
    }
}


const transformer = new ImageTransformer('canvas');
transformer.initWithMedia('assets/calibrationVideo.mp4');

let last = performance.now();
let frames = 0;
let fps = 0;

function tick() {
  const now = performance.now();
  frames++;
  if (now - last >= 1000) { // every second
    fps = frames;
    frames = 0;
    last = now;
    console.log('FPS:', fps);
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

