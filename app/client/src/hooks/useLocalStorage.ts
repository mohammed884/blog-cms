const useLocalStorage = () => {
    const setItem = (key: string, value: unknown) => {
        if (!key) return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.log(error);
        }
    };
    const getItem = (key: string): unknown => {
        if (!key) return;
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    };
    const delItem = (key: string) => {
        if (!key) return;
        const deletedItem = window.localStorage.removeItem(key);
        return deletedItem;
    };
    return {
        setItem,
        getItem,
        delItem,
    }
};
export default useLocalStorage;