import Header from "../../components/Header";
import { useGetFoodsMutation } from "../../features/foods/foodsApiSlice";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import { foodsFetched } from "../../features/foods/foodsSlice";
import { GiShoppingCart } from "react-icons/gi";
import { useSelector, useDispatch } from "react-redux";
const FoodItem = () => {
  const { foods } = useSelector((state) => state.foods);
  const { id } = useParams();
  const [food, setFood] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (foods.length === 0) {
      navigate("/");
    } else {
      const data = foods.filter((e) => e._id === id);
      console.log(data);
      console.log(data[0].food_name);

      if (data.length > 0) {
        setFood(data); // Set the first element of the filtered array as food
      } else {
        navigate("/"); // If no matching food item is found, navigate to the home page
      }
    }
  }, [id, foods]);
  if (!food) {
    return null; // Render nothing until the food data is available
  }
  return (
    <>
      <Header />
      <div className="mt-3 flex flex-col justify-center items-center mx-auto">
        <div className="bg-slate-500 p-2 text-center rounded cursor-pointer    text-white font-semibold">
          <Link to={"/"}>Back to List</Link>
        </div>
        <div>
          {food.map((e) => (
            <div className="flex    sm:w-[650px]    " key={e._id}>
              <div className="p-4 mx-auto">
                <div className="bg-white   border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <img
                    className="rounded-t-lg"
                    src={e.image_one}
                    alt=""
                    style={{
                      width: "100%", // Set the image width to 100% to fit the container
                      height: "280px", // Set a fixed height for the banner
                      objectFit: "cover", // Ensure the image covers the container
                    }}
                  />

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {e.food_name}
                        </h5>
                        <div className="block font-semibold text-slate-500">
                          ₱ {e.price}
                        </div>
                      </div>{" "}
                      <div className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                        Add to Cart <GiShoppingCart size={"2.0em"} />
                      </div>
                    </div>

                    <p className="  sm:w-[650px] mb-3 font-normal text-gray-700 dark:text-gray-400  ">
                      {e.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default FoodItem;
