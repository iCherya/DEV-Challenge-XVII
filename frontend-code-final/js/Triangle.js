class Triangle {
    constructor(props) {
        const { x, y, length } = props;

        this.x = x;
        this.y = y;
        this.length = length;
        this.area = (this.length * this.length * Math.sqrt(3)) / 4;
        this.radiusX = this.length / 2;
        this.radiusY = (this.length * Math.sqrt(3)) / 3;
        this.xc = this.x;
        this.yc = this.y;
    }
}
