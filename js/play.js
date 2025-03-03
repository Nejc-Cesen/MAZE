const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');
const ghostImg = new Image();
ghostImg.src = "./slike/ghost.png"; // Load the ghost image

const mazeWidth = 164; // Maximum x coordinate in the maze (based on your wall data)
const mazeHeight = 164; // Maximum y coordinate in the maze (based on your wall data)
const canvasWidth = canvas.width;  // Get canvas width
const canvasHeight = canvas.height; // Get canvas height

// Calculate the scaling factor based on the canvas size and maze size
const scaleFactorX = canvasWidth / mazeWidth;
const scaleFactorY = canvasHeight / mazeHeight;
const scaleFactor = Math.min(scaleFactorX, scaleFactorY); // Use the smallest scale factor to maintain aspect ratio

// Maze wall coordinates (line format)
const walls = [
    [2, 2, 66, 2], [82, 2, 162, 2], [50, 18, 66, 18], [98, 18, 146, 18],
    [18, 34, 50, 34], [66, 34, 82, 34], [114, 34, 130, 34], [50, 50, 114, 50],
    [34, 66, 66, 66], [130, 66, 146, 66], [18, 82, 34, 82], [82, 82, 130, 82],
    [34, 98, 82, 98], [114, 98, 130, 98], [146, 98, 162, 98], [2, 114, 18, 114],
    [66, 114, 82, 114], [82, 130, 146, 130], [2, 146, 34, 146], [50, 146, 114, 146],
    [146, 146, 162, 146], [2, 162, 82, 162], [98, 162, 162, 162], [2, 2, 2, 162],
    [18, 2, 18, 18], [18, 34, 18, 50], [18, 66, 18, 98], [18, 114, 18, 130],
    [34, 18, 34, 66], [34, 82, 34, 130], [50, 66, 50, 82], [50, 114, 50, 146],
    [66, 2, 66, 18], [66, 34, 66, 50], [66, 66, 66, 98], [66, 114, 66, 146],
    [82, 18, 82, 34], [82, 50, 82, 82], [82, 98, 82, 114], [82, 146, 82, 162],
    [98, 2, 98, 34], [98, 50, 98, 66], [98, 82, 98, 130], [114, 34, 114, 50],
    [114, 66, 114, 82], [114, 114, 114, 130], [130, 34, 130, 50], [130, 82, 130, 114],
    [130, 130, 130, 162], [146, 18, 146, 82], [146, 114, 146, 130], [162, 2, 162, 162]
];

let ghostX = 74 * scaleFactor;  // Starting X position (scaled)
let ghostY = 2 * scaleFactor;   // Starting Y position (scaled)
let speed = 10; // Movement speed, one cell at a time
let cellSize = 20; // Smaller ghost size

const finishPoint = {
    x: 85 * scaleFactor, // Finish point X (scaled)
    y: 150 * scaleFactor, // Finish point Y (scaled)
};

// Scale the wall coordinates to fit the canvas size
function scaleWalls() {
    return walls.map(wall => {
        return [
            wall[0] * scaleFactor,
            wall[1] * scaleFactor,
            wall[2] * scaleFactor,
            wall[3] * scaleFactor
        ];
    });
}

// Function to draw the maze walls in white
function drawWalls() {
    ctx.strokeStyle = "white";  // Set the wall color to white
    ctx.lineWidth = 4;  // Set the line width for walls
    ctx.beginPath();
    const scaledWalls = scaleWalls();
    for (let wall of scaledWalls) {
        const [x1, y1, x2, y2] = wall;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }
    ctx.stroke();  // Apply the stroke (draw the walls)
}

// Draw the ghost on the canvas
function drawGhost() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    drawWalls();  // Draw the walls in white color
    ctx.drawImage(ghostImg, ghostX - cellSize / 2, ghostY - cellSize / 2, cellSize, cellSize);  // Draw the ghost at its position
}

// Handle keydown events for movement
document.addEventListener("keydown", function (e) {
    if (e.key === 'w' || e.key === 'ArrowUp') {
        // Try to move up
        if (!isCollision(ghostX, ghostY - speed)) {
            ghostY -= speed;
        }
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        // Try to move left
        if (!isCollision(ghostX - speed, ghostY)) {
            ghostX -= speed;
        }
    } else if (e.key === 's' || e.key === 'ArrowDown') {
        // Try to move down
        if (!isCollision(ghostX, ghostY + speed)) {
            ghostY += speed;
        }
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
        // Try to move right
        if (!isCollision(ghostX + speed, ghostY)) {
            ghostX += speed;
        }
    }

    // Check if ghost has reached the finish point
    if (Math.abs(ghostX - finishPoint.x) < cellSize && Math.abs(ghostY - finishPoint.y) < cellSize) {
        // Trigger SweetAlert when the ghost reaches the finish point
        Swal.fire({
            title: 'Congratulations!',
            text: 'You reached the finish point!',
            icon: 'success',
            confirmButtonText: 'Start Again'
        }).then(() => {
            resetGame();  // Optionally reset the game after SweetAlert confirmation
        });
    }

    drawGhost();  // Redraw the ghost at the new position
});

// Function to detect if the ghost is colliding with a wall
function isCollision(x, y) {
    const scaledWalls = scaleWalls();
    for (let wall of scaledWalls) {
        const [x1, y1, x2, y2] = wall;
        // Check if the ghost's new position would intersect the wall
        if (x + cellSize > Math.min(x1, x2) && x < Math.max(x1, x2) &&
            y + cellSize > Math.min(y1, y2) && y < Math.max(y1, y2)) {
            return true; // Collision detected
        }
    }

    // Make sure the ghost stays within the canvas bounds
    if (x < 0 || x + cellSize > canvasWidth || y < 0 || y + cellSize > canvasHeight) {
        return true; // Collision with canvas boundary detected
    }

    return false; // No collision
}

// Reset the game (optionally reset the ghost's position)
function resetGame() {
    ghostX = 74 * scaleFactor;  // Reset ghost position to the scaled starting point
    ghostY = 2 * scaleFactor;
    drawGhost();  // Redraw the initial ghost position and maze
}

// Start drawing the maze and ghost when the "draw" button is clicked
document.getElementById("draw").addEventListener("click", function () {
    ghostX = 74 * scaleFactor;  // Reset ghost position to the scaled starting point
    ghostY = 2 * scaleFactor;
    drawGhost();  // Redraw the initial ghost position and maze
});

// Restart button to reset the ghost's position
document.getElementById("restart").addEventListener("click", function () {
    ghostX = 74 * scaleFactor;  // Reset ghost position to the scaled starting point
    ghostY = 2 * scaleFactor;
    drawGhost();  // Redraw the ghost at the starting position
});

// Initial drawing of the ghost and walls
drawGhost();
