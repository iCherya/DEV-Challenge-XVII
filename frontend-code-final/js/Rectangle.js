class Rectangle {
    constructor(props) {
        const { x, y, width, length } = props;

        this.x = x;
        this.y = y;
        this.width = width;
        this.length = length;
        this.area = this.width * this.length;
        this.radiusX = this.width / 2;
        this.radiusY = this.length / 2;
        this.xc = this.x + this.width / 2;
        this.yc = this.y + this.length / 2;
    }
}
