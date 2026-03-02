export class Interval {
    constructor(parentElement, parameterType, startTime, endTime, startValue, endValue, rate, interpolationType) {
        this.parentElement = parentElement
        this.parameterType = parameterType;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startValue = startValue;
        this.endValue = endValue;
        this.rate = rate;
        this.interpolationType = interpolationType;
    }   

    getValue(t) {
        const interpolationDictionary = {
            "linear" : linear,
            "static" : staticInterval,
        }
        return interpolationDictionary[this.interpolationType](t, this)
    }

    setStartTime(t) {
        this.startTime = t
    }

    setEndTime(t) {
        this.endTime = t
    }

    setStartValue(x) {
        this.startValue = x
    }

    setEndValue(x) {
        this.endValue = x
    }

    setInterpolationType(type) {
        this.interpolationType = type
    }
}


export function linear(t, interval) {
    if (interval.endTime == Infinity) {
        endTime = interval.parentElement.parentSlide.duration
    } else {
        endTime = interval.endTime
    }
    return (t-interval.startTime)/(endTime-interval.startTime) * (interval.endValue - interval.startValue)+interval.startValue
}


export function staticInterval(t, interval) {
    return interval.startValue
}