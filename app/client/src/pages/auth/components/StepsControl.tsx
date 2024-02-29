import React from "react";
interface IStepsIndicator {
  totalSteps: number;
  currentIndex: number;
  byStep: (step: number) => void;
}
interface IMenuButtons {
  isFirstStep: boolean;
  isLastStep: boolean;
  handleSubmit: (e: any) => Promise<void>;
  next: () => void;
  previous: () => void;
}
const StepsIndicator = ({
  totalSteps,
  currentIndex,
  byStep,
}: IStepsIndicator) => {
  const stepsArray = new Array(totalSteps).fill(0);
  return (
    <div className="w-[70%] flex gap-2 justify-center items-center">
      {stepsArray.map((_, index) => {
        return (
          <React.Fragment key={index}>
            <div
              itemType="button"
              onClick={() => byStep(index)}
              className={`
          w-6 h-6 flex justify-center items-center text-sm text-black text-center font-bold transition-colors ease-linear border pt-[.19rem] rounded-[50%] cursor-pointer
          ${index <= currentIndex ? "border-light_green" : "border-gray-300"}`}
            >
              <span>{index + 1}</span>
            </div>
            <div
              className={`w-14 h-[.15rem] transition-colors ease-linear rounded-md ${
                index >= currentIndex ? "bg-gray-200" : "bg-dark_green"
              } ${index === totalSteps - 1 && "hidden"}`}
            ></div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
const MenuButtons = ({
  isFirstStep,
  isLastStep,
  handleSubmit,
  next,
  previous,
}: IMenuButtons) => {
  const btnStyles =
    "font-bold p-3 md:px-10 sm:px-5 md:text-sm sm:text-[.8rem] rounded-md";
  return (
    <div className="w-[100%] flex justify-between mx-auto mt-4">
      {!isLastStep ? (
        <button
          aria-label="next button"
          type="button"
          onClick={() => next()}
          className={`${isLastStep && "hidden"} ${
            isFirstStep && "w-[100%]"
          } ${btnStyles} bg-black text-off_white`}
        >
          التالي
        </button>
      ) : (
        <button
          aria-label="create account"
          type="button"
          onClick={handleSubmit}
          className={`${btnStyles} text-off_white bg-black`}
        >
          انشاء الحساب
        </button>
      )}
      <button
        aria-label="previous button"
        type="button"
        onClick={() => previous()}
        className={`${isFirstStep && "hidden"} ${btnStyles} border-2`}
      >
        رجوع
      </button>
    </div>
  );
};
export { StepsIndicator, MenuButtons };
