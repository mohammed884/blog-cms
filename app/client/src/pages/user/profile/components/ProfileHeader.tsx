import React, { useEffect, useState } from "react";
import { AlertIcon, Ellipsis } from "../../../../components/Icons";
import { userSelector } from "../../../../services/queries/user";
interface IProfileHeaderProps {
  username: string;
  email: string;
  isSameUser: boolean;
  isConfirmed: boolean;
}
const ProfileHeader = ({
  username,
  email,
  isSameUser,
  isConfirmed,
}: IProfileHeaderProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const handleHideOptions = (e: any) => {
    const parent = e.target.closest("#options-container");
    if (parent) return;
    setShowOptions(false);
  };
  useEffect(() => {
    window.document.body.addEventListener("click", handleHideOptions);
    return () =>
      window.document.body.removeEventListener("click", handleHideOptions);
  }, []);
  const menuOptions = [
    // { context: "نسخ رابط الحساب" },
    { context: "تحليل البيانات", profileOwner: true },
    { context: "تاكيد الحساب", profileOwner: true },
    { context: "قائمة المحظورين", profileOwner: true },
    { context: "حظر المستخدم", profileOwner: false },
  ];
  return (
    <React.Fragment>
      <div className="flex justify-between items-center gap-8">
        <h1 className="text-3xl font-bold">{username}</h1>
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
            } shadow-md mx-auto absolute top-6 left-4 rounded-md`}
          >
            {/* <h4>{email}</h4> */}
            <ul id="notifications-list" className="divide-y divide-stone-300">
              {menuOptions.map((option) => (
                <li
                  key={option.context}
                  className={`text-sm px-3 p-3 hover:bg-stone-50 shadow-sm cursor-pointer ${
                    option.profileOwner !== isSameUser && "hidden"
                  }`}
                >
                  {option.context}
                </li>
              ))}
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
