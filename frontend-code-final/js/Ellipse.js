class Ellipse {
    constructor(props) {
        const { x, y, radiusX, radiusY } = props;

        this.x = x;
        this.y = y;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.area = Math.PI * this.radiusX * this.radiusY;
        this.xc = this.x;
        this.yc = this.y;
    }
}
