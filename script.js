let puzzleData;
let rectangleWidth;
let rectangleHeight;

let initPuzzle = (data) => {
    puzzleData = data;
    let titleElements = document.getElementsByClassName("title");
    for (let element of titleElements) {
        element.innerHTML = data.title;
    }
    window.dispatchEvent(new Event("resize"));
}

window.onload = () => {
    fetch("https://peaceful-sands-97012.herokuapp.com/puzzle/1")
    .then(response=>response.json())
    .then(data=>{ initPuzzle(data); });
}

window.onresize = () => {
    let interactionArea = document.getElementById("interactionArea");
    let innerHeight = Math.round(window.innerHeight/1.1) - document.getElementById("header").clientHeight;
    let innerWidth = Math.round(window.innerWidth/1.1);
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
    let innerHtml = "<polygon class='inputTriangle' style='fill:white;stroke:gray;stroke-width:1' />";
    for (let i = 0; i < 17; i++) {
        innerHtml += "<polygon class='inputTriangle' style='fill:white;stroke:gray;stroke-width:1' />";
    }
    interactionArea.innerHTML = innerHtml;
    let inputTriangles = document.getElementsByClassName("inputTriangle");
    for (let i = 0; i < 18; i++) {
        let points = getPoints(i, stacked);
        let angles = ["", "", ""];
        if (8 < i) angles = puzzleData.data[i-9].angles;
        let terms = ["", "", ""];
        if (8 < i) terms = puzzleData.data[i-9].terms;
        let inputTriangle = inputTriangles[i];
        let triangle = new Triangle(points, angles, terms, inputTriangle);
        triangle.draw();
    }
}

let getPoints = (index, stacked) => {
    let pt1;
    let pt2;
    let pt3;
    let xFactor = Math.round(Math.min(rectangleWidth, rectangleHeight)/8);
    let yFactor = Math.round(Math.min(rectangleWidth, rectangleHeight)*Math.sqrt(3)/8);
    let factors = [xFactor, yFactor];
    switch (index) {
        case 1:
            //pt1 = new Point(3*xFactor, 0);
            //pt2 = new Point(4*xFactor, yFactor);
            //pt3 = new Point(2*xFactor, yFactor);
            //return [pt1, pt2, pt3];
            return pointPatternUpwards(factors, 3, 0);
        case 2:
            //pt1 = new Point(2*xFactor, yFactor);
            //pt2 = new Point(3*xFactor, 2*yFactor);
            //pt3 = new Point(xFactor, 2*yFactor);
            //return [pt1, pt2, pt3];
            return pointPatternUpwards(factors, 2, 1);
        case 3:
            //pt1 = new Point(2*xFactor, yFactor);
            //pt2 = new Point(4*xFactor, yFactor);
            //pt3 = new Point(3*xFactor, 2*yFactor);
            //return [pt1, pt2, pt3];
            return pointPatternDownwards(factors, 2, 1);
        case 4:
            //pt1 = new Point(4*xFactor, yFactor);
            //pt2 = new Point(5*xFactor, 2*yFactor);
            //pt3 = new Point(3*xFactor, 2*yFactor);
            //return [pt1, pt2, pt3];
            return pointPatternUpwards(factors, 4, 1);
        case 5:
            //pt1 = new Point(xFactor, 2*yFactor);
            //pt2 = new Point(2*xFactor, 3*yFactor);
            //pt3 = new Point(0, 3*yFactor);        
            //return [pt1, pt2, pt3];
            return pointPatternUpwards(factors, 1, 2);
        case 6:
            //pt1 = new Point(xFactor, 2*yFactor);
            //pt2 = new Point(3*xFactor, 2*yFactor);
            //pt3 = new Point(2*xFactor, 3*yFactor);
            //return [pt1, pt2, pt3];
            return pointPatternDownwards(factors, 1, 2);
        case 7:
            return pointPatternUpwards(factors, 3, 2);
        case 8:
            return pointPatternDownwards(factors, 3, 2);
        case 9:
            return pointPatternUpwards(factors, 5, 2);
        case 10:
            if (stacked) return pointPatternUpwards(factors, 1, 4);
            else return pointPatternUpwards(factors, 8, 0);
        case 11:
            if (stacked) return pointPatternDownwards(factors, 1, 4);
            else return pointPatternDownwards(factors, 8, 0);
        default:
            return pointPatternUpwards(factors, 5, 2);
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