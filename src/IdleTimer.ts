/**
 * The idle timer generates interval and timeout events while measuring elapsed time.
 */
//% block="Idle Timer"
//% block.loc.ja="IDLEタイマー"
//% advanced=false
//% weight=100 color=#445566 icon="\uf1da"
namespace idletimer {

    /**
     * for the simulator
     */
    const simu: any = {}

    /**
     * TimerArgs to start
     */
    export class TimerArgs {
        /**
         * constructor
         * @param interval_ms interval (ms)
         * @param timeout_ms timeout (ms)
         */
        constructor(public interval_ms: number, public timeout_ms: number) {
            //
        }
    }

    /**
     * interval timer
     * @param interval_ms interval (ms)
     * @returns param to start
     */
    //% block="interval(ms) $interval_ms"
    //% block.loc.ja="インターバル(ミリ秒) $interval_ms"
    //% toolboxParent=idletimer_timerargs_start
    //% toolboxParentArgument=args
    //% interval_ms.shadow="timePicker"
    //% interval_ms.defl=1000
    //% interval_ms.min=0
    //% weight=160
    export function IntervalTimerArgs(interval_ms: number): TimerArgs {
        return new TimerArgs(interval_ms, 0)
    }

    /**
     * timeout timer
     * @param timeout_ms timeout (ms)
     * @returns param to start
     */
    //% block="timeout(ms) $timeout_ms"
    //% block.loc.ja="タイムアウト(ミリ秒) $timeout_ms"
    //% toolboxParent=idletimer_timerargs_start
    //% toolboxParentArgument=args
    //% timeout_ms.shadow="timePicker"
    //% timeout_ms.defl=5000
    //% timeout_ms.min=0
    //% weight=150
    export function TimeoutTimerArgs(timeout_ms: number): TimerArgs {
        return new TimerArgs(0, timeout_ms)
    }

    //% block="interval(ms) $interval_ms|timeout(ms) $timeout_ms"
    //% block.loc.ja="インターバル(ミリ秒) $interval_ms|タイムアウト(ミリ秒) $timeout_ms"
    //% inlineInputMode=external
    //% toolboxParent=idletimer_timerargs_start
    //% toolboxParentArgument=args
    //% interval_ms.shadow="timePicker"
    //% interval_ms.defl=1000
    //% interval_ms.min=0
    //% timeout_ms.shadow="timePicker"
    //% timeout_ms.defl=5000
    //% timeout_ms.min=0
    //% weight=140
    /**
     * interval and timeout timer
     * @param interval_ms interval (ms)
     * @param timeout_ms timeout (ms)
     * @returns param to start
     */
    export function IntervalTimeoutTimerArgs(interval_ms: number, timeout_ms: number): TimerArgs {
        return new TimerArgs(interval_ms, timeout_ms)
    }

    /**
     * start
     * @param timer timer id
     * @param args TimerArgs - interval(ms), timeout(ms)
     */
    //% blockId="idletimer_timerargs_start"
    //% block="start $timer $args"
    //% block.loc.ja="開始する $timer $args"
    //% weight=130
    //% blockHidden=true
    //% advanced=true
    export function start(timer: IdleTimer, args: TimerArgs) {
        doStart(timer, args.interval_ms, args.timeout_ms)
    }

    /**
     * stop
     * @param timer timer id
     */
    //% block="stop $timer"
    //% block.loc.ja="停止する $timer"
    //% weight=120
    //% shim=idletimer::stop
    export function stop(timer: IdleTimer) {
        // for the simulator
        const currentTime = control.millis()
        // stop
        const timers: any[] = simu.timers
        if (!timers) {
            return
        }
        let t: any
        for (const v of timers) {
            if (timer == v.id) {
                // hit
                t = v
                break
            }
        }
        if (!t) {
            return
        }
        t.status = TimerStatus.Stopped
        t.elapsed_us = currentTime - t.turningTimestamp + t.elapsed_us
        t.turningTimestamp = currentTime
    }

    /**
     * resume
     * @param timer timer id
     */
    //% block="resume $timer"
    //% block.loc.ja="再開する $timer"
    //% weight=110
    //% shim=idletimer::resume
    export function resume(timer: IdleTimer) {
        // for the simulator
        const currentTime = control.millis()
        // resume
        const timers: any[] = simu.timers
        if (!timers) {
            return
        }
        let t: any
        for (const v of timers) {
            if (timer == v.id) {
                // hit
                t = v
                break
            }
        }
        if (!t) {
            return
        }
        if (TimerStatus.Stopped != t.status) {
            return
        }
        t.status = TimerStatus.Started
        const pausedTime = currentTime - t.turningTimestamp
        if (0 < t.interval_us) {
            t.intervalTimestamp = t.intervalTimestamp + pausedTime
        }
        if (0 < t.timeout_us) {
            t.timeoutTimestamp = t.timeoutTimestamp + pausedTime
        }
        t.turningTimestamp = currentTime
    }

    /**
     * change timeout if timeout is set
     * @param timer timer id
     * @param timeout_ms timeout(ms)
     */
    //% block="change $timer timeout(ms) $timeout_ms"
    //% block.loc.ja="変更する $timer タイムアウト(ミリ秒) $timeout_ms"
    //% timeout_ms.shadow="timePicker"
    //% timeout_ms.defl=5000
    //% timeout_ms.min=0
    //% weight=105
    //% shim=idletimer::change
    export function change(timer: IdleTimer, timeout_ms: number) {
        // for the simulator
        const currentTime = control.millis()
        // resume
        const timers: any[] = simu.timers
        if (!timers) {
            return
        }
        let t: any
        for (const v of timers) {
            if (timer == v.id) {
                // hit
                t = v
                break
            }
        }
        if (!t) {
            return
        }
        if (0 < t.timeout_us) {
            t.timeoutTimestamp = t.timeoutTimestamp - t.timeout_us + timeout_ms
            t.timeout_us = timeout_ms
        }
    }

    /**
     * elapsed time
     * @param timer timer id
     * @returns millis
     */
    //% block="millis (ms) $timer"
    //% block.loc.ja="経過時間 (ミリ秒) $timer"
    //% weight=100
    export function millis(timer: IdleTimer): number {
        return getMillis(timer)
    }

    /**
     * running
     * @param timer timer id
     * @returns running
     */
    //% block="is running $timer"
    //% block.loc.ja="実行中 $timer"
    //% weight=90
    export function isRunning(timer: IdleTimer): boolean {
        return TimerStatus.Started == getStatus(timer)
    }

    /**
     * timeouted
     * @param timer timer id
     * @returns timeouted
     */
    //% block="is timeouted $timer"
    //% block.loc.ja="タイムアウト $timer"
    //% weight=80
    export function isTimeouted(timer: IdleTimer): boolean {
        return TimerStatus.Timeouted == getStatus(timer)
    }

    /**
     * on interval
     * @param timer timer id
     * @param body 
     */
    //% block="on interval $timer"
    //% block.loc.ja="インターバルが発生したとき $timer"
    //% weight=70
    export function onInterval(timer: IdleTimer, body: () => void) {
        const handler = () => {
            if (isRunning(timer)) {
                body()
            }
        }
        control.onEvent(IDLETIMER_BUS_ID.IDLETIMER_ID_INTERVAL, timer, handler, EventFlags.DropIfBusy)
    }

    /**
     * on timeouted
     * @param timer timer id
     * @param body 
     */
    //% block="on timeouted $timer"
    //% block.loc.ja="タイムアウトが発生したとき $timer"
    //% weight=60
    export function onTimeout(timer: IdleTimer, body: () => void) {
        control.onEvent(IDLETIMER_BUS_ID.IDLETIMER_ID_TIMEOUT, timer, body, EventFlags.QueueIfBusy)
    }

    /**
     * (internal) start
     * @param timer timer id
     * @param interval_ms interval (ms) - Interval events occur at time intervals. If 0, no interval event occurs.
     * @param timeout_ms timeout (ms) - When the timeout occurs, the timer stops and a timeout event occurs. If 0, no timeout will occur
     */
    //% shim=idletimer::doStart
    export function doStart(timer: IdleTimer, interval_ms: number, timeout_ms: number) {
        // for the simulator
        const currentTime = control.millis()
        // init
        if (!simu.timers) {
            simu.timers = []
            // idle update
            basic.forever(function () {
                const currentTime = control.millis()
                const timers: any[] = simu.timers
                for (const t of timers) {
                    if (TimerStatus.Started != t.status) {
                        continue
                    }
                    if ((0 < t.timeout_us) && (currentTime >= t.timeoutTimestamp)) {
                        // timeouted
                        t.status = TimerStatus.Timeouted
                        t.elapsed_us = t.timeout_us
                        control.raiseEvent(IDLETIMER_BUS_ID.IDLETIMER_ID_TIMEOUT, t.id)
                        continue
                    }
                    if ((0 < t.interval_us) && (currentTime >= t.intervalTimestamp)) {
                        // schedule the next interval
                        t.intervalTimestamp = t.intervalTimestamp + t.interval_us
                        if (currentTime < t.intervalTimestamp) {
                            // idle if not busy
                            control.raiseEvent(IDLETIMER_BUS_ID.IDLETIMER_ID_INTERVAL, t.id)
                        }
                    }
                }
            })
        }
        // start
        const timers: any[] = simu.timers
        let t: any
        for (const v of timers) {
            if (timer == v.id) {
                // hit
                t = v
                break
            }
        }
        if (!t) {
            t = {}
            t.id = timer
            timers.push(t)
        }
        t.status = TimerStatus.Unknown
        t.interval_us = interval_ms
        t.timeout_us = timeout_ms
        t.elapsed_us = 0
        t.turningTimestamp = currentTime
        if (0 < t.interval_us) {
            t.intervalTimestamp = currentTime + t.interval_us
        }
        else {
            t.intervalTimestamp = 0
        }
        if (0 < t.timeout_us) {
            t.timeoutTimestamp = currentTime + t.timeout_us
        }
        else {
            t.timeoutTimestamp = 0
        }
        t.status = TimerStatus.Started
    }

    /**
     * (internal) status
     */
    //% shim=idletimer::getStatus
    export function getStatus(timer: number): number {
        // for the simulator
        const timers: any[] = simu.timers
        if (!timers) {
            return TimerStatus.Timeouted
        }
        let t: any
        for (const v of timers) {
            if (timer == v.id) {
                // hit
                t = v
                break
            }
        }
        if (!t) {
            return TimerStatus.Timeouted
        }
        return t.status
    }

    /**
     * (internal) millis
     */
    //% shim=idletimer::getMillis
    export function getMillis(timer: number): number {
        // for the simulator
        const currentTime = control.millis()
        // millis
        const timers: any[] = simu.timers
        if (!timers) {
            return 0
        }
        let t: any
        for (const v of timers) {
            if (timer == v.id) {
                // hit
                t = v
                break
            }
        }
        if (!t) {
            return 0
        }
        if (TimerStatus.Started == t.status) {
            // calc
            return currentTime - t.turningTimestamp + t.elapsed_us
        }
        // cached
        return t.elapsed_us
    }

}
