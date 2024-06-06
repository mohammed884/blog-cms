import { useEffect, useState } from "react";
const useDebounce = <T>(value: T, delay = 560) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value)
        }, delay);
        return () => clearInterval(timeout);
    }, [value, delay]);
    return debouncedValue;
};
export default useDebounce;