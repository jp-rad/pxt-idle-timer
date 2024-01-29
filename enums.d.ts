// Auto-generated. Do not edit.


    /**
     * Timer 1,2,3
     * <MicroBitTimer.h>
     */

    declare const enum IdleTimer
    {
    //% block="Timer1"
    Timer1 = 1,
    //% block="Timer2"
    Timer2 = 2,
    //% block="Timer3"
    Timer3 = 3,
    }


    /**
     * micro:bit Message Bus ID of listener : 1-65535
     * Custom Message Bus ID : 32768-65535
     * https://github.com/jp-rad/pxt-ubit-extension/blob/master/doc/CustomMicroBit.h 
     */

    declare const enum IDLETIMER_BUS_ID
    {
    /**
     * Idle-Timer Start/Stop Event Bus ID.
     * (32768 + 1024 + 9 = 33801)
     */
    IDLETIMER_ID_STARTSTOP = 33801,
    /**
     * Idle-Timer Interval Event Bus ID.
     * (32768 + 1024 + 10 = 33802)
     */
    IDLETIMER_ID_INTERVAL = 33802,
    /**
     * Idle-Timer Timeout Event Bus ID.
     * (32768 + 1024 + 11 = 33803)
     */
    IDLETIMER_ID_TIMEOUT = 33803,
    // https://github.com/jp-rad/pxt-idle-timer/

    }


    /**
     * Timer status
     * <MicroBitTimer.h>
     */

    declare const enum TimerStatus
    {
    Unknown = -1,
    Timeouted = 0,
    Stopped = 1,
    Started = 2,
    }

// Auto-generated. Do not edit. Really.
