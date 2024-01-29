/**
 * tests go here; this will not be compiled when this package is used as an extension.
 */
function showCountDown () {
    countdown = seconds - Math.floor(idletimer.millis(IdleTimer.Timer1) / 1000)
    if (0 > countdown || 9 < countdown) {
        basic.showLeds(`
            # # . # #
            . # . # .
            . . # . .
            . # . # .
            # # . # #
            `, 20)
    } else {
        basic.showNumber(countdown, 20)
    }
}
input.onButtonPressed(Button.A, function () {
    // To avoid runtime errors in scrolling for micro:bit v1.
    while (0 != processing) {
        basic.pause(100)
    }
    idletimer.start(IdleTimer.Timer1, idletimer.IntervalTimeoutTimerArgs(
    1000,
    seconds * 1000
    ))
    showCountDown()
})
input.onButtonPressed(Button.B, function () {
    processing += 1
    if (idletimer.isTimeouted(IdleTimer.Timer1)) {
        basic.showIcon(IconNames.Chessboard)
        basic.showIcon(IconNames.Yes)
    } else if (idletimer.isRunning(IdleTimer.Timer1)) {
        idletimer.stop(IdleTimer.Timer1)
        basic.clearScreen()
        basic.showNumber(idletimer.millis(IdleTimer.Timer1))
        basic.showIcon(IconNames.Chessboard)
    } else {
        idletimer.resume(IdleTimer.Timer1)
    }
    processing += -1
})
idletimer.onTimeout(IdleTimer.Timer1, function () {
    basic.showIcon(IconNames.Yes)
})
idletimer.onInterval(IdleTimer.Timer1, function () {
    showCountDown()
})
let processing = 0
let seconds = 0
let countdown = 0
countdown = 0
seconds = 10
processing = 0
basic.showString("A")
