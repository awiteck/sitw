const DIM = Math.min(window.innerWidth, window.innerHeight)
const W = DIM
const H = DIM
const U = DIM / 500
console.log(W)

class Random {
    random_dec = () => fxrand()
    random_num = (a, b) => a+(b-a)*this.random_dec()
    random_int = (a, b) => Math.floor(this.random_num(a, b+1))
    random_idx = (arr) => arr[this.random_int(0, arr.length-1)]
}
const R = new Random()

class Rock {
    constructor(xRock, yRock, rRock){
        this.x = xRock
        this.y = yRock
        this.r = rRock
    }
    render(){
        push()
        fill(0)
        ellipse(this.x, this.y, 2*this.r, 2*this.r)
        pop()
    }
}

class Rocks {
    constructor(numRocks){
        this.num = numRocks
        this.rocks = this.getRocks(this.num)
    }
    getRocks() {
        let rocks = []
        let numAdded = 0
        while (numAdded < this.num){
            let rock = new Rock(R.random_int(0,W), R.random_int(0,H), R.random_int(10,15))
            let overlap = false
            for (let j = 0; j < rocks.length; j++) {
                if ((rock.x - rocks[j].x)**2 + (rock.y - rocks[j].y)**2 < (rock.r+rocks[j].z)**2) {
                    overlap = true
                }
            }
            if (!overlap) {
                rocks.push(rock)
                numAdded++
            }
        }
        return rocks
    }
    render() {
        this.rocks.map(r => r.render())
    }
}

class Stream {
    constructor(points) {
        this.points = points
    }
    /*
    constructor(xStream, rocks) {
        this.points = this.getPoints(xStream)
        this.rocks = rocks
        this.x = xStream
    }


    getPoints(xStream) {
        let points = []
        for (let y = 0; y < H; y+=3) points.push(createVector(xStream, y));
        return points;
    }
    */

    shift(forceMap) {
        // console.log(forceMap)
        let points = this.points.map(p => forceMap(p))
        return new Stream(points)
    }

    render(){
        push()
        noFill()
        stroke(100)
        const d0 = R.random_num(1, 50)*U
        const d1 = R.random_num(1, 5)*U
        drawingContext.setLineDash([d0, d1])
        beginShape()
        vertex(this.x,H)
        this.points.map(p => curveVertex(p.x, p.y))
        vertex(this.x,H)
        endShape()
        pop()
    }
}

class Force {
    constructor(rock) {
        this.loc = createVector(rock.x, rock.y)
        this.r = rock.r
    }
    apply(v){
        console.log("apply function")
        const dist = this.loc.dist(v)
        if(dist > this.r) return v
        return createVector(v.x + 10, v.y)
        /*
        const theta = asin((v.y-this.y)/this.r)
        if (this.x < v.x){
            return createVector(v.x + this.r * cos(theta) + 5, v.y)
        }
        return createVector(v.x -(this.r * cos(theta) + 5), v.y)
        */
    }
}

const getForceMap = (rocks) => {
    let forces = []

    for (let i = 0; i < rocks.length; rocks++) {
        console.log("Pushing force")
        forces.push(new Force(rocks[i]))
    }
    return (point) => {
        forces.forEach(f => {
            point = f.apply(point)
        })
        return point
    }
}

getPoints = (x) => {
    let points = []
    for (let y = 0; y < H; y+=3) points.push(createVector(x, y));
    return points;
}


function setup(){
    createCanvas(W, H)
    background(255)
    let rocks = new Rocks(10)
    forceMap = getForceMap(rocks)
    console.log(rocks.rocks[0].x, rocks.rocks[0].y)
    let vec = forceMap(createVector(rocks.rocks[0].x, rocks.rocks[0].y))
    console.log(vec.x, vec.y)
    rocks.render()
    for (let x = 0; x < W; x+=5){
        let str = new Stream(getPoints(x))
        str = str.shift(forceMap)
        str.render()
    }
    
    
    /*
    for (let i = 0; i < 10; i++){
        let rock = new Rock(R.random_int(0,W), R.random_int(0,H), R.random_int(10,100))
        rock.render()
    }
    */
}
