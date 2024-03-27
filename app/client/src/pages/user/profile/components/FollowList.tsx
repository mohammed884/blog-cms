import { Link } from "react-router-dom";
import { UserAvatarIcon } from "../../../../components/Icons";
import FollowButton from "../../../../components/FollowButton";
import { Ellipsis } from "../../../../components/Icons";
import { useState } from "react";
interface IProps {
  user: {
    _id: string;
    username: string;
    avatar: string;
    bio: {
      _id: string;
      text: string;
    };
  };
  isFollowingYou: boolean;
  youFollowing: boolean;
}
const UsersList = ({ user, isFollowingYou, youFollowing }: IProps) => {
  const { username, avatar, bio } = user;
  return (
    <li className="flex items-center justify-between gap-2 pt-2">
      <Link to={`/user/${username}`}>
        <div className="flex items-center gap-2">
          <span>
            <UserAvatarIcon
              width={6}
              height={6}
              avatar={avatar}
              alt={`${username}'s avatar`}
            />
          </span>
          <div>
            <span className="text-sm font-semibold opacity-60 hover:underline">
              {username}
            </span>
            <span>{bio.text}</span>
          </div>
        </div>
      </Link>
      <button className="p-2 hover:bg-gray-200 rounded-md">
        <Ellipsis width={4} height={4} />
      </button>
    </li>
  );
};

export default UsersList;
