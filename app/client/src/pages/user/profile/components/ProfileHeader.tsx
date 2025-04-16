import React, { useEffect, useState } from "react";
import {
  AlertIcon,
  Ellipsis,
  UserAvatarIcon,
} from "../../../../components/Icons";
import { useBlockUserActionsMutation } from "../../../../services/queries/user";
import { Link } from "react-router-dom";
interface IProfileHeaderProps {
  username: string;
  email: string;
  userId: string;
  isSameUser: boolean;
  isConfirmed: boolean;
}
const ProfileHeader = ({
  username,
  userId,
  isSameUser,
  isConfirmed,
}: IProfileHeaderProps) => {
  const [showOptions, setShowOptions] = useState(false);
  useEffect(() => {
    window.document.body.addEventListener("click", handleHideOptions);
    return () =>
      window.document.body.removeEventListener("click", handleHideOptions);
  }, []);
  const blockUserActionsMutation = useBlockUserActionsMutation();
  const handleHideOptions = (e: any) => {
    const parent = e.target.closest("#options-container");
    if (parent) return;
    setShowOptions(false);
  };
  const menuOptions = [
    {
      context: "تحليل البيانات",
      profileOwnerOption: true,
      href: "/user/analysis",
      requireConfirmation: false,
    },
    {
      context: "تاكيد الحساب",
      profileOwnerOption: true,
      requireConfirmation: false,
      href: "/user/analysis",
    },
    {
      context: "قائمة المحظورين",
      profileOwnerOption: true,
      href: "/user/blocked",
      requireConfirmation: true,
    },
    {
      context: "حظر المستخدم",
      profileOwnerOption: false,
      requireConfirmation: true,
    },
  ];
  return (
    <React.Fragment>
      <div className="flex justify-between items-center gap-8">
        <div className="flex gap-4">
          <UserAvatarIcon
            width={8}
            height={8}
            avatar=""
            alt={`${username}' avatar`}
          />
          <h1 className="text-3xl font-bold">{username}</h1>
        </div>
        <div id="options-container" className="relative">
          <button
            id="ellipsis"
            type="button"
            className="w-5 h-8"
            onClick={() => setShowOptions((prev) => !prev)}
          >
            <Ellipsis />
          </button>
          <div
            className={`w-[14rem] bg-off_white h-fit ${
              !showOptions && "hidden"
            } shadow-md mx-auto absolute top-6 left-4 rounded-md z-[10000]`}
          >
            <ul
              id="notifications-list"
              className="divide-y-reverse divide-stone-300 "
            >
              {menuOptions.map(
                ({ href, profileOwnerOption, context, requireConfirmation }) =>
                  href && isSameUser ? (
                    <Link to={href} key={context}>
                      <li
                        className={`text-sm px-3 p-3 hover:bg-light_gray shadow-sm cursor-pointer 
                  ${profileOwnerOption !== isSameUser && "hidden"}`}
                      >
                        {context}
                      </li>
                    </Link>
                  ) : (
                    <li
                      onClick={() => {
                        context === "حظر المستخدم" &&
                          blockUserActionsMutation.mutate({
                            action: "block",
                            userId,
                          });
                      }}
                      key={context}
                      className={`text-sm px-3 p-3 hover:bg-stone-50 shadow-sm cursor-pointer 
                  ${isSameUser && "hidden"} ${
                        isConfirmed !== requireConfirmation && "hidden"
                      }`}
                    >
                      {context}
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      </div>
      {isSameUser && !isConfirmed && (
        <div className="w-[90%] h-fit flex items-center gap-2 bg-yellow-50 text-md font-medium rounded-md mx-auto mt-4">
          <div className="py-2 w-2 h-full rounded-r-md bg-yellow-400 text-yellow-400">
            0
          </div>
          <div className="flex items-center gap-[.35rem] text-[.9rem]">
            <span>
              تنبيه ! الرجاء تاكيد الحساب لاستخدام كامل الميزات المتاحة في
              المنصة
            </span>
            <AlertIcon width={4} height={4} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ProfileHeader;
