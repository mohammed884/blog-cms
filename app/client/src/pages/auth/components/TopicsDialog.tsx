import { forwardRef } from "react";
const TopicsSelectionStep = forwardRef<HTMLDialogElement, {}>((props, ref) => {
  console.log("load topics");
  
  return <dialog ref={ref}>TopicsSelectionStep</dialog>;
});

export default TopicsSelectionStep;
