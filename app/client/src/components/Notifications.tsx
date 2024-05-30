import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { MarkAsReaded, UserAvatarIcon, VerticalEllipsis } from "./Icons";
import { Link } from "react-router-dom";
import { INotification } from "../interfaces/global";
import FollowButton from "./FollowButton";
import {
  getNotificationsQuery,
  useMarkNotificationAsReadedMutation,
} from "../services/queries/user";
interface INotificationListProps {
  pageIndex: number;
  notificationIndex: number;
  receiver: string;
  notification: INotification;
  messages: Array<{
    type: string;
    context: string;
  }>;
  setOpenNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}
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
  const notificationsData = getNotificationsQuery();
  useEffect(() => {
    window.document.body.addEventListener("click", handleCloseNotfications);
    return () =>
      window.document.body.removeEventListener(
        "click",
        handleCloseNotfications
      );
  }, []);
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
  if (notificationsData.isLoading) return <div>...lodaing</div>;
  if (notificationsData.isError) return <div>...error</div>;
  const pages = notificationsData?.data?.pages || [];
  return (
    <ul id="notifications-list" className="w-[95%] mx-auto">
      {Number(pages[0].notifications.length) > 0 ? (
        pages.map((page, pageIndex) =>
          page.notifications.map((notification, notificationIndex) => (
            <NotificationList
              pageIndex={pageIndex}
              notificationIndex={notificationIndex}
              messages={messages}
              key={notification.retrieveId}
              receiver={notificationsData.data?.pages[0].receiver || ""}
              notification={notification}
              setOpenNotifications={setOpenNotifications}
            />
          ))
        )
      ) : (
        <span className="text-sm opacity-80">
          لا يوجد لديك اشعارات حاليا ⚡
        </span>
      )}
    </ul>
  );
};
const NotificationList = ({
  messages,
  receiver,
  notification,
  pageIndex,
  notificationIndex,
  setOpenNotifications,
}: INotificationListProps) => {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const { retrieveId, seen, sender, createdAt, type, youFollowing } =
    notification;
  const { username, avatar } = sender;
  const markAsReadedMutation = useMarkNotificationAsReadedMutation();
  useEffect(() => {
    window.document.body.addEventListener("click", handleCloseOptionMenu);
    return () =>
      window.document.body.removeEventListener("click", handleCloseOptionMenu);
  }, []);
  const handleCloseOptionMenu = (e: any) => {
    if (isOptionsMenuOpen) return;
    const targetParent = e.target.closest(
      `#option-container-${notification.retrieveId}`
    );
    if (!targetParent) setIsOptionsMenuOpen(false);
  };
  return (
    <li
      onClick={() => {
        seen &&
          markAsReadedMutation.mutate({
            retrieveId,
            pageIndex,
            notificationIndex,
          });
        setIsOptionsMenuOpen(false);
      }}
      className={`flex p-3 py-3 gap-2 rounded-md shadow-md cursor-pointer hover:bg-stone-50 ${
        isOptionsMenuOpen && "bg-stone-50"
      }`}
    >
      <div className="relative">
        {!notification.seen && (
          <div className="bg-yellow-400 size-2 rounded-[50%] absolute top-0 right-0"></div>
        )}
        <Link to={`/user/${username}`}>
          <UserAvatarIcon
            width={6}
            height={6}
            avatar={avatar}
            alt={`${username}'s Avatar`}
          />
        </Link>
      </div>
      <div className="flex justify-between items-center flex-grow">
        <div className="flex flex-col">
          <div>
            <Link
              to={`/user/${username}`}
              onClick={() => setOpenNotifications(false)}
            >
              <span className="font-bold hover:underline">{username} </span>
            </Link>
            <span>{messages.find(() => type === type)?.context}</span>
          </div>
          <span className="opacity-80 text-[.8rem] mt-2">
            قبل
            {dayjs(new Date()).diff(createdAt, "week")} اسبوع
          </span>
        </div>
        <div className="flex items-center gap-2">
          {notification.type === "follow" && (
            <FollowButton
              userId={sender._id}
              ownerId={receiver}
              isFollowingYou={true}
              youFollowing={!!youFollowing}
              className="text-[.78rem] px-[.85rem]"
            />
          )}
          <div id={`option-container-${retrieveId}`} className="relative">
            <button
              onClick={() => setIsOptionsMenuOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-stone-200"
            >
              <VerticalEllipsis width={4} height={4} />
            </button>
            <div
              className={`p-2 bg-stone-100 rounded-md shadow-md absolute bottom-[-2rem] left-[1rem] z-50 ${
                !isOptionsMenuOpen && "hidden"
              }`}
            >
              {seen ? (
                <span className="flex gap-2 px-1 min-w-[7rem] items-center justify-center  text-[.8rem] cursor-default">
                  تم قراءة الاشعار
                  <MarkAsReaded width={2} height={2} />
                </span>
              ) : (
                <button
                  onClick={() => {
                    markAsReadedMutation.mutate({
                      retrieveId,
                      pageIndex,
                      notificationIndex,
                    });
                    setIsOptionsMenuOpen(false);
                  }}
                  className="flex gap-2 px-1 min-w-[7rem] items-center justify-center  text-[.8rem]"
                >
                  <span>التعليم كمقروء</span>
                  <MarkAsReaded width={2} height={2} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
export default Notifications;
