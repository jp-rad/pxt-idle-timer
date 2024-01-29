#ifndef MICROBITTIMER_H
#define MICROBITTIMER_H

#include "pxt.h"
#include "../inc/CustomMicroBit.h"

/**
 * Timer 1,2,3
 * <MicroBitTimer.h>
 */
enum IdleTimer
{
    //% block="Timer1"
    Timer1 = 1,
    //% block="Timer2"
    Timer2,
    //% block="Timer3"
    Timer3,
};

// number of idle timer
#define IDLE_TIMER_NUM 3

class MicroBitCustomTimer : public MicroBitComponent
{
public:
    /**
     * Timer status
     * <MicroBitTimer.h>
     */
    enum TimerStatus
    {
        Unknown = -1,
        Timeouted = 0, // init
        Stopped = 1,
        Started = 2,
    };

public:
    MicroBitCustomTimer();

public:
    /**
     * start
     * @param id timer id (1-IDLE_TIMER_NUM)
     * @param interval_us
     * @param timeout_us
     * @returns (-1): error, (0): success, (1): restart
     */
    int start(int id, uint64_t interval_us, uint64_t timeout_us);

    /**
     * stop
     * @param id timer id (1-IDLE_TIMER_NUM)
     * @returns (-1): error, (0): success, (1): not started
     */
    int stop(int id);

    /**
     * resume
     * @param id timer id (1-IDLE_TIMER_NUM)
     * @returns (-1): error, (0): success, (1): not stoped
     */
    int resume(int id);

    /**
     * status
     * @param id timer id (1-IDLE_TIMER_NUM)
     * @returns (-1): error, (0): timeouted, (1): stoped, (2): started
     */
    TimerStatus getStatus(int id);

    /**
     * elapsed time
     * @param id timer id (1-IDLE_TIMER_NUM)
     * @returns elapsed time (us)
     */
    uint64_t getTime(int id);

protected:
/**
 * called from idleTick()/idleCallback()
*/
    virtual void idleUpdate();

private:
    // minimum interval/timeout value (us)
    static const uint64_t MINIMUM_IDLETIMER_VALUE_US = 1000 * 2;

    // disabled interval/timeout value (us)
    static const uint64_t DISABLED_IDLETIMER_VALUE_US = 0;

    /**
     * Timer
     */
    struct Timer
    {
        /**
         * timer id (1 .. <TIMER_NUM>)
         */
        int id;
        /**
         * (0): timeouted, (1): stoped, (2): started
         */
        TimerStatus status;
        /**
         * interval (us)
         * disabled if DISABLED_VALUE_US
         */
        uint64_t interval_us;
        /**
         * timeout (us)
         * disabled if DISABLED_VALUE_US
         */
        uint64_t timeout_us;
        /**
         * elapsed time (us), started, stoped or timeouted
         */
        uint64_t elapsed_us;
        /**
         * system time (us), started or stoped
         */
        uint64_t turningTimestamp;
        /**
         * scheduled for next interval event
         */
        uint64_t intervalTimestamp;
        /**
         * scheduled for timeout
         */
        uint64_t timeoutTimestamp;
    };

    /**
     * Timer objects
     */
    Timer timer[IDLE_TIMER_NUM];
};

#if MICROBIT_CODAL // ----- CODAL (v2) -------------------

class MicroBitIdleTimer : public MicroBitCustomTimer
{
public:
    MicroBitIdleTimer();
public:
    virtual void idleCallback();
};

#else // ----- DAL (v1) ---------------------

class MicroBitIdleTimer : public MicroBitCustomTimer
{
public:
    MicroBitIdleTimer();
public:
    virtual void idleTick();
};

#endif // ----- CODAL/DAL --------------------

#endif // #ifndef MICROBITTIMER_H
