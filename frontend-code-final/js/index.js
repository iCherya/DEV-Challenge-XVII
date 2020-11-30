const inputFileEl = document.getElementById('input-file');
const controlsEl = document.getElementById('controls');
const visualization = document.getElementById('container');
const messageEl = document.querySelector('.message');

inputFileEl.addEventListener('change', getFile);
textarea.addEventListener('input', () => {
    content = textarea.value;
    processData(content);
});

function getFile(event) {
    const input = event.target;
    if ('files' in input && input.files.length > 0) {
        const file = input.files[0];

        readFileContent(file)
            .then((content) => {
                fillTextArea(content);
                processData(content);
            })
            .catch((error) => console.log(error));
    }
}

function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

function fillTextArea(content) {
    const textarea = document.getElementById('textarea');
    textarea.innerHTML = content;

    textarea.addEventListener('input', () => {
        content = textarea.value;

        if (content.trim() !== '') {
            processData(content);
        }
    });
}

function getItemKeyValue(string) {
    const params = string.split(' ');
    const result = {};

    result.type = params[0];
    result.data = {};
    for (let i = 1; i < params.length; i++) {
        const [paramName, paramValue] = params[i].split('=');
        result.data[paramName] = +paramValue;
    }

    return result;
}

function processData(content) {
    if (!content) return;

    const lines = content.split('\n');
    const room = new Room();
    room.setDimentions(lines.shift());
    const statuses = [];

    const elementsNumber = lines.length;

    for (let i = 0; i < elementsNumber; i++) {
        const line = lines[i];
        if (line.trim() === '') continue;

        const item = getItemKeyValue(line);
        let result;

        if (item.type === 'rectangle') {
            result = room.addItem(new Rectangle(item.data));
        }
        if (item.type === 'triangle') {
            result = room.addItem(new Triangle(item.data));
        }
        if (item.type === 'ellipse') {
            result = room.addItem(new Ellipse(item.data));
        }

        if (!result.status) {
            statuses.push(
                `line ${i + 2}. Sorry, we can not add ${item.type}. Reason: ${result.reason}`
            );
        }
    }

    if (room.items.length === elementsNumber) {
        statuses.push('All elements fit into the room');
    }

    messageEl.innerHTML = '';
    messageEl.innerText = statuses.join('\n');
    messageEl.innerText += `

    Total Room area: ${room.area}
    Free space area left: ${room.freeArea}`;

    drawSimulation(room);
}

function drawSimulation(room) {
    const scale = (window.innerHeight * 0.8) / room.length;
    const drawGrid = (width, height, scale) => {
        width = width * scale;
        height = height * scale;

        const gridLayer = new Konva.Layer();
        const padding = 1 * scale;

        for (let i = 0; i < width / padding; i++) {
            gridLayer.add(
                new Konva.Line({
                    points: [Math.round(i * padding), 0, Math.round(i * padding), height],
                    stroke: '#ddd',
                    strokeWidth: 0.5
                })
            );
        }

        gridLayer.add(new Konva.Line({ points: [0, 0, 10, 10] }));
        for (let j = 0; j < height / padding; j++) {
            gridLayer.add(
                new Konva.Line({
                    points: [0, Math.round(j * padding), width, Math.round(j * padding)],
                    stroke: '#ddd',
                    strokeWidth: 0.5
                })
            );
        }

        return gridLayer;
    };

    const stage = new Konva.Stage({
        container: 'container',
        width: room.width * scale,
        height: room.length * scale
    });

    const layer = new Konva.Layer();
    const grid = drawGrid(room.width, room.length, scale);
    stage.add(grid, layer);

    for (let item of room.items) {
        if (item.constructor.name === 'Rectangle') {
            const rectangle = new Konva.Rect({
                x: item.x * scale,
                y: item.y * scale,
                width: item.width * scale,
                height: item.length * scale,
                fill: 'tomato'
            });

            layer.add(rectangle);
        }
        if (item.constructor.name === 'Triangle') {
            const triangle = new Konva.RegularPolygon({
                x: item.x * scale,
                y: item.y * scale,
                sides: 3,
                radius: item.radiusY * scale,
                fill: 'purple'
            });

            layer.add(triangle);
        }
        if (item.constructor.name === 'Ellipse') {
            const ellipse = new Konva.Ellipse({
                x: item.x * scale,
                y: item.y * scale,
                radiusX: item.radiusX * scale,
                radiusY: item.radiusY * scale,
                fill: 'orange'
            });

            layer.add(ellipse);
        }
    }

    layer.draw();
}
