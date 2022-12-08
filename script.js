// global variables
let puzzleData;
let rectangleWidth;
let rectangleHeight;
let triangleObjects = [];
let dragging;
let mouseDown;
let touchDown;
let lastMousePosition;
let targetTriangle;
let puzzleId;
let playerName;
let apiUrl = "https://holgros-puzzle-api.herokuapp.com/puzzles/";
//let apiUrl = "http://localhost:3000/puzzle/";

let initPuzzle = (data) => {
    let fetching = document.getElementById("fetching");
    fetching.style.display = "none";
    puzzleData = data;
    let titleElements = document.getElementsByClassName("title");
    for (let element of titleElements) {
        element.innerHTML = data.title;
    }
    window.dispatchEvent(new Event("resize"));
    addListenersBody(document.body);
    addListenersButton(document.getElementById("submitSolution"));
}

window.onload = () => {
    puzzleId = document.head.querySelector("[name~=puzzleId][content]").content;
    playerName = document.head.querySelector("[name~=playerName][content]").content;
    let i = 0;
    let fetching = document.getElementById("fetching");
    setInterval(() => {
        i++;
        let html = "Fetching";
        for (let j = 0; j <= i%3; j++) {
            html += ".";
        }
        fetching.innerHTML = html;
    }, 333);
    fetch(apiUrl + puzzleId)
    .then(response=>response.json())
    .then(data=>{ initPuzzle(data); });
}

window.onresize = () => {
    let interactionArea = document.getElementById("interactionArea");
    let innerHeight = Math.round(window.innerHeight/1.11) - document.getElementById("header").clientHeight;
    let innerWidth = Math.round(window.innerWidth/1.11);
    interactionArea.setAttribute("height", innerHeight+"px");
    interactionArea.setAttribute("width", innerWidth+"px");
    rectangleWidth = Math.round(innerWidth/2);
    rectangleHeight = innerHeight;
    let stacked = false;
    if(innerHeight > innerWidth){ // portrait
        rectangleWidth = innerWidth;
        rectangleHeight = Math.round(innerHeight/2);
        stacked = true;
    }
    if (triangleObjects.stacked != stacked) triangleObjects = [];   // om du skakar bordet/fönstret för mycket så måste du börja om pusslet från början! :-)
    triangleObjects.stacked = stacked;
    let innerHtml = "";
    for (let i = 0; i < 18; i++) {
        innerHtml += `<polygon class="inputTriangle" style="fill:white;stroke:gray;stroke-width:1;" fill-opacity="0" />
                    <svg class="angles"></svg>
                    <svg class="terms"></svg>`;
    }
    interactionArea.innerHTML = innerHtml;
    let inputTriangles = document.getElementsByClassName("inputTriangle");
    let inputAngles = document.getElementsByClassName("angles");
    let inputTerms = document.getElementsByClassName("terms");
    for (let i = 0; i < 18; i++) {
        let points = getPoints(i, stacked);
        let angles = ["", "", ""];
        if (8 < i) angles = puzzleData.data[i-9].angles;
        let terms = ["", "", ""];
        if (8 < i) terms = puzzleData.data[i-9].terms;
        let inputTriangle = inputTriangles[i];
        let inputAngle = inputAngles[i];
        let inputTerm = inputTerms[i];
        let svgElements = [inputTriangle, inputAngle, inputTerm];
        let triangle = new Triangle(points, angles, terms, svgElements);
        triangle.draw();
        inputTriangle.triangle = triangle;
        if (8 < i) addListenersTriangle(inputTriangle);
        triangle.xFactor = Math.round(Math.min(rectangleWidth, rectangleHeight)/6);
        triangle.yFactor = Math.round(Math.min(rectangleWidth, rectangleHeight)*Math.sqrt(3)/6);
        triangleObjects[i] = triangle;
    }
}

let getPoints = (index, stacked) => {
    let xFactor = Math.round(Math.min(rectangleWidth, rectangleHeight)/6);
    let yFactor = Math.round(Math.min(rectangleWidth, rectangleHeight)*Math.sqrt(3)/6);
    if (triangleObjects[index]) {   // om triangel redan har initialiserats
        let triangle = triangleObjects[index];
        let points = [];
        for (let i = 0; i < 3; i++) {
            let point = new Point(xFactor*triangle.points[i].x/triangle.xFactor, yFactor*triangle.points[i].y/triangle.yFactor);
            points.push(point);
        }
        return points;
    }
    let factors = [xFactor, yFactor];
    switch (index) {
        case 0:
            return pointPatternUpwards(factors, 3, 0);
        case 1:
            return pointPatternUpwards(factors, 2, 1);
        case 2:
            return pointPatternDownwards(factors, 2, 1);
        case 3:
            return pointPatternUpwards(factors, 4, 1);
        case 4:
            return pointPatternUpwards(factors, 1, 2);
        case 5:
            return pointPatternDownwards(factors, 1, 2);
        case 6:
            return pointPatternUpwards(factors, 3, 2);
        case 7:
            return pointPatternDownwards(factors, 3, 2);
        case 8:
            return pointPatternUpwards(factors, 5, 2);
        case 9:
            if (stacked) return pointPatternUpwards(factors, 2, 3.1);
            else return pointPatternUpwards(factors, 8, 0);
        case 10:
            if (stacked) return pointPatternDownwards(factors, 2, 3.1);
            else return pointPatternDownwards(factors, 8, 0);
        case 11:
            if (stacked) return pointPatternUpwards(factors, 4, 3.1);
            else return pointPatternUpwards(factors, 10, 0);
        case 12:
            if (stacked) return pointPatternUpwards(factors, 2, 4.1);
            else return pointPatternUpwards(factors, 8, 1);
        case 13:
            if (stacked) return pointPatternDownwards(factors, 2, 4.1);
            else return pointPatternDownwards(factors, 8, 1);
        case 14:
            if (stacked) return pointPatternUpwards(factors, 4, 4.1);
            else return pointPatternUpwards(factors, 10, 1);
        case 15:
            if (stacked) return pointPatternUpwards(factors, 2, 5.1);
            else return pointPatternUpwards(factors, 8, 2);
        case 16:
            if (stacked) return pointPatternDownwards(factors, 2, 5.1);
            else return pointPatternDownwards(factors, 8, 2);
        case 17:
            if (stacked) return pointPatternUpwards(factors, 4, 5.1);
            else return pointPatternUpwards(factors, 10, 2);
    }
}

let pointPatternUpwards = (factors, nbr1, nbr2) => {
    let xFactor = factors[0];
    let yFactor = factors[1];
    pt1 = new Point(nbr1*xFactor, nbr2*yFactor);
    pt2 = new Point((nbr1+1)*xFactor, (nbr2+1)*yFactor);
    pt3 = new Point((nbr1-1)*xFactor, (nbr2+1)*yFactor);
    return [pt1, pt2, pt3];
}

let pointPatternDownwards = (factors, nbr1, nbr2) => {
    let xFactor = factors[0];
    let yFactor = factors[1];
    pt1 = new Point(nbr1*xFactor, nbr2*yFactor);
    pt2 = new Point((nbr1+2)*xFactor, nbr2*yFactor);
    pt3 = new Point((nbr1+1)*xFactor, (nbr2+1)*yFactor);
    return [pt1, pt2, pt3];
}

let addListenersBody = (body) => {
    body.addEventListener("mousemove", moveTriangle);
    body.addEventListener("touchmove", moveTriangle);
    body.addEventListener("mouseup", () => {
        mouseDown = null;
        dragging = null;
    });
    body.addEventListener("touchend", () => {
        mouseDown = null;
        dragging = null;
    });
}

let addListenersTriangle = (svgTriangle) => {
    svgTriangle.addEventListener("mousedown", drag);
    svgTriangle.addEventListener("touchstart", drag);
    svgTriangle.addEventListener("mouseup", rotateOrDrop);
    svgTriangle.addEventListener("touchend", rotateOrDrop);
}

let addListenersButton = (button) => {
    button.addEventListener("click", handleSubmit);
}

let getPointFromEvent = (evt) => {
    let x = evt.clientX;    // mouse
    let y = evt.clientY;    // mouse
    if (!x || !y) {         // touch
        x = evt.touches[0].clientX;
        y = evt.touches[0].clientY;
    }
    return new Point(x, y);
}

let drag = (evt) => {   // triggas när musknappen trycks över en triangel
    evt.preventDefault();
    if (window.ontouchstart !== undefined) {
        touchDown = true;
        setTimeout(function() {
            touchDown = false
        }, 100);    // touch click within 100 ms
    }
    let triangles = document.getElementsByClassName("inputTriangle");
    for (let i = 0; i < triangles.length; i++) {
        if (triangles[i] == evt.target && i < 9) return;
    }
    mouseDown = evt.target;
    /* 
    TODO: Position the latest clicked triangle on top of the others. As of now, all triangular tiles are transparent, so z positioning is not visible.
    Below is a sketch solution, not finished!
    let index;
    for (let i = 0; i < triangleObjects.length; i++) {
        if (triangleObjects[i] == mouseDown.triangle) {
            index = i;
            break;
        }
    }
    console.log(index);
    triangleObjects[index].svgElement = triangleObjects[triangleObjects.length-1].svgElement;
    triangleObjects[triangleObjects.length-1].svgElement = mouseDown;
    triangleObjects[index].draw();
    triangleObjects[triangleObjects.length-1].draw();
    */
    lastMousePosition = getPointFromEvent(evt);
}

let rotateOrDrop = (evt) => { // triggas när musknappen släpps över en triangel
    if ((dragging || !mouseDown) && !touchDown) {
        mouseDown = null;
        if (dragging && targetTriangle) {
            let index;
            for (let i = 9; i < 18; i++) {
                if (dragging == triangleObjects[i].svgElement) {
                    index = i;
                    break;
                }
            }
            let pointsDeepCopy = JSON.parse(JSON.stringify(targetTriangle.points));
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (pointsDeepCopy[i].orientation == triangleObjects[index].points[j].orientation) triangleObjects[index].points[j] = pointsDeepCopy[i];
                }
            }
            triangleObjects[index].draw();
            targetTriangle.svgElement.style.stroke = "grey";
            targetTriangle.svgElement.style.strokeWidth = 1;
        }
        targetTriangle = null;
        dragging = null;
        let submitSolution = document.getElementById("submitSolution");
        if (solved()) submitSolution.style.display = "block";
        else submitSolution.style.display = "none";
        return;
    }
    dragging = null;
    mouseDown = null;
    touchDown = false;
    let triangle = evt.target.triangle;
    triangle.rotate();
    triangle.draw();
    let submitSolution = document.getElementById("submitSolution");
    if (solved()) submitSolution.style.display = "block";
    else submitSolution.style.display = "none";
}

let moveTriangle = (evt) => {
    if (!evt.touches) evt.preventDefault();
    if (!mouseDown) return;
    dragging = mouseDown;
    triangle = dragging.triangle;
    let mousePosition = getPointFromEvent(evt)
    let dx = mousePosition.x-lastMousePosition.x;
    let dy = mousePosition.y-lastMousePosition.y;
    lastMousePosition = mousePosition;
    for (point of triangle.points) {
        point.x += dx;
        point.y += dy;
    }
    triangle.draw();
    targetTriangle = null;
    for (let i = 0; i < 9; i++) {
        if (pointInTriangle(mousePosition, triangleObjects[i].points)) {
            // TODO: exit if triangle is already "occupied"
            for (point of triangleObjects[i].points) {
                if (point.orientation == triangle.points[0].orientation) {
                    triangleObjects[i].svgElement.style.stroke = "green";
                    triangleObjects[i].svgElement.style.strokeWidth = 2;
                    targetTriangle = triangleObjects[i];
                }
            }
        }
    }
    if (!targetTriangle) {
        for (let i = 0; i < 9; i++) {
            triangleObjects[i].svgElement.style.stroke = "grey";
            triangleObjects[i].svgElement.style.strokeWidth = 1;
        }
    }
}

let handleSubmit = (evt) => {
    evt.preventDefault();
    let solution = [];
    for (let triangle of triangleObjects) {
        let obj = {
            points: triangle.points,
            angles: triangle.angles,
            terms: triangle.terms
        }
        solution.push(obj);
    }
    let data = {
        solution: solution,
        puzzleId: puzzleId,
        playerName: playerName,
        date: new Date().toISOString()
    };
    data = JSON.stringify(data);
    fetch(apiUrl + "solutions", {
        method: "POST",
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: data
    })
    .then(response=>response.json())
    .then(res=>{
        console.log(res);
        alert(res.responseFromServer);
        location.reload();
    });
}

let pointInTriangle = (point, points) => {  // standardalgoritm
    let svgBoundingRect = document.getElementById("interactionArea").getBoundingClientRect();
    let pt = new Point(point.x-svgBoundingRect.x, point.y-svgBoundingRect.y);
    let v1 = points[0];
    let v2 = points[1];
    let v3 = points[2];
    let d1 = sign(pt, v1, v2);
    let d2 = sign(pt, v2, v3);
    let d3 = sign(pt, v3, v1);
    let has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    let has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(has_neg && has_pos);
}

let sign = (p1, p2, p3) => {
    return (p1.x-p3.x)*(p2.y-p3.y)-(p2.x-p3.x)*(p1.y-p3.y);
}

let solved = () => {
    let inputTrianglesCopy = triangleObjects.slice(9, 18);
    for (let i = 0; i < 9; i++) {
        if (inputTrianglesCopy.length > 9-i) return false;
        for (let j = 0; j < 9-i; j++) {
            let found = false;
            for (let k = 0; k < 3; k++) {
                if (triangleObjects[i].points[k].equals(inputTrianglesCopy[j].points[0]) &&
                triangleObjects[i].points[(k+1)%3].equals(inputTrianglesCopy[j].points[1]) &&
                triangleObjects[i].points[(k+2)%3].equals(inputTrianglesCopy[j].points[2])) {
                    inputTrianglesCopy.splice(j, 1);
                    found = true;
                    break;
                }
            }
            if (found) break;
            if (i == 8) return false;
        }
    }
    return true;
}