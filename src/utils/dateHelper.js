export const formatDateToEST = (dateString) => {
    const date = new Date(dateString);
    const offset = -5; // Adjust for EST (without daylight saving time)
    const utcDate = date.getTime() + (date.getTimezoneOffset() * 60000);
    const estDate = new Date(utcDate + (3600000 * offset));

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    return estDate.toLocaleString('en-US', options);
};
