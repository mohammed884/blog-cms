const getDateYMD = (date) => {
    const validDate = typeof date === "string" ? new Date(date) : date;
    const year = validDate.getFullYear();
    const month = validDate.getMonth();
    const day = validDate.getDate();
    return { year, month, day };
}
const getMonthLength = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
}
const formatDateToYMD = (
    date: string | Date,
    dayToSet: "_" | number[] = "_",
    dateType: "ISO" | "DATE" = "DATE"
) => {
    //this function will convert a date array or a single date to YYYY-MM-DD
    const validDate = typeof date === "string" ? new Date(date) : date;
    const { year, month, day } = getDateYMD(validDate);

    if (Array.isArray(dayToSet)) {
        return dayToSet.map(day => {
            const date = new Date(year, month, day);
            date.setDate(day);
            return dateType === "ISO" ? date.toISOString() : date
        });
    };
    typeof dayToSet === "number" && validDate.setDate(dayToSet);
    dateType === "ISO" ? validDate.toISOString() : validDate
    return validDate;
};
const convertToMs = (time: string) => {
    const [a, type]: Array<string> = time.split("-");
    const amount = Number(a)
    switch (type) {
        case "seconds" || "s":
            return amount * 1000;
        case "minutes" || "m":
            return amount * 60 * 1000;
        case "hours" || "h":
            return amount * 60 * 60 * 1000;
        case "days" || "d":
            return amount * 24 * 60 * 60 * 1000;
        case "weeks" || "w":
            return amount * 7 * 24 * 60 * 60 * 1000;
        case "months" || "m":
            return amount * 30 * 24 * 60 * 60 * 1000;
        case "years" || "y":
            return amount * 365 * 24 * 60 * 60 * 1000;
    }
}
export {
    formatDateToYMD,
    getDateYMD,
    getMonthLength,
    convertToMs
}