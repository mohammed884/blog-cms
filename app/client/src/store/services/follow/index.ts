import apiService from "..";
interface IFollowing {
  user: { _id: string, username: string, avatar: string };
  followedBy: string;
  createdAt: Date
}
interface IFollowers {
  user: string;
  followedBy: { _id: string, username: string, avatar: string };
  createdAt: Date
}; const slice = apiService.injectEndpoints({

  endpoints: (builder) => ({
    getFollowers: builder.query<{ success: boolean, followers: Array<IFollowers> }, { id: string }>({
      query: (body) => ({
        url: `/user/followers/${body.id}`
      })
    }),
    getFollowing: builder.query<{ success: boolean, following: Array<IFollowing> }, { id: string }>({
      query: (body) => ({
        url: `/user/following/${body.id}`
      }),
      providesTags: ["Following-count"]
    }),
    getFollowersCount: builder.query<{ success: boolean, count: number }, { id: string }>({
      query: (body) => ({
        url: `/user/count/followers/${body.id}`,
      }),
      providesTags: ["Followers-count"]
    }),
    getFollowingCount: builder.query<{ success: boolean, count: number }, { id: string }>({
      query: (body) => ({
        url: `/user/count/following/${body.id}`
      })
    }),
    getFollowersAnalysis: builder.query<{ success: boolean, data: [] }, {}>({
      query: () => ({
        url: "/user/followers/analysis"
      })
    }),
    followUser: builder.mutation<
      { success: boolean; message: string },
      { id: string; action: "follow" | "un-follow" }
    >({
      query: (body) => ({
        method: "PATCH",
        url: `/user/follow/${body.id}?action=${body.action}`,
      }),
      invalidatesTags: ["User", "Notifications", "Followers-count", "Following-count"],
    }),
  }),
});
export const {
  useGetFollowingQuery,
  useGetFollowersQuery,
  useGetFollowingCountQuery,
  useGetFollowersCountQuery,
  useGetFollowersAnalysisQuery,
  useFollowUserMutation
} = slice 