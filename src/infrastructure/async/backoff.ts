const pause = (duration) => new Promise(res => setTimeout(res, duration));

export const backoff = (retries, fn, delay) =>
    fn().catch(err => retries > 1
        ? ''
        : Promise.reject(err));