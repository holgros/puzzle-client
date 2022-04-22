let puzzleData;
let rectangleWidth;
let rectangleHeight;

let initPuzzle = (data) => {
    //console.log(data);
    puzzleData = data;
    let titleElements = document.getElementsByClassName("title");
    for (let element of titleElements) {
        element.innerHTML = data.title;
    }
    window.dispatchEvent(new Event("resize"));
}

window.onload = () => {
    //console.log("Fetching...");
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
    let innerHtml = "";
    for (let i = 0; i < 18; i++) {
        innerHtml += `<polygon class="inputTriangle" style="fill:white;stroke:gray;stroke-width:1" />
                    <svg class="angles"></svg>
                    <svg class="terms"></svg>`;
    }
    interactionArea.innerHTML = innerHtml;
    let inputTriangles = document.getElementsByClassName("inputTriangle");
    let inputAngles = document.getElementsByClassName("angles");
    for (let i = 0; i < 18; i++) {
        let points = getPoints(i, stacked);
        let angles = ["", "", ""];
        if (8 < i) angles = puzzleData.data[i-9].angles;
        let terms = ["", "", ""];
        if (8 < i) terms = puzzleData.data[i-9].terms;
        let inputTriangle = inputTriangles[i];
        let inputAngle = inputAngles[i];
        let triangle = new Triangle(points, angles, terms, [inputTriangle, inputAngle]);
        triangle.draw();
    }
}

let getPoints = (index, stacked) => {
    let xFactor = Math.round(Math.min(rectangleWidth, rectangleHeight)/6);
    let yFactor = Math.round(Math.min(rectangleWidth, rectangleHeight)*Math.sqrt(3)/6);
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