import React from "react";
interface IProps {
  type: "error" | "alert" | "success";
  show: boolean;
}
export const Message = () => {
  return (
    <div className="w-[90%] h-fit flex items-center gap-2 bg-yellow-50 text-md font-medium rounded-md mx-auto mt-4">
      <div className="py-2 w-2 h-full rounded-r-md bg-yellow-400 text-yellow-400">
        0
      </div>
      <div className="flex items-center gap-[.35rem] text-[.9rem]">
        <span>
          تنبيه ! الرجاء تاكيد الحساب لاستخدام كامل الميزات المتاحة في المنصة
        </span>
        {/* <AlertIcon width={4} height={4} /> */}
      </div>
    </div>
  );
};
