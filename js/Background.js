class Background {
    constructor(width, height, horizon, x, y) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.horizon = horizon;
        this.position = { x: x, y: y };

        this.drawGround();
        this.drawSky();
    }
    drawGround() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - this.horizon + 1);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - this.horizon + 1);
        this.ctx.stroke();

        let pointX = 0;
        let counter = this.canvas.width;
        while (counter > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(pointX, this.canvas.height - this.horizon + 1);
            this.ctx.lineTo(pointX + this.horizon, this.canvas.height);
            this.ctx.stroke();
            pointX += this.horizon;

            counter -= this.horizon;
        }
    }
    drawSky() {
        const maxStarRadius = 2;

        for (let i = 0; i < 50; i++) {
            const x = (Math.random() * this.canvas.width) / 3;
            const y = Math.random() * (this.canvas.height - this.horizon - maxStarRadius * 2);
            const radius = Math.round(Math.random() * maxStarRadius);
            strokeStar(this.ctx, x, y, radius);
        }

        const copy = this.ctx.getImageData(0, 0, this.canvas.width / 3, this.canvas.height);
        this.ctx.putImageData(copy, this.canvas.width / 3, 0);
        this.ctx.putImageData(copy, (2 * this.canvas.width) / 3, 0);

        function strokeStar(ctx, x, y, radius) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(x, y);
            ctx.moveTo(0, 0 - radius);
            for (var i = 0; i < 5; i++) {
                ctx.rotate(Math.PI / 5);
                ctx.lineTo(0, 0 - radius * 2);
                ctx.rotate(Math.PI / 5);
                ctx.lineTo(0, 0 - radius);
            }
            ctx.closePath();

            ctx.fillStyle = `rgba(0,0,0,${Math.random()})`;
            ctx.fill();
            ctx.restore();
        }
    }
}
