const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

var jump = 850;
var RandL = 250;
var rotate = true;
function LoadCharacter(height, sides) {
    console.log(rotate);
    ctx.beginPath();
    ctx.arc(sides, height, 30, 0, Math.PI * 2)
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.fillRect(sides, height, 20, 130);
    ctx.save();
    if (rotate == true) {
        ctx.rotate(Math.PI / 3);
        ctx.fillRect(sides, height, 90, 90);
        rotate = false;
    }
    console.log(sides, height, "leg");
    ctx.restore();
}

LoadCharacter(jump, RandL);

var j = 1170;

function LoadObstacles() {
    j = 1170;
    ctx.fillStyle = "blue";
    for (let i = 200; i <= 1700; i += 400) {
        ctx.fillRect(i, j -= 150, 160, 50);
    }
}

LoadObstacles();

document.addEventListener("keydown", (event) => {
    if (event.key == " ") {
        jump -= 150;
        console.log(jump);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(jump, RandL);
        setTimeout(() => {
            jump += 150;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            LoadObstacles();
            LoadCharacter(jump, RandL);
        }, 250);
    }
    else if (event.key == "d") {
        RandL += 150;
        console.log(RandL);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(jump, RandL);
    }
    else if (event.key == "a") {
        RandL -= 150;
        console.log(RandL);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        LoadObstacles();
        LoadCharacter(jump, RandL);
    }
})
