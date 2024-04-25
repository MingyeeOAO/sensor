class Color{
    r : number
    g : number
    b : number

    constructor(red : number, green: number, blue: number){
        this.r = red; this.g = green; this.b = blue;
    }

    get hex(): number{
        return neopixel.rgb(this.r, this.g, this.b);
    }
}
