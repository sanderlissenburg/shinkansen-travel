const pause = (duration) => new Promise(res => setTimeout(res, duration));

export const backoff = (retries, fn, delay) =>
    fn().catch(err => retries > 1
        ? pause(delay).then(() => backoff(retries - 1, fn, delay * 2))
        : Promise.reject(err));