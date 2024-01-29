// Auto-generated. Do not edit.


    /**
     * micro:bit Message Bus ID of listener : 1-65535
     * Custom Message Bus ID : 32768-65535
     */

    declare const enum CUSTOM_BUS_ID
    {
    /**
     * S3Link UDK Event Bus ID.
     * (32768 + 1024 + 1 = 33793)
     */
    CUSTOM_EVENT_ID_S3LINK_UDK = 33793,
    // https://github.com/jp-rad/pxt-s3link-udk/

    /**
     * MState Update Event Bus ID.
     * (32768 + 1024 + 5 = 33797)
     */
    CUSTOM_EVENT_ID_MSTATE_UPDATE = 33797,
    // https://github.com/jp-rad/pxt-mstate/

    /**
     * Idle-Timer Interval Event Bus ID.
     * (32768 + 1024 + 9 = 33801)
     */
    CUSTOM_EVENT_ID_IDLETIMER_INTERVAL = 33801,
    /**
     * Idle-Timer Timeout Event Bus ID.
     * (32768 + 1024 + 10 = 33802)
     */
    CUSTOM_EVENT_ID_IDLETIMER_TIMEOUT = 33802,
    // https://github.com/jp-rad/pxt-idle-timer/

    }


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
