let run = false
const GROUP = 10

radio.setGroup(GROUP)
basic.forever( () => {

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
        return print(value);
    }
    else if(name === "Dis"){
        print(value);
        if(value <= 5) shake(500*(6-value));
    }
    else if(name === "Hum") {
        print(value);
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