import React from "react";
import { FaStar, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
const ReviewButton = () => {
  return (
    <div>
      <Link to={"/reviewPage"} target="_blank">
        <div
          id="marketing-banner"
          tabindex="-1"
          class="fixed z-50 flex flex-col  shadow-md border-x-[1px] rounded
           border-b-[1px] border-slate-300   h-[80px] w-[200px]  left-3    shadow-sm bottom-4 cursor-pointer   "
        >
          <div className="bg-green-400 h-[7px]"> </div>
          <div className="flex flex-col mt-3 ">
            <div class="flex items-center px-3 ">
              <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                SNSU Canteen
              </p>
            </div>

            <div className="px-3 flex items-center gap-2">
              <span className="flex items-center text-sm font-normal  dark:text-gray-400">
                {" "}
                Reviews{" "}
              </span>{" "}
              <div className="flex  gap-1 ">
                {" "}
                <FaStar className="text-yellow-400 " />{" "}
                <FaStar className="text-yellow-400 " />{" "}
                <FaStar className="text-yellow-400 " />{" "}
                <FaStar className="text-yellow-400 " />{" "}
                <FaStar className="text-yellow-400 " />{" "}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ReviewButton;
