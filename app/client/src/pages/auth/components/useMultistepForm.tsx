import { useState, ReactElement } from "react";
interface IReturnValues {
  step: ReactElement;
  currentIndex: number;
  next: () => void;
  previous: () => void;
  byStep: (step: number) => void;
}
export default function useMultistepForm(
  steps: Array<ReactElement>
): IReturnValues {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (): void => {
    if (currentIndex >= steps.length - 1) return;
    setCurrentIndex((prev) => prev + 1);
  };
  const previous = () => {
    if (currentIndex <= 0) return 0;
    setCurrentIndex((prev) => prev - 1);
  };
  const byStep = (step: number): void => {
    if (currentIndex < 0 || step > steps.length - 1) return;
    setCurrentIndex(step);
  };
  return {
    step: steps[currentIndex],
    currentIndex: currentIndex,
    next,
    previous,
    byStep,
  };
}
