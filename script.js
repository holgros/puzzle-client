let puzzleData;
let rectangleWidth;
let rectangleHeight;
let triangleObjects = [];
let dragging;
let mouseDown;
let lastMousePosition;

let initPuzzle = (data) => {
    //console.log(data);
    puzzleData = data;
    let titleElements = document.getElementsByClassName("title");
    for (let element of titleElements) {
        element.innerHTML = data.title;
    }
    window.dispatchEvent(new Event("resize"));
    addListenersBody(document.body);
}

window.onload = () => {
    //console.log("Fetching...");
    fetch("https://peaceful-sands-97012.herokuapp.com/puzzle/1")
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
        addListenersTriangle(inputTriangle);
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
    body.addEventListener("mouseup", () => {
        mouseDown = null;
        dragging = null;
    });
}

let addListenersTriangle = (svgTriangle) => {
    svgTriangle.addEventListener("mousedown", drag);
    svgTriangle.addEventListener("mouseup", rotate);
}

let drag = (evt) => {   // triggas när musknappen trycks över en triangel
    evt.preventDefault();
    mouseDown = evt.target;
    /* TODO: position the latest clicked triangle on top of the others...
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
    lastMousePosition = new Point(evt.clientX, evt.clientY);
}

let rotate = (evt) => { // triggas när musknappen släpps över en triangel
    if (dragging || !mouseDown) {
        dragging = null;
        return;
    }
    mouseDown = null;
    let triangle = evt.target.triangle;
    triangle.rotate();
    triangle.draw();
}

let moveTriangle = (evt) => {
    evt.preventDefault();
    if (mouseDown) {
        dragging = mouseDown;
        triangle = dragging.triangle;
        let mousePosition = new Point(evt.clientX, evt.clientY);
        let dx = mousePosition.x-lastMousePosition.x;
        let dy = mousePosition.y-lastMousePosition.y;
        lastMousePosition = mousePosition;
        for (point of triangle.points) {
            point.x += dx;
            point.y += dy;
        }
        triangle.draw();
        for (let i = 0; i < 9; i++) {
            if (pointInTriangle(mousePosition, triangleObjects[i].points)) {
                for (point of triangleObjects[i].points) {
                    if (point.orientation == triangle.points[0].orientation) {
                        triangleObjects[i].svgElement.style.stroke = "green";
                        triangleObjects[i].svgElement.style.strokeWidth = 2;
                    }
                }
            }
            else {
                triangleObjects[i].svgElement.style.stroke = "grey";
                triangleObjects[i].svgElement.style.strokeWidth = 1;
            }
        }
    }
}

let pointInTriangle = (point, points) => {
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