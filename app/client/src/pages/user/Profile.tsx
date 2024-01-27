import { useGetProfileQuery } from "../../store/services/user";
const Profile = () => {
  const { data: user, isLoading, isError, error } = useGetProfileQuery({});
  if (isLoading) return <div>Loading..</div>;
  if (isError) return <div>Error</div>;
  console.log(user);
  
  return (
    <div>
      Profile
      {user.toString()}
    </div>
  );
};

export default Profile;
