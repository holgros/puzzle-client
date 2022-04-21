class Triangle {
    constructor(points, angles, terms, svgElement) {
        this.points = points;
        this.angles = angles;
        this.terms = terms;
        this.svgElement = svgElement;
    }
    draw = () => {
        let points = this.points;
        let polygonString = `${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`;
        this.svgElement.setAttribute("points", polygonString);
    }
    rotate = () => {

    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}