class Room {
    constructor() {
        this.items = [];
    }
    setDimentions(string) {
        const roomData = string.split(' ');

        const roomWidth = +roomData[1].split('=')[1];
        const roomLength = +roomData[2].split('=')[1];

        this.width = roomWidth;
        this.length = roomLength;
        this.area = this.width * this.length;
        this.freeArea = this.area;
    }
    addItem(item) {
        const wallCollisions = this.checkForCollisionsWithWalls(item);
        if (wallCollisions) {
            return { status: false, reason: 'Collision with wall' };
        }

        if (this.freeArea <= item.area) {
            return { status: false, reason: 'No more free space' };
        }

        const objectsCollision = this.chechForCollisionsWithAnotherObjects(item);
        if (objectsCollision) {
            return { status: false, reason: 'Collision with another object' };
        }

        this.items.push(item);
        this.freeArea -= item.area;
        return { status: true };
    }
    checkForCollisionsWithWalls(item) {
        const [xc, xy, rx, ry] = [item.xc, item.yc, item.radiusX, item.radiusY];

        const left = xc - rx < 0;
        const right = xc + rx > this.width;
        const top = xy - ry < 0;
        const bottom = xy + ry > this.length;

        return left || right || top || bottom;
    }
    chechForCollisionsWithAnotherObjects(item) {
        if (this.items.length < 1) return false;

        function haveIntersection(el1, el2) {
            const condition =
                el1.xc + el1.radiusX <= el2.xc - el2.radiusX ||
                el1.xc - el1.radiusX >= el2.xc + el2.radiusX ||
                el1.yc + el1.radiusY <= el2.yc - el2.radiusY ||
                el1.yc - el1.radiusY >= el2.yc + el2.radiusY;

            return !condition;
        }

        for (let i = 0; i < this.items.length; i++) {
            const prevItem = this.items[i];

            if (haveIntersection(prevItem, item)) {
                return true;
            }
        }

        return false;
    }
}
