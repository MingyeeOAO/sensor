let run = false
const GROUP = 38
const dev = true // devoloper mode
let strip = neopixel.create(DigitalPin.P2, 1, NeoPixelMode.RGB)

const notes= [Note.D, Note.E, Note.G, Note.E, Note.B, 0, -1, Note.B, 0, -1, Note.A, 0, 0, -1, -1*BeatFraction.Whole*4,
    Note.D, Note.E, Note.G, Note.E, Note.A, 0, -1, Note.A, 0, -1, Note.G, 0, Note.F, Note.E, 0,
    Note.D, Note.E, Note.G, Note.E, Note.G, 0, Note.A, 0, 0, Note.F, 0, Note.E, Note.D4, 0, -1, Note.D4, 0, Note.A, 0, 0, Note.G, 0, -1, -400, 
    Note.D, Note.E, Note.G, Note.E, Note.B, 0, -1, Note.B, 0, -1, Note.A, 0, 0, -1, -1*BeatFraction.Whole*4,
    Note.D, Note.E, Note.G, Note.E, Note.D5, 0, 0, Note.FSharp, 0, 0, Note.G, 0, Note.F, Note.E, 0,
    Note.D, Note.E, Note.G, Note.E, Note.G, 0, Note.A, 0, Note.F, 0, Note.E, Note.D4, -1, 0, Note.D4, 0, Note.A, 0, 0, Note.G, 0, -1, -1*BeatFraction.Whole
]

const n2 = [Note.A4, Note.GSharp5, -1]

const nvg = new Music(notes, 114);
const st = new Music(n2, 120);

const Blue = new Color(0, 0, 255)
const Red = new Color(255, 0, 0)
const txtspd = 60

let temperature = input.temperature();
let mode = true

radio.setGroup(GROUP)

print("219 Group 38")
shake(1000)
st.play();

input.onGesture(Gesture.ScreenDown, () => {
    mode = !mode;
    if(mode) return print("Controlling", txtspd)
    return print("Tutorial", txtspd)
})

basic.forever( () => {
    strip.showColor(getColorByTem(20, 35, temperature).hex) // modify here to adjust max and min tem
})

input.onButtonPressed(Button.A,() => {
    if(mode) {
        radio.sendString("getTem")
        if(!ck(2000)) return print("No Response");
    }
    else return print("Get Temperature", txtspd);
})

input.onButtonPressed(Button.B, () =>{
    if(mode){
        radio.sendString("getDis")
        if(!ck(2000)) return print("No Response");
    }
    else return print("Get Distance", txtspd)
})

input.onButtonPressed(Button.AB, function() {
    if(mode) {
        radio.sendString("getHum")
        if (!ck(2000)) return print("No Response")
    }
    else return print("Get Humidity", txtspd);
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
        if (value < 10) {
            basic.pause(500);
            basic.clearScreen();
        }
    }
    else if(name === "Hum") {
        if(value === -999) return print('Error!')
        print(value);
        if(value >= 50) nvg.play();
    }
    else{
        if (dev) return print("Received Unknown Data")
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