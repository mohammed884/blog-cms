import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiService = createApi({
  tagTypes: ["Profile", "User", "Publisher-Articles", "Saved-Articles", "Notifications", "Following-count", "Followers-count"],
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_URL}`, credentials: 'include', }),
  endpoints: () => ({
  }) // No endpoints defined here initially
});
export default apiService;
