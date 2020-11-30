class Rocket {
    constructor(mass = 2, radius = 25, height = 100, canvas) {
        this.mass = mass;
        this.radius = radius;
        this.height = height;
        this.prevPosition = { x: canvas.width / 2 - 1, y: -1 };
        this.position = { x: canvas.width / 2, y: 0 };
        this.angle = { rad: 0, degrees: 0 };
        this.velocity = { x: 0, y: 0 };
        this.image = new Image();
        this.image.src = './rocket.svg';
        this.launch = { x: canvas.width / 2, y: 0 };
    }
    drawRocket(context, x, y) {
        this.image.onload = () => {
            context.drawImage(this.image, x, y, this.radius * 2, this.height);
        };
    }
    rotateRocket(context, rad) {
        context.save();
        context.translate(this.launch.x, this.position.y);
        context.rotate(rad + Math.PI / 2);
        context.drawImage(this.image, -this.radius, -this.height / 2, this.radius * 2, this.height);
        context.rotate(-(rad + Math.PI / 2));
        context.translate(-this.launch.x, -this.position.y);
        context.restore();
    }
    setDegrees(x1, y1, x2, y2) {
        this.angle.rad = Math.atan2(y2 - y1, x2 - x1);
        this.angle.degrees = (360 - (this.angle.rad * 180) / Math.PI) % 360; // Degrees in (0, 360)
    }
    drawLaunchDetails(context, rocketX, rocketY, mouseX, mouseY) {
        const drawArrow = (context, color, lineWidth, fromX, fromY, toX, toY) => {
            context.lineWidth = lineWidth;
            context.strokeStyle = color;

            context.save();
            context.beginPath();

            const headlen = 10;
            const dx = toX - fromX;
            const dy = toY - fromY;
            const angle = Math.atan2(dy, dx);
            context.moveTo(fromX, fromY);
            context.lineTo(toX, toY);
            context.lineTo(
                toX - headlen * Math.cos(angle - Math.PI / 6),
                toY - headlen * Math.sin(angle - Math.PI / 6)
            );
            context.moveTo(toX, toY);
            context.lineTo(
                toX - headlen * Math.cos(angle + Math.PI / 6),
                toY - headlen * Math.sin(angle + Math.PI / 6)
            );

            context.closePath();
            context.stroke();
            context.restore();
        };

        const drawSlingshot = (context, rocketX, rocketY, mouseX, mouseY) => {
            context.save();
            context.beginPath();
            context.setLineDash([5]);
            context.moveTo(rocketX, rocketY);
            context.lineTo(mouseX, mouseY);
            context.stroke();
            context.closePath();
            context.restore();
        };

        const drawAngleInformation = (context, angle, rocketX, rocketY) => {
            context.beginPath();
            context.moveTo(rocketX, rocketY);
            context.arc(rocketX, rocketY, 50, 0, angle.rad, true);
            context.stroke();
            context.closePath();

            context.font = '12px Arial';
            context.fillText(`${angle.degrees.toFixed(2)}\u00B0`, rocketX + 20, rocketY - 10);
        };

        this.setDegrees(mouseX, mouseY, rocketX, rocketY);

        // Draw slingshot line
        drawSlingshot(context, rocketX, rocketY, mouseX, mouseY);

        // Draw moving vector
        drawArrow(
            context,
            'tomato',
            3,
            rocketX,
            rocketY,
            2 * rocketX - mouseX,
            2 * rocketY - mouseY
        );

        // Draw X, Y axis
        drawArrow(context, 'gray', 1, rocketX, rocketY, rocketX + 100, rocketY);
        drawArrow(context, 'gray', 1, rocketX, rocketY, rocketX, rocketY - 100);

        // Draw angle information
        drawAngleInformation(context, this.angle, rocketX, rocketY);
        stats.start.angle.innerText = `${rocket.angle.degrees.toFixed(2)}\u00B0`;

        // Rotate rocket
        this.rotateRocket(context, this.angle.rad);
    }
}
