let run = false
const GROUP = 38
let strip = neopixel.create(DigitalPin.P2, 1, NeoPixelMode.RGB)

const notes= [Note.D, Note.E, Note.G, Note.E, Note.B, 0, -1, Note.B, 0, -1, Note.A, 0, 0, -1, -1*BeatFraction.Whole*4,
    Note.D, Note.E, Note.G, Note.E, Note.A, 0, -1, Note.A, 0, -1, Note.G, 0, Note.F, Note.E, 0,
    Note.D, Note.E, Note.G, Note.E, Note.G, 0, Note.A, 0, 0, Note.F, 0, Note.E, Note.D4, 0, -1, Note.D4, 0, Note.A, 0, 0, Note.G, 0, -1, -400, 
    Note.D, Note.E, Note.G, Note.E, Note.B, 0, -1, Note.B, 0, -1, Note.A, 0, 0, -1, -1*BeatFraction.Whole*4,
    Note.D, Note.E, Note.G, Note.E, Note.D5, 0, 0, Note.FSharp, 0, 0, Note.G, 0, Note.F, Note.E, 0,
    Note.D, Note.E, Note.G, Note.E, Note.G, 0, Note.A, 0, Note.F, 0, Note.E, Note.D4, -1, 0, Note.D4, 0, Note.A, 0, 0, Note.G, 0, -1, -1*BeatFraction.Whole
]

const nvg = new Music(notes, 114);

const Blue = new Color(0, 0, 255)
const Red = new Color(255, 0, 0)

let temperature = 27;

radio.setGroup(GROUP)

basic.forever( () => {
    
    strip.showColor(getColorByTem(20, 35, temperature).hex)
})

input.onButtonPressed(Button.A,() => {
    radio.sendString("getTem")
    if(!ck(2000)) return print("No Response");
})
input.onButtonPressed(Button.B, () =>{
    radio.sendString("getDis")
    if(!ck(2000)) return print("No Response");
})
input.onButtonPressed(Button.AB, function() {
    radio.sendString("getHum")
    if (!ck(2000)) return print("No Response")
})
radio.onReceivedValue((name: string, value: number) => {
    swch()
    if(name === "Tem") {
        if(value === -999){
            return print("ERROR!")
        }
        temperature = value;
        return print(value);
    } 
    else if(name === "Dis"){
        print(value);
        if(value <= 5) shake(500*(6-value));
    }
    else if(name === "Hum") {
        if(value === -999) return print('Error!')
        print(value);
        if(value >= 50) nvg.play();
    }
    else{
        return print("Unknown Data")
    }
})

function print(text : number | string, interval : number = 75){
    if(typeof(text) == 'number') return basic.showNumber(text, interval);
    if(typeof(text) == 'string') return basic.showString(text, interval);
}

function swch(){
    run = !run;
}
function ck(wt : number){
    const tmp = run
    swch()
    basic.pause(wt)
    return run == tmp
}

function shake(duration : number) {
    pins.digitalWritePin(DigitalPin.P1, 1)
    basic.pause(duration);
    pins.digitalWritePin(DigitalPin.P1, 0);
    return
}

function colorRamp(l : Color, r : Color, t : number) {
    const tt = 1-t
    return new Color(l.r*t + r.r*tt, l.g*t+r.g*tt, l.b*t + r.b*tt);
}

function getColorByTem(l : number, r : number, t : number){
    return colorRamp(Blue, Red, t/(r-l));
}