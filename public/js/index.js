const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

const DEGREE = Math.PI / 180;
const sprite = new Image();
const SCORE_S = new Audio();
const FLAP = new Audio();
const HIT = new Audio();
const SWOOSHING = new Audio();
const DIE = new Audio();

sprite.src = "images/sprite.png";
SCORE_S.src = "audio/sfx_point.wav";
FLAP.src = "audio/sfx_flap.wav";
HIT.src = "audio/sfx_hit.wav";
SWOOSHING.src = "audio/sfx_swooshing.wav";
DIE.src = "audio/sfx_die.wav";

var frames = 0;

var secondsPassed;
var oldTimeStamp;
var fps;
var rate = 60;
var info;

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
};

const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29
};

const medal = {
    type: [
        { sX: 313, sY: 112 },
        { sX: 360, sY: 112 },
        { sX: 360, sY: 157 },
        { sX: 313, sY: 157 },
    ],
    w: 45,
    h: 45,
    x: 74,
    y: cvs.height - 305,
    medalha: 0,

    draw: function () {
        ctx.drawImage(sprite, this.type[this.medalha].sX, this.type[this.medalha].sY, this.w, this.h, this.x, this.y, this.w, this.h);
    },

    update: function () {
        let v = score.value;

        if (v <= 10) {
            this.medalha = 0;     // lata            
        } else if (v > 10 && v <= 30) {
            this.medalha = 1;     // prata
        } else if (v >= 31 && v <= 40) {
            this.medalha = 2;     // bronse
        } else if (v >= 41) {
            this.medalha = 3;     // ouro
        }
    },
};

const bg = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: cvs.height - 226,

    position: [],

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, (this.x + this.w), this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, (this.x + (this.w * 2)), this.y, this.w, this.h);
    },

    update: function () {
        this.x = this.x - 0.25;

        if (this.x < -275) {
            this.x = 0;
        }
    }
};

const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,

    dx: 2,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }
};

const pipes = {
    position: [],

    top: {
        sX: 553,
        sY: 0
    },
    bottom: {
        sX: 502,
        sY: 0
    },

    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            // top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

            // bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }
    },

    update: function () {
        if (state.current !== state.game) return;

        if (frames % 100 == 0) {
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1)
            });
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let bottomPipeYPos = p.y + this.h + this.gap;

            // COLLISION DETECTION
            // TOP PIPE
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                state.current = state.over;
                //HIT.play();
            }
            // BOTTOM PIPE
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
                state.current = state.over;
                //HIT.play();
            }

            // MOVE THE PIPES TO THE LEFT
            p.x -= this.dx;

            // if the pipes go beyond canvas, we delete them from the array
            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                //SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }

        bg.update();
    },

    reset: function () {
        this.position = [];
    }

}

const score = {
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,

    w: 45,
    h: 45,
    x: 74,
    y: cvs.height - 305,

    draw: function () {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width / 2, 50);
            ctx.strokeText(this.value, cvs.width / 2, 50);

        } else if (state.current == state.over) {

            // let type = [
            //     { sX: 313, sY: 112 },
            //     { sX: 360, sY: 112 },
            //     { sX: 360, sY: 157 },
            //     { sX: 313, sY: 157 },
            // ];

            // let  medal = 3;            

            // if (this.value > 0) {
            //     medal = 0;     // lata
            // } else if (this.value >= 2) {
            //     medal = 1;     // prata
            // } else if (this.value >= 3) {
            //     medal = 2;     // bronse
            // } else if (this.value == 5) {
            //     medal = 3;     // ouro
            // }

            //console.log(this.value, medal);

            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);

            // BEST SCORE
            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228);

            // MEDAL
            medal.update();
            medal.draw();
            //ctx.drawImage(sprite, type[medal].sX, type[medal].sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    },

    reset: function () {
        this.value = 0;
    }
}

cvs.addEventListener("click", function (evt) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            if (bird.y - bird.radius <= 0) return;
            bird.flap();
            FLAP.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;

            // CHECK IF WE CLICK ON THE START BUTTON
            if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
});

const Info = (text) => {
    ctx.beginPath();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = text.font;
    ctx.lineWidth = 0.5;
    ctx.fillStyle = text.color;
    ctx.strokeStyle = "#ffffff";
    ctx.fillText(text.title, text.x, text.y);
    ctx.strokeText(text.title, text.x, text.y);
    ctx.closePath();
};

const canvasclear = (cvbgcolor, cvfillcolor, x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.fillStyle = cvbgcolor;
    ctx.strokeStyle = cvfillcolor;
    ctx.fillRect(x1, y1, x2, y2);
    ctx.strokeRect(x1, y1, x2, y2);
    ctx.closePath();
};

const main = (timeStamp) => {
    update(timeStamp);

    setTimeout(function () {
        requestAnimationFrame(main);
    }, (1000 / rate));
};

const update = (timeStamp) => {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fps = Math.round(1 / secondsPassed);

    canvasclear("#70c5ce", "#ffffff", 0, 0, 320, 480);

    Info({
        title: "FPS:",
        font: "20px Teko",
        x: 10,
        y: 10,
        color: '#000000'
    });

    Info({
        title: String(fps).padStart(2, '0'),
        font: "20px Teko",
        x: 50,
        y: 10,
        color: '#000000'
    });

    bg.draw();
    fg.draw();
    // bird.draw();
    // pipes.draw();
    // getReady.draw();
    // gameOver.draw();
    // score.draw();
    frames++;
    // bird.update();
    fg.update();
    // pipes.update();

    state.current = state.game;
    // SWOOSHING.play();
};

const reset = () => {
    
};

const start = () => {
    reset();
    main();
};

start();