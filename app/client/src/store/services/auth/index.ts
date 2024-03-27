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
            }),
            // invalidatesTags: ["Profile"],
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
            }),
            // invalidatesTags: ["Profile"],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            // invalidatesTags: ["Profile"],
        })
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = slice;
export default slice;