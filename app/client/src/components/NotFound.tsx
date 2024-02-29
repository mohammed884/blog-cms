import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold text-[#1A2238] tracking-widest">
        404
      </h1>
      <div className="bg-white border-2 border-dark_green border-dashed py-2 px-2 text-sm rounded-md rotate-[-12deg] absolute">
        هذا البيج غير موجود
      </div>
      <button className="mt-5">
        <a className="relative inline-block text-sm font-medium text-dark_green group active:text-dark_green focus:outline-none focus:ring">
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-dark_green group-hover:translate-y-0 group-hover:translate-x-0 rounded"></span>

          <span className="relative block px-8 py-3 text-off_white bg-[#1A2238] border border-current rounded">
            <Link to="/">رجوع</Link>
          </span>
        </a>
      </button>
    </main>
  );
};

export default NotFound;
