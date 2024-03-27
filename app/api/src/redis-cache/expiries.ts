import { convertToMs } from "../helpers/date";

export const USER_CACHE_EXPIARY = convertToMs("12-h");
export const USER_SAVED_CACHE_EXPIARY = convertToMs("1-d");
export const USER_BLOCKED_CACHE_EXPIARY = convertToMs("1-d");