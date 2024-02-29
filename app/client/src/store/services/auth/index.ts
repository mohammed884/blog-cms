import apiService from '../index';
const slice = apiService.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{
            success: boolean,
            username?: string
        }, {
            password: string,
            email: string
        }
        >({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
                invalidatesTags: ["User"],
            }),
        }),
        register: builder.mutation<{
            success: boolean,
            message?: string
        }, {
            username: string,
            password: string,
            email: string,
            topics?: Array<string>
        }>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
                invalidatesTags: ["User"],
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                invalidatesTags: ["User"],
            }),
        })
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = slice;
export default slice;