import { useParams } from "react-router-dom";
interface IUserLocation {
  location: string;
  providedUsername?: string;
}
const UserLocation = ({ location, providedUsername }: IUserLocation) => {
  const params = useParams();
  const username = providedUsername || params.username?.replace(/-/g, " ");
  return (
    <div className="flex gap-2 text-sm opacity-50">
      <span>{username}</span>
      <span>{">"}</span>
      <span>{location}</span>
    </div>
  );
};

export default UserLocation;
