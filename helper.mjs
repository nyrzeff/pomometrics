export function debounceLeading(func, timeout = 300) {
    let timer;

    return (...args) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}

export function getHoursFromMinutes(minutes) {
    const full = minutes / 60;
    const h = Math.floor(full);
    const m = Math.round(full % 1 * 60);

    return `${h}h${m}min`;
}
