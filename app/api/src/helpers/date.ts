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
export {
    formatDateToYMD,
    getDateYMD,
    getMonthLength
}