import apiService from "../index";
const slice = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => ({
                url: "/user/profile",
                method: "GET",
            }),
        }),
        getUser: builder.query({
            query: (body) => ({
                url: `/user/${body.username}`,
                method: "GET",
            }),
        }),
        editProfile: builder.mutation({
            query: (body) => ({
                url: "/user/edit",
                method: "POST",
                body,
            }),
        }),
    }),
})
export const {
    useGetProfileQuery,
    useGetUserQuery,
    useEditProfileMutation
} = slice;