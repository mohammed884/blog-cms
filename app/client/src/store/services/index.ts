import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface IEndpoints {
  [key: string]: any
  // define the keys and types for the endpoints object
}
const apiService = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}`, credentials: 'include', }),
  endpoints: () => ({
  }) // No endpoints defined here initially
});
// export * from './auth/index';
// export * from './article/index';
// export * from './user';
// export * from './comments/api';
export default apiService;
