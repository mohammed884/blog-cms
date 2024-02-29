import { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
  useGetUnSeenNotificationsQuery,
  userProfileSelector,
} from "../store/services/user";
import { BellIcon, FeatherIcon, PinNib, UserIcon } from "./Icons";
const Notifications = lazy(() => import("./Notifications"));
const Header = () => {
  const user: any = useAppSelector(userProfileSelector);
  const {
    data: unSeenNotifications,
    isLoading,
    isError,
    error,
  } = useGetUnSeenNotificationsQuery({}, { skip: !user.isSuccess });
  const [scrollY, setScrollY] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [username, setUsername] = useState("");
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };
  useEffect(() => {
    if (user?.isSuccess) {
      setUsername(user.data.user.username);
    }
  }, [user.isSuccess]);
  useEffect(() => {
    window.document.body.addEventListener("click", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  console.log("Notifications count", unSeenNotifications);
  return (
    <header
      className={`w-full h-[4.2rem] bg-off_white ${
        scrollY < 300 && !username ? "border-0" : "border-b-[1px]"
      } border-b-gray-300 border-dark_green flex justify-center items-center fixed z-[1000]`}
    >
      <div className="w-[85%] flex justify-between items-center">
        <nav>
          <ul
            id="links-list"
            className={`w-fit flex justify-center items-center ${
              username ? "gap-8" : "gap-6"
            }`}
          >
            {username ? (
              <>
                <li>
                  <Link to={`/user/${username?.replace(/ /g, "-")}`}>
                    {/* user profile */}
                    <UserIcon width={6} height={6} />
                  </Link>
                </li>
                <li className="relative">
                  {!isLoading && unSeenNotifications?.success && (
                    <span className="w-5 h-5 text-sm font-bold border border-black bg-red-500 absolute text-center rounded-[50%] left-2 z-10">
                      {unSeenNotifications?.count}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenNotifications((prev) => !prev)}
                    className="h-fit pt-[.6rem] hover:rotate-[10deg] transition-transform ease-linear"
                  >
                    <BellIcon width={6} height={6} />
                    {/* bell icon */}
                  </button>
                  <div
                    className={`w-[35vw] ${
                      openNotifications
                        ? "h-[40vh] p-3 pt-5 border"
                        : "h-0 p-0 pt-0 border-0"
                    } bg-off_white rounded-md shadow-md absolute right-2 overflow-hidden transition-all ease-linear`}
                  >
                    {openNotifications && (
                      <Suspense
                        fallback={
                          <div className="w-full h-full bg-gray-50 animate-pulse">
                            ...Loading
                          </div>
                        }
                      >
                        <Notifications
                          setOpenNotifications={setOpenNotifications}
                        />
                      </Suspense>
                    )}
                  </div>
                </li>
                <li className="mt-1">
                  <Link to="/article/publish">
                    <div
                      style={{ background: "rgba(96, 108, 56, .4)" }}
                      className="p-2 px-5 rounded-md"
                    >
                      <PinNib width={4} height={4} />
                    </div>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="font-bold">
                  <Link to="/auth/login"> سجل الدخول</Link>
                </li>
                <li className="text-[1.05rem] font-bold">
                  <Link to="/auth/register">انضم الينا</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="w-fit flex justify-between items-center gap-8">
          <div className={`${!username && "hidden"}`}>
            <input
              type="search"
              className="bg-[#f9f9f9] w-[16vw] border text-sm p-[.4rem] px-3 rounded-2xl"
              placeholder="ابحث..."
            />
          </div>
          <span className="w-[1.5rem] h-[1.5rem]">
            <Link to="/">
              <FeatherIcon />
            </Link>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
