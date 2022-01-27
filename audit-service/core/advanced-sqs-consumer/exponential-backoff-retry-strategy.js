class ExponentialBackoffRetryStrategy {
    constructor(initialDelay, maxDelay) {
        this.initialDelay = initialDelay;
        this.maxDelay = maxDelay;
    }

    getDelayBeforeNextRetry(retriesAttempted) {
        if (retriesAttempted < 1) {
            return this.initialDelay;
        }
        const multiplier = Math.pow(2, retriesAttempted);
        const delay = Math.min(multiplier * this.initialDelay, this.maxDelay);
        return delay;
    }
}

module.exports = ExponentialBackoffRetryStrategy;