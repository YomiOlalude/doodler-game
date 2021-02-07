let grid = document.querySelector(".grid");
let doodler = document.createElement("div");
let doodlerLeft = 50;
let startPoint = 250;
let doodlerBottom = startPoint;
let isGameOver = false;
let PlatformCount = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;
let score = 0;


createDoodler = () => {
    grid.appendChild(doodler);
    doodler.classList ="doodler";
    doodlerLeft = platforms[0].left
    doodler.style.left = doodlerLeft + "px";
    doodler.style.bottom = doodlerBottom + "px";
}

class Platform {
    constructor(newPlatformBottom) {
       this.bottom = newPlatformBottom;
       this.left = Math.random() * 315;
       this.graphic = document.createElement("div");

       let graphic = this.graphic;
       graphic.style.left = this.left + "px";
       graphic.style.bottom = this.bottom + "px";
       graphic.classList = "platform";
       grid.appendChild(graphic);

    }
}


createPlatforms = () => {
    for(i = 0 ; i < PlatformCount ; i++) {
        let platformSpacing = 600 / PlatformCount
        let newPlatformBottom = 100 + i * platformSpacing;
        let newPlatform = new Platform(newPlatformBottom)
        platforms.push(newPlatform);
    }
}

movePlatforms = () => {
    if(doodlerBottom > 200) {
        platforms.forEach(platform => {
            platform.bottom -= 4;
            let graphic = platform.graphic;
            graphic.style.bottom = platform.bottom + "px";

            if (platform.bottom < 0) {
                let firstPlatform = platforms[0].graphic
                firstPlatform.classList.remove("platform");
                platforms.shift();
                score++;
                let newPlatform = new Platform(600);
                platforms.push(newPlatform)

            }
        })
    }
}

jump = () => {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
        doodlerBottom += 20;
        doodler.style.bottom = doodlerBottom + "px";
        if (doodlerBottom > startPoint + 200) {
            fall();
        }
    }, 30)
     
}

fall = () => {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
        doodlerBottom -= 5;
        doodler.style.bottom = doodlerBottom + "px";
        if (doodlerBottom <= 0) {
            gameOver();
        }
        platforms.forEach(platform => {
            if (
                (doodlerBottom >= platform.bottom) &&
                (doodlerBottom <= (platform.bottom + 15)) &&
                ((doodlerLeft + 60) >= platform.left) &&
                (doodlerLeft <= (platform.left + 85)) &&
                !isJumping
            ) {
               console.log("landed");
               startPoint = doodlerBottom;
               jump(); 
            }
        })
    }, 30)
}

gameOver = () => {
    console.log("GAME OVER");
    isGameOver = true;
    while (grid.lastChild === true ) {
        grid.removeChild(grid.lastChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
}

control = (event) => {
    if (event.keyCode === 37) {
        moveLeft();
    } else if (event.keyCode === 39) {
        moveRight();
    } else if (event.key === "UpArrow") {
        moveStraight();
    }
}

moveLeft = () => {
     if (isGoingRight) {
       clearInterval(rightTimerId);
       isGoingRight = false;
     }
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
    if (doodlerLeft >= 0) {
        doodlerLeft -=5;
        doodler.style.left = doodlerLeft + "px";
        } else {
            moveRight();
        }
    }, 20);
}

moveRight = () => {
    if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
        if (doodlerLeft <= 340) {
            doodlerLeft +=5;
            doodler.style.left = doodlerLeft + "px";
        } else {
            moveLeft();
        }
    }, 20);
}

moveStraight = () => {
    isGoingRight = false;
    isGoingLeft = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    
}

start = () => {
    if (!isGameOver) {
        createPlatforms();
        createDoodler();
        setInterval(movePlatforms, 30);
        jump();
        document.addEventListener("keyup", control)
    }
}

start();

