class Triangle {

    constructor(points, angles, terms, svgElements) {
        this.points = points;
        this.angles = angles;
        this.terms = terms;
        this.svgElement = svgElements[0];
        this.textElementAngles = svgElements[1];
        this.textElementTerms = svgElements[2];
        this.scale = Math.sqrt((points[0].x-points[1].x)*(points[0].x-points[1].x)+(points[0].y-points[1].y)*(points[0].y-points[1].y));
        this.#setOrientations();
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
    
    draw = () => {
        let points = this.points;
        let polygonString = `${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`;
        this.svgElement.setAttribute("points", polygonString);
        let dim = String(Math.round(this.scale*50));
        this.textElementAngles.setAttribute("height", dim);
        this.textElementAngles.setAttribute("width", dim);
        this.textElementAngles.innerHTML = this.#getAnglesHtml();
        this.textElementTerms.setAttribute("height", dim);
        this.textElementTerms.setAttribute("width", dim);
        this.textElementTerms.innerHTML = this.#getTermsHtml();
    }

    #getAnglesHtml = () => {
        let points = this.points;
        let angles = this.angles;
        let offset = Math.round(this.scale/6);
        let output = "";
        for (let i = 0; i < 3; i++) {
            let angle = 0;  // default är orientation == "n"
            let offsetX = 0;
            let offsetY = offset;
            let cos30 = Math.sqrt(3)/2;
            let sin30 = 1/2;
            switch (points[i].orientation) {
                case "s":
                    angle = 180;
                    offsetY = -offset;
                    break;
                case "sw":
                    angle = -120;
                    offsetX = Math.round(cos30*offset);
                    offsetY = -Math.round(sin30*offset);
                    break;
                case "se":
                    angle = 120;
                    offsetX = -Math.round(cos30*offset);
                    offsetY = -Math.round(sin30*offset);
                    break;
                case "nw":
                    angle = -60;
                    offsetX = Math.round(cos30*offset);
                    offsetY = Math.round(sin30*offset);
                    break;
                case "ne":
                    angle = 60;
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
    
    #getTermsHtml = () => {
        let points = this.points;
        let terms = this.terms;
        let offset = Math.round(this.scale/18);
        let output = "";
        for (let i = 0; i < 3; i++) {
            let angle = 0;  // default är linjen "nw-ne"
            let offsetX = 0;
            let offsetY = offset;
            let cos30 = Math.sqrt(3)/2;
            let sin30 = 1/2;
            let pt1 = points[i];
            let pt2 = points[(i+1)%3];
            let line = pt1.orientation + "-" + pt2.orientation;
            switch (line) {
                case "n-se":
                    angle = 60;
                    offsetX = -Math.round(sin30*offset);
                    offsetY = Math.round(cos30*offset);
                    break;
                case "se-sw":
                    angle = 180;
                    offsetY = -offset;
                    break;
                case "sw-n":
                    angle = -60;
                    offsetX = Math.round(sin30*offset);
                    offsetY = Math.round(cos30*offset);
                    break;
                case "ne-s":
                    angle = 120;
                    offsetX = -Math.round(sin30*offset);
                    offsetY = -Math.round(cos30*offset);
                    break;
                case "s-nw":
                    angle = -120;
                    offsetX = Math.round(sin30*offset);
                    offsetY = -Math.round(cos30*offset);
                    break;
            }
            let textX = Math.round((pt1.x+pt2.x)/2)+offsetX;
            let textY = Math.round((pt1.y+pt2.y)/2)+offsetY;
            let fontSize = Math.round(this.scale/18);
            output += `<text x="${textX}" y="${textY}" fill="blue" transform="rotate(${angle}, ${textX}, ${textY})" style="font: ${fontSize}px sans-serif; text-anchor: middle;">${terms[i]}</text>`;
            /*
            TODO: enable multiline text with responsive font??
            output += `<text x="20" y="100">${terms[i]}<tspan x="0" dy="1.2em">very long text</tspan>
            <tspan x="0" dy="1.2em">I would like to linebreak</tspan></text>`;
            */
        }
        return output;
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