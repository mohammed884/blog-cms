import { useParams } from "react-router-dom";

const UserLocation = ({ location }: { location: string }) => {
  const params = useParams();
  const username = params.username?.replace(/-/g, " ");
  return (
    <div className="flex gap-2 text-sm opacity-50">
      <span>{username}</span>
      <span>{">"}</span>
      <span>{location}</span>
    </div>
  );
};

export default UserLocation;
