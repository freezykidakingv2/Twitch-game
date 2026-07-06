const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

function LoadCharacter() {
    ctx.beginPath();
    ctx.arc(250, 850, 30, 0, Math.PI * 2)
    ctx.fillStyle = "orange";

    ctx.fill();
    ctx.fillRect(250, 850, 10, 175);
}

var j = 1170;

ctx.fillStyle = "blue";
for (let i = 200; i <= 1700; i += 400) {
    console.log(i);
    console.log(j);
    ctx.fillRect(i, j -= 150, 160, 50);
}

function test() {
    console.log("Circle works");
}

test();
LoadCharacter();