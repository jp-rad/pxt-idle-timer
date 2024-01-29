#include "pxt.h"
#include "MicroBitTimer.h"

namespace idletimer
{

    MicroBitIdleTimer *_pIdleTimer = NULL;

    void init()
    {
        if (NULL != _pIdleTimer)
            return;
        _pIdleTimer = new MicroBitIdleTimer();
    }

    //%
    void doStart(int timer, int interval_ms, int timeout_ms)
    {
        init();
        if (0 > interval_ms)
        {
            interval_ms = 0;
        }
        if (0 > timeout_ms)
        {
            timeout_ms = 0;
        }
        _pIdleTimer->start(timer, (uint64_t)interval_ms * 1000, (uint64_t)timeout_ms * 1000);
    }

    //%
    void stop(int timer)
    {
        init();
        _pIdleTimer->stop(timer);
    }

    //%
    void resume(int timer)
    {
        init();
        _pIdleTimer->resume(timer);
    }

    //%
    void change(int timer, int timeout_ms)
    {
        init();
        _pIdleTimer->change(timer, (uint64_t)timeout_ms * 1000);
    }

    //%
    int getMillis(int timer)
    {
        init();
        return _pIdleTimer->getTime(timer) / 1000;
    }

    //%
    int getStatus(int timer)
    {
        init();
        return _pIdleTimer->getStatus(timer);
    }
}
