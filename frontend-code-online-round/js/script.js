const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const stats = {
    start: {
        velocity: document.querySelector('.start-velosity span'),
        angle: document.querySelector('.start-angle span'),
        height: document.querySelector('.start-height span'),
        simulationSpeed: document.querySelector('.simulation-speed input')
    },
    current: {
        velocity: document.querySelector('.current-velosity span'),
        height: document.querySelector('.current-height span'),
        distance: document.querySelector('.current-distance span')
    }
};

const width = canvas.width;
const horizon = 40;
const height = canvas.height - horizon;

const bg = new Background(width * 3, height + horizon, horizon, width, 0);
const rocket = new Rocket(2, 25, 100, canvas);

let frameRate = 1 / 60;
let frameDelay = frameRate * 1000;
let simulationSpeed = +stats.start.simulationSpeed.value;
let simulationTimer = false;
var mouse = { x: 0, y: 0, isDown: false };

const gravityAcceleration = 9.80665, // m/s^2  ->  https://en.wikipedia.org/wiki/Gravitational_acceleration
    area = (Math.PI * rocket.radius * rocket.radius) / 10000, // m^2 -> https://en.wikipedia.org/wiki/Area_of_a_circle
    dencity = rocket.mass / (area * rocket.height), // kg / m^3 -> https://en.wikipedia.org/wiki/Density
    Cd = 0.82; // long cylinder -> https://en.wikipedia.org/wiki/Drag_coefficient

function setup() {
    // Setting listeners
    stats.start.simulationSpeed.addEventListener('input', (event) => {
        clearInterval(simulationTimer);
        simulationSpeed = +event.target.value;
        simulationTimer = setInterval(simulation, frameDelay);
    });
    canvas.onmousemove = getMousePosition;
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;

    simulationTimer = setInterval(simulation, frameDelay);
}

function getMousePosition(e) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}

const mouseDown = function (e) {
    getMousePosition(e);
    mouse.isDown = true;

    rocket.position.x = mouse.x;
    rocket.position.y = mouse.y;
    rocket.launch.x = rocket.position.x;
    rocket.launch.y = rocket.position.y;

    rocket.drawLaunchDetails(ctx, rocket.position.x, rocket.position.y, mouse.x, mouse.y);
    stats.current.distance.innerText = 0;

    canvas.style.cursor = 'grabbing';
};

const mouseUp = function (e) {
    mouse.isDown = false;
    canvas.style.cursor = 'grab';

    rocket.velocity.y = (rocket.position.y - mouse.y) / 10;
    rocket.velocity.x = (rocket.position.x - mouse.x) / 10;

    stats.start.height.innerText = height - rocket.launch.y;
    stats.start.velocity.innerText = `x: ${Math.abs(rocket.velocity.x)}, y: ${Math.abs(
        rocket.velocity.y
    )}`;
};

const simulation = function () {
    if (!mouse.isDown) {
        // Drag force: ->  https://en.wikipedia.org/wiki/Drag_(physics)
        var Fx =
            -(
                0.5 *
                Cd *
                area *
                dencity *
                rocket.velocity.x *
                rocket.velocity.x *
                rocket.velocity.x
            ) / Math.abs(rocket.velocity.x);
        var Fy =
            -(
                0.5 *
                Cd *
                area *
                dencity *
                rocket.velocity.y *
                rocket.velocity.y *
                rocket.velocity.y
            ) / Math.abs(rocket.velocity.y);

        Fx = isNaN(Fx) ? 0 : Fx;
        Fy = isNaN(Fy) ? 0 : Fy;

        // Acceleration:
        let ax = Fx / rocket.mass;
        let ay = gravityAcceleration + Fy / rocket.mass;

        // Velocity
        rocket.velocity.x += ax * frameRate;
        rocket.velocity.y += ay * frameRate;

        // Previous position
        rocket.prevPosition.x = rocket.position.x;
        rocket.prevPosition.y = rocket.position.y;

        // Current Position
        bg.position.x += rocket.velocity.x * frameRate * simulationSpeed; // We move bg
        rocket.position.x += rocket.velocity.x * frameRate * simulationSpeed;
        rocket.position.y += rocket.velocity.y * frameRate * simulationSpeed;
    }

    // Rocket "landing"
    if (rocket.position.y > height - rocket.radius * Math.sin(rocket.angle.rad)) {
        stats.current.height.innerText = 0;
        stats.current.velocity.innerText = `x: 0.0, y: 0.0`;
        return;
    }

    ctx.clearRect(0, 0, width, height + horizon);
    ctx.drawImage(bg.canvas, -bg.position.x, bg.position.y, bg.canvas.width, bg.canvas.height);
    if (bg.position.x > width * 2 - 1 || bg.position.x < 1) {
        bg.position.x = width;
    }
    ctx.save();
    rocket.setDegrees(
        rocket.prevPosition.x,
        rocket.prevPosition.y,
        rocket.position.x,
        rocket.position.y
    );
    rocket.rotateRocket(ctx, rocket.angle.rad);
    ctx.restore();

    // Draw rocket launch info
    if (mouse.isDown) {
        ctx.save();
        ctx.clearRect(0, 0, width, height + horizon);
        ctx.drawImage(bg.canvas, -bg.position.x, bg.position.y, bg.canvas.width, bg.canvas.height);
        rocket.drawLaunchDetails(ctx, rocket.position.x, rocket.position.y, mouse.x, mouse.y);
        ctx.restore();
    }

    // Draw pointer when rocket higher the viewport
    if (rocket.position.y < 0) {
        ctx.font = '32px Arial';
        ctx.fillText('\u261D', rocket.launch.x - rocket.radius, 32);
    }

    // Show current stats
    stats.current.height.innerText = (height - rocket.height / 2 - rocket.position.y).toFixed(2);
    stats.current.distance.innerText = Math.abs(rocket.position.x - rocket.launch.x).toFixed(2);
    stats.current.velocity.innerText = `x: ${Math.abs(rocket.velocity.x).toFixed(1)}, y: ${Math.abs(
        rocket.velocity.y
    ).toFixed(1)}
    `;
};

setup();
