import apiService from '../index';
const slice = apiService.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ success: boolean, message?: string }, { password: string, email: string }>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),
        register: builder.mutation({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        })
    }),
});
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = slice;
export default slice;