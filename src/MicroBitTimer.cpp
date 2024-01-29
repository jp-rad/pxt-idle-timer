#include "MicroBitTimer.h"

MicroBitCustomTimer::MicroBitCustomTimer()
{
    for (int idx = 0; idx < IDLE_TIMER_NUM; idx++)
    {
        Timer &t = timer[idx];
        t.id = idx + 1; // id: 1-IDLE_TIMER_NUM
        t.status = TimerStatus::Timeouted; // init
        t.elapsed_us = 0;
    }
    // register as idle component
    fiber_add_idle_component(this);
    status |= CUSTOM_COMPONENT_ADDED_TO_IDLE;
    status |= MICROBIT_COMPONENT_RUNNING;
}

/**
 * convert id to index
 * @param id ID
 * @returns index of array
 * 
*/
int convIdx(int id)
{
    if ((1 > id) || (IDLE_TIMER_NUM < id))
    {
        return -1;
    }
    return id - 1;
}

int MicroBitCustomTimer::start(int id, uint64_t interval_us, uint64_t timeout_us)
{
    uint64_t currentTime = system_timer_current_time_us();
    int idx = convIdx(id);
    if (0 > idx)
    {
        return -1;
    }
    if ((DISABLED_IDLETIMER_VALUE_US != interval_us) && (MINIMUM_IDLETIMER_VALUE_US > interval_us))
    {
        interval_us = MINIMUM_IDLETIMER_VALUE_US;
    }
    if ((DISABLED_IDLETIMER_VALUE_US != timeout_us) && (MINIMUM_IDLETIMER_VALUE_US > timeout_us))
    {
        timeout_us = MINIMUM_IDLETIMER_VALUE_US;
    }
    Timer &t = timer[idx];
    TimerStatus oldStatus = t.status;
    t.status = TimerStatus::Unknown;
    t.interval_us = interval_us;
    t.timeout_us = timeout_us;
    t.elapsed_us = 0;
    t.turningTimestamp = currentTime;
    if (0 < t.interval_us)
    {
        t.intervalTimestamp = currentTime + t.interval_us;
    }
    else
    {
        t.intervalTimestamp = 0;
    }
    if (0 < t.timeout_us)
    {
        t.timeoutTimestamp = currentTime + t.timeout_us;
    }
    else
    {
        t.timeoutTimestamp = 0;
    }
    t.status = TimerStatus::Started;
    if (TimerStatus::Started == oldStatus)
    {
        return 1; // restart
    }
    return 0; // start
}

int MicroBitCustomTimer::stop(int id)
{
    uint64_t currentTime = system_timer_current_time_us();
    int idx = convIdx(id);
    if (0 > idx)
    {
        return -1; // error
    }
    Timer &t = timer[idx];
    if (TimerStatus::Started != t.status)
    {
        return 1; // not started
    }
    t.status = TimerStatus::Stopped;
    t.elapsed_us = currentTime - t.turningTimestamp + t.elapsed_us;
    t.turningTimestamp = currentTime;
    return 0; // success
}

int MicroBitCustomTimer::resume(int id)
{
    uint64_t currentTime = system_timer_current_time_us();
    int idx = convIdx(id);
    if (0 > idx)
    {
        return -1; // error
    }
    Timer &t = timer[idx];
    if (TimerStatus::Stopped != t.status)
    {
        return 1; // not stopped
    }
    uint64_t pausedTime = currentTime - t.turningTimestamp;
    if (0 < t.interval_us)
    {
        t.intervalTimestamp = t.intervalTimestamp + pausedTime;
    }
    if (0 < t.timeout_us)
    {
        t.timeoutTimestamp = t.timeoutTimestamp + pausedTime;
    }
    t.turningTimestamp = currentTime;
    t.status = TimerStatus::Started;
    return 0; // success
}

MicroBitCustomTimer::TimerStatus MicroBitCustomTimer::getStatus(int id)
{
    int idx = convIdx(id);
    if (0 > idx)
    {
        return TimerStatus::Unknown;
    }
    Timer &t = timer[idx];
    return t.status;
}

uint64_t MicroBitCustomTimer::getTime(int id)
{
    uint64_t currentTime = system_timer_current_time_us();
    int idx = convIdx(id);
    if (0 > idx)
    {
        return 0;
    }
    Timer &t = timer[idx];
    if (TimerStatus::Started == t.status)
    {
        // computed
        return currentTime - t.turningTimestamp + t.elapsed_us;
    }
    // cached
    return t.elapsed_us;
}

void MicroBitCustomTimer::idleUpdate()
{
    uint64_t currentTime = system_timer_current_time_us();
    for (int idx = 0; idx < IDLE_TIMER_NUM; idx++)
    {
        Timer &t = timer[idx];
        if (TimerStatus::Started != t.status)
        {
            // not started
            continue;
        }
        if (currentTime >= t.timeoutTimestamp)
        {
            // timeouted
            t.status = TimerStatus::Timeouted;
            t.elapsed_us = t.timeout_us;
            MicroBitEvent(CUSTOM_EVENT_ID_IDLETIMER_TIMEOUT, t.id);
            continue;
        }
        if (currentTime >= t.intervalTimestamp)
        {
            // schedule the next interval
            t.intervalTimestamp = t.intervalTimestamp + t.interval_us;
            if (currentTime < t.intervalTimestamp)
            {
                // if not busy
                MicroBitEvent(CUSTOM_EVENT_ID_IDLETIMER_INTERVAL, t.id);
            }
        }
    }
}

#if MICROBIT_CODAL // ----- CODAL (v2) -------------------

MicroBitIdleTimer::MicroBitIdleTimer()
{
    //
}

void MicroBitIdleTimer::idleCallback()
{
    idleUpdate();
}

#else // ----- DAL (v1) ---------------------

MicroBitIdleTimer::MicroBitIdleTimer()
{
    //
}

void MicroBitIdleTimer::idleTick()
{
    idleUpdate();
}

#endif // ----- CODAL/DAL --------------------
