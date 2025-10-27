const splitImage = function(image, rows, cols) {
    const images = Array(rows * cols);
    const pieceWidth = image.width / cols;
    const pieceHeight = image.height / rows;
    piecesContainer = document.getElementById('leftContainer');
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const pieceCanvas = document.createElement('canvas');
            const pieceCtx = pieceCanvas.getContext('2d');
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;

            // Draw the piece
            pieceCtx.drawImage(
                image,
                col * pieceWidth,
                row * pieceHeight,
                pieceWidth,
                pieceHeight,
                0,
                0,
                pieceWidth,
                pieceHeight
            );

            images[row * cols + col] = pieceCanvas;
        }
    }
    return images;
}

const shuffle = function(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

let images = [];

const rows = 4;
const cols = 4;

const changeElementState = function(element, index) {
    element.dataset.index = index;

    const img = element.getElementsByTagName("img")[0];
    if (index >= 0) {
        img.classList.remove("hidden");
        img.src = images[index].toDataURL();
    } else {
        img.classList.add("hidden");
        img.src = null;
    }
}

const createPuzzlePieceElement = function(container, index, onDropped = null) {
    const element = document.createElement("div");
    element.id = `${container.id}-e${index}`;
    element.className = "puzzlePiece";
    element.dataset.index = -1;

    element.addEventListener("dragstart", function(event) {
        if (element.dataset.index < 0) return;

        element.classList.add("dragged");
        event.dataTransfer.setData("pieceId", element.id);
    });

    element.addEventListener("dragend", function(event) {
        element.classList.remove("dragged");
    });

    element.addEventListener("dragenter", function (event) {
        if (element.dataset.index >= 0) return;

        element.classList.add("dropping");
    });
    element.addEventListener("dragleave", function (event) {
        if (element.dataset.index >= 0) return;
        
        element.classList.remove("dropping");
    });
    element.addEventListener("dragover", function (event) {
        if (element.dataset.index >= 0) return;

        event.preventDefault();
    });
    element.addEventListener("drop", function (event) {
        if (element.dataset.index >= 0) return;

        element.classList.remove("dropping");

        const draggedId = event.dataTransfer.getData("pieceId");
        if (!draggedId) return;
        const draggedElement = document.getElementById(draggedId);
        const puzzleIndex = draggedElement.dataset.index;

        changeElementState(draggedElement, -1);
        changeElementState(element, puzzleIndex);

        if (onDropped) onDropped();
    }, false);

    const image = document.createElement("img");
    image.className = "hidden";
    element.appendChild(image);
    
    const overlay = document.createElement("div")
    overlay.className = "dragOverlay";
    element.appendChild(overlay);

    container.appendChild(element);
    return element;
}

const clearPuzzles = function() {
    correctPieces = 0;
    const elements = document.getElementsByClassName("puzzlePiece");
    for (let element of elements) {
        changeElementState(element, -1);
    }
}


const checkWinCondition = function(pieces) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].dataset.index !== i.toString()) return;
    }
    console.log("Win condition was satisfied");
    new Notification("Congratulations! You did this!");
}

const leftContainer = document.getElementById("leftContainer");
const rightContainer = document.getElementById("rightContainer");

const leftPieces = Array(rows * cols).fill().map((u, i) => createPuzzlePieceElement(leftContainer, i));
const rightPieces = Array(rows * cols).fill().map((u, i) => createPuzzlePieceElement(rightContainer, i, () => checkWinCondition(rightPieces)));

const randomFill = function() {
    clearPuzzles();
    let indices = Array(rows * cols).fill().map((u, i) => i);
    shuffle(indices);

    for (let i = 0; i < indices.length; i++) {
        changeElementState(leftPieces[i], indices[i]);
    }
}

let map = L.map('map').setView([53.430127, 14.564802], 18);
let marker;
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        let rasterMap = document.getElementById("rasterMap");
        rasterMap.width = canvas.width;
        rasterMap.height = canvas.height;

        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0);

        images = splitImage(canvas, 4, 4);
        randomFill();
    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.warn("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);

        document.getElementById("latitude").innerText = position.coords.latitude;
        document.getElementById("longitude").innerText = position.coords.longitude;

        if (marker) marker.remove();
        marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup("<strong>Drop nuke here!</strong><br>This is your location.");
    }, positionError => {
        console.error(positionError);
    });

});

Notification.requestPermission();