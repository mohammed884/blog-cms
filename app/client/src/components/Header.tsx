import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  console.log(scrollY);

  return (
    <header
      className={`w-full h-[4.2rem] bg-off_white ${
        scrollY < 300 ? "border-b-0" : "border-b-[1px]"
      } border-b-gray-300 border-dark_green flex justify-center items-center fixed z-[1000]`}
    >
      <div className="w-[85%] flex justify-between items-center">
        <nav>
          <ul className="w-fit flex gap-6">
            <li className="text-[1.05rem] font-bold">
              <Link to="/auth/login"> سجل الدخول</Link>
            </li>
            <li className="text-[1.05rem] font-bold">
              <Link to="/auth/register">انضم الينا</Link>
            </li>
          </ul>
        </nav>
        <span className="w-[4.2rem] h-[4.2rem] scale-x-[-1]">
          <img
            src="../../public/images/logo.png"
            alt="blog logo"
            loading="lazy"
          />
        </span>
      </div>
    </header>
  );
};

export default Header;
