const mazeImg = document.getElementById("mazeImg");
const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');
const ghostImg = new Image();
ghostImg.src = "./slike/ghost.png"; // Load the ghost image
ctx.drawImage(mazeImg, 0, 0, canvas.width, canvas.height);

const cellSize = 20; // Adjust this based on your maze grid size

const points = [
    [234, 20], [234, 26], [202, 26], [202, 10], [154, 10], [154, 26], [170, 26], [170, 42], [186, 42], [186, 58],
    [202, 58], [202, 74], [186, 74], [186, 90], [202, 90], [202, 106], [234, 106], [234, 122], [202, 122], [202, 170],
    [170, 170], [170, 186], [138, 186], [138, 202], [106, 202], [106, 234], [122, 234], [122, 218], [154, 218],
    [154, 202], [170, 202], [170, 250], [154, 250], [154, 266], [138, 266], [138, 250], [122, 250], [122, 266],
    [106, 266], [106, 250], [90, 250], [90, 202], [42, 202], [42, 186], [26, 186], [26, 218], [74, 218], [74, 234],
    [58, 234], [58, 266], [90, 266], [90, 282], [42, 282], [42, 298], [26, 298], [26, 330], [10, 330], [10, 378],
    [26, 378], [26, 362], [42, 362], [42, 394], [10, 394], [10, 410], [26, 410], [26, 458], [42, 458], [42, 474],
    [74, 474], [74, 426], [106, 426], [106, 442], [90, 442], [90, 474], [122, 474], [122, 442], [138, 442],
    [138, 426], [154, 426], [154, 442], [170, 442], [170, 426], [186, 426], [186, 442], [218, 442], [218, 458],
    [170, 458], [170, 474], [250, 474], [250, 482]
];

let index = 0;
let animationFrameId = null;
let ghostX = points[0][0];
let ghostY = points[0][1] - 10;
let targetX = ghostX;
let targetY = ghostY;
let lerpFactor = 0.15; // Smooth transition factor

// Store the ghost's movement trail
let trailPoints = [];

ghostImg.onload = function () {
    ctx.drawImage(ghostImg, ghostX - cellSize / 2, ghostY - cellSize / 2, cellSize, cellSize);
};

function drawStep() {
    if (index >= points.length - 1) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    targetX = points[index][0];
    targetY = points[index][1];

    ghostX += (targetX - ghostX) * lerpFactor;
    ghostY += (targetY - ghostY) * lerpFactor;

    // Store ghost's position in trail
    trailPoints.push([ghostX, ghostY]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mazeImg, 0, 0, canvas.width, canvas.height);

    drawTrail(); // Draw the trail before the ghost
    ctx.drawImage(ghostImg, ghostX - cellSize / 2, ghostY - cellSize / 2, cellSize, cellSize);

    if (Math.abs(ghostX - targetX) < 1 && Math.abs(ghostY - targetY) < 1) {
        index++;
    }

    animationFrameId = requestAnimationFrame(drawStep);
}

// Function to draw the ghost's movement trail
function drawTrail() {
    if (trailPoints.length > 1) {
        ctx.strokeStyle = "green"; // Color of the trail
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trailPoints[0][0], trailPoints[0][1]);

        for (let i = 1; i < trailPoints.length; i++) {
            ctx.lineTo(trailPoints[i][0], trailPoints[i][1]);
        }
        
        ctx.stroke();
    }
}

// Restart button to reset the ghost's position and stop the movement
document.getElementById("restart").addEventListener("click", function () {
    cancelAnimationFrame(animationFrameId);
    index = 0;
    ghostX = points[0][0];
    ghostY = points[0][1] - 10;
    trailPoints = []; // Clear the trail
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mazeImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(ghostImg, ghostX - cellSize / 2, ghostY - cellSize / 2, cellSize, cellSize);
});

// Draw button to start the ghost's movement again
document.getElementById("draw").addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mazeImg, 0, 0, canvas.width, canvas.height);
    index = 0;
    ghostX = points[0][0];
    ghostY = points[0][1] - 10;
    trailPoints = []; // Reset trail
    animationFrameId = requestAnimationFrame(drawStep);
});

// SweetAlert credits
function credits1() {
    Swal.fire({
        title: "Nejc Cesen 4. Ra",
        showClass: {
            popup: `animate__animated animate__fadeInUp animate__faster`
        },
        hideClass: {
            popup: `animate__animated animate__fadeOutDown animate__faster`
        }
    });
}
