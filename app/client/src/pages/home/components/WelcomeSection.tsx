import { useEffect, useRef } from "react";
const WelcomeSection = ({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) => {
  const startReadingBtnRef = useRef<HTMLButtonElement | null>(null);
  const startReadingBtnListener = () => {
    document.body.style.overflowY = "hidden";
    dialogRef?.current?.showModal();
  };  
  useEffect(() => {
    startReadingBtnRef.current?.addEventListener(
      "click",
      startReadingBtnListener
    );
    return () => {
      startReadingBtnRef.current?.removeEventListener(
        "click",
        startReadingBtnListener
      );
    };
  }, []);
  return (
    <section className="w-full xl:h-[70vh] landscape:lg:h-[80vh] landscape:md:h-[110vh] sm:h-[60vh] flex justify-center items-center bg-light_beige">
      <div className="xl:w-[80%] sm:w-[88%] flex justify-between items-center">
        <div className="lg:h-[30vh] landscape:md:h-[32vh] landscape:sm:h-[60vh] sm:h-[30vh] flex flex-col landscape:md:justify-between sm:justify-around text-right">
          <div className="lg:w-fit md:mt-4 sm:w-[100%]">
            <h1 className="md:text-5xl sm:text-4xl font-black mb-7">
              اشبع فضولك.
            </h1>
            <p className="md:text-xl sm:text-lg font-bold break-word">
              تسلم الدفة و ابحر في عالم من الخبرات والقصص المثيرة
              <br className="md:inline sm:hidden" /> في مختلف المجالات
            </p>
          </div>
          <div>
            <button
              ref={startReadingBtnRef}
              type="button"
              className="bg-dark_green hover:scale-95 transition-transform ease landscape:xl:text-md landscape:lg:text-md text-off_white font-bold py-3 px-4 rounded"
            >
              ابدء بالقراءة
            </button>
          </div>
        </div>
        <span className="landscape:xl:w-[11vw] landscape:xl:h-[11vh] lg:w-[12vw] lg:h-[12vh] landscape:md:w-[16vh] landscape:md:h-[16vh] sm:hidden lg:inline">
          <img src="../../public/images/books.png" alt="book image" />
        </span>
      </div>
    </section>
  );
};

export default WelcomeSection;
