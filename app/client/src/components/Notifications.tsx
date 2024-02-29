import { useEffect, useState } from "react";
import { useGetNotificationsQuery } from "../store/services/user";
import dayjs from "dayjs";
import { BlankUserIcon, UserAvatarIcon } from "./Icons";
import { Link } from "react-router-dom";
const Notifications = ({
  setOpenNotifications,
}: {
  setOpenNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const messages = [
    { type: "follow", context: "قام بمتابعتك" },
    { type: "comment", context: "علق على منشورك" },
    { type: "reply", context: "رد على تعليقك" },
    { type: "collaboration-request", context: "طلب التعاون" },
    { type: "collaboration-accept", context: "قبل التعاون" },
    { type: "collaboration-deny", context: "رفض التعاون" },
  ];
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetNotificationsQuery({
    page,
  });
  const handleCloseNotfications = (e: any) => {
    const target = e.target;
    const isUl = target?.closest("ul");
    if (
      (isUl && isUl?.id === "notifications-list") ||
      isUl?.id === "links-list" ||
      target.tagName === "IMG"
    )
      return;
    setOpenNotifications((prev) => !prev);
  };
  const handleFollow = (action: "follow" | "un-follow") => {};
  useEffect(() => {
    window.document.body.addEventListener("click", handleCloseNotfications);
    return () =>
      window.document.body.removeEventListener(
        "click",
        handleCloseNotfications
      );
  }, []);
  if (isLoading) return <div>...lodaing</div>;
  if (isError) return <div>...error</div>;
  return (
    <ul id="notifications-list" className="w-[95%] mx-auto">
      {data?.notifications.map((notification) => {
        const { sender, createdAt } = notification;
        const { username, avatar } = sender;
        return (
          <li
            key={notification.retrieveId}
            className="flex gap-2 p-4 rounded-md shadow-sm"
          >
            <div>
              <Link
                to={`/user/${username}`}
                onClick={() => setOpenNotifications(false)}
              >
                {avatar ? (
                  <UserAvatarIcon
                    width={6}
                    height={6}
                    avatar={avatar}
                    alt={`${username}'s Avatar`}
                  />
                ) : (
                  <BlankUserIcon
                    width={6}
                    height={6}
                    alt={`${username}'s Avatar`}
                  />
                )}
              </Link>
            </div>
            <div className="flex justify-between items-center flex-grow">
              <div className="flex flex-col">
                <div>
                  <Link
                    to={`/user/${username}`}
                    onClick={() => setOpenNotifications(false)}
                  >
                    <span className="font-bold">{username} </span>
                  </Link>
                  <span>
                    {
                      messages.find(
                        (message) => message.type === notification.type
                      )?.context
                    }
                  </span>
                </div>
                <span className="opacity-80 text-[.8rem]">
                  قبل {dayjs(new Date()).diff(createdAt, "day")} ايام
                </span>
              </div>

              <button
                onClick={() => handleFollow("follow")}
                className="text-[.8rem] font-bold text-off_white border bg-gray-900 hover:bg-gray-800 transition-colors ease-in p-2 px-4 rounded-lg"
              >
                متابعة
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Notifications;
