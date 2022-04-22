class Triangle {

    constructor(points, angles, terms, svgElements) {
        this.points = points;
        this.angles = angles;
        this.terms = terms;
        this.svgElement = svgElements[0];
        this.textElementAngles = svgElements[1];
        this.scale = Math.sqrt((points[0].x-points[1].x)*(points[0].x-points[1].x)+(points[0].y-points[1].y)*(points[0].y-points[1].y));
        this.#setOrientations();
    }
    
    draw = () => {
        let points = this.points;
        let polygonString = `${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`;
        this.svgElement.setAttribute("points", polygonString);
        this.textElementAngles.setAttribute("height", "2000");   // TODO: adjust to scale
        this.textElementAngles.setAttribute("width", "2000");   // TODO: adjust to scale
        this.textElementAngles.innerHTML = this.#getAnglesHtml(points, this.angles);
    }
    
    #getAnglesHtml = (points, angles) => {
        let offset = Math.round(this.scale/6);
        let output = "";
        for (let i = 0; i < 3; i++) {
            let angle = 0;  // default är orientation == "n"
            let offsetX = 0;
            let offsetY = offset;
            let cos30 = Math.sqrt(3)/2
            let sin30 = 1/2;
            switch (points[i].orientation) {
                case "s":
                    angle = 180;
                    offsetY = -offset;
                    break;
                case "sw":
                    angle = 60;
                    offsetX = Math.round(cos30*offset);
                    offsetY = -Math.round(sin30*offset);
                    break;
                case "se":
                    angle = -60;
                    offsetX = -Math.round(cos30*offset);
                    offsetY = -Math.round(sin30*offset);
                    break;
                case "nw":
                    angle = 120;
                    offsetX = Math.round(cos30*offset);
                    offsetY = Math.round(sin30*offset);
                    break;
                case "ne":
                    angle = -120;
                    offsetX = -Math.round(cos30*offset);
                    offsetY = Math.round(sin30*offset);
                    break;
            }
            let textX = points[i].x+offsetX;
            let textY = points[i].y+offsetY;
            let fontSize = Math.round(this.scale/12);
            output += `<text x="${textX}" y="${textY}" fill="red" transform="rotate(${angle}, ${textX}, ${textY})" style="font: ${fontSize}px sans-serif; text-anchor: middle;">${angles[i]}</text>`;
        }
        return output;
    }
    
    #setOrientations = () => {
        for (let point of this.points) {
            let otherPoints = this.points.filter((value) => {return value != point});
            let orientation = "";
            if (point.y <= Math.min(otherPoints[0].y, otherPoints[1].y)) orientation += "n";    // north
            if (point.y >= Math.max(otherPoints[0].y, otherPoints[1].y)) orientation += "s";    // south
            if (point.x <= Math.min(otherPoints[0].x, otherPoints[1].x)) orientation += "w";    // west
            if (point.x >= Math.max(otherPoints[0].x, otherPoints[1].x)) orientation += "e";    // east
            point.orientation = orientation;
        }
    }
    
    rotate = () => {
        // TODO!
        this.#setOrientations();
    }

}

class Point {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}