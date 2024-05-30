import { useState, useEffect, Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "./Loader";
import { BellIcon, FeatherIcon, PinNib, UserIcon } from "./Icons";
import { XIcon } from "lucide-react";
import {
  getUnSeenNotificationsQuery,
  getUserQuery,
} from "../services/queries/user";
const Notifications = lazy(() => import("./Notifications"));
const Header = () => {
  const location = useLocation();
  const userData = getUserQuery("profile");
  const unSeenNotificationsData = getUnSeenNotificationsQuery(
    !!userData?.data?.isLoggedIn
  );
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };
  useEffect(() => {
    window.document.body.addEventListener("click", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  if (!userData) return <Loader />;
  const user = userData?.data?.user;
  const [scrollY, setScrollY] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);
  return (
    <header
      className={`w-full h-[4.2rem] bg-off_white ${
        scrollY < 300 && !user?.username ? "border-0" : "border-b-[1px]"
      } border-b-gray-300 border-dark_green flex justify-center items-center fixed z-[1000]`}
    >
      <div className="w-[85%] flex justify-between items-center">
        <nav>
          <ul
            id="links-list"
            className={`w-fit flex justify-center items-center ${
              user?.username ? "gap-8" : "gap-6"
            }`}
          >
            {user?.username ? (
              <>
                <li>
                  <Link to={`/user/${user?.username?.replace(/ /g, "-")}`}>
                    <UserIcon width={6} height={6} />
                  </Link>
                </li>
                <li className="relative">
                  <span className="w-5 h-5 text-sm font-bold border border-black bg-red-500 absolute text-center rounded-[50%] left-2 z-10">
                    {!unSeenNotificationsData.isLoading &&
                      unSeenNotificationsData.data?.count}
                  </span>

                  <button
                    type="button"
                    onClick={() => setOpenNotifications((prev) => !prev)}
                    className="h-fit pt-[.6rem] hover:rotate-[10deg] transition-transform ease-linear"
                  >
                    <BellIcon width={6} height={6} />
                  </button>
                  <div
                    className={`w-[35vw] h-[40vh] ${
                      openNotifications
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    } overflow-y-auto bg-off_white p-4 rounded-md shadow-md absolute right-2 overflow-hidden transition-opacity ease-linear`}
                  >
                    <div className="w-[95%] flex justify-between mx-auto pb-3">
                      <span className="text-[1.2rem] font-black">
                        جميع الاشعارات
                      </span>
                      <button
                        onClick={() => setOpenNotifications((prev) => !prev)}
                        className="text-sm font-bold"
                      >
                        <XIcon size={18} />
                      </button>
                    </div>
                    {openNotifications && (
                      <Suspense fallback={<div className="">...Loading</div>}>
                        <Notifications
                          setOpenNotifications={setOpenNotifications}
                        />
                      </Suspense>
                    )}
                  </div>
                </li>
                <li
                  className={`${
                    location.pathname === "/article/publish"
                      ? "opacity-0"
                      : "opacity-100"
                  } mt-1 transition-opacity ease-in-out`}
                >
                  <Link to="/article/publish">
                    <div className="p-2 bg-[#606c3866] hover:bg-[#545f3098] px-5 rounded-md">
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
          <div className={`${!user?.username && "hidden"}`}>
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
