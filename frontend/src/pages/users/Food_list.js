import Header from "../../components/Header";
import { useGetFoodsMutation } from "../../features/foods/foodsApiSlice";
import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { foodsFetched } from "../../features/foods/foodsSlice";

import { useSelector, useDispatch } from "react-redux";
const Food_list = () => {
  const { foods } = useSelector((state) => state.foods);

  const dispatch = useDispatch();
  const [getFoods, { isLoading: getStoresLoading }] = useGetFoodsMutation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFoods().unwrap();

        dispatch(foodsFetched(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const maxCharacters = 45; // Set your desired maximum character length

  // Call the truncateText function to limit the text to the specified number of characters
  const truncateText = (text, maxLength) => {
    // If the text length is greater than the maxLength, truncate it
    if (text.length > maxLength) {
      const truncatedText = text.slice(0, maxLength);
      return `${truncatedText}...`;
    }

    // If the text length is less than or equal to the maxLength, return the original text
    return text;
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-start flex-wrap w-full p-5 gap-4">
        {foods.map((food) => (
          <div className="bg-white hover:bg-slate-100 w-[300px]  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Link key={food._id} to={"/foodItem/" + food._id}>
              <img
                className="rounded-t-lg"
                src={food.image_one}
                alt=""
                style={{
                  width: "100%", // Set the image width to 100% to fit the container
                  height: "200px", // Set a fixed height for the banner
                  objectFit: "cover", // Ensure the image covers the container
                }}
              />
            </Link>
            <div className="p-5">
              <Link key={food._id} to={"/foodItem/" + food._id}>
                <h5 className="  text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {food.food_name}
                </h5>
                <div className="block font-semibold text-slate-500">
                  ₱ {food.price}
                </div>
                <p className=" h-[50px] mb-3 font-normal text-gray-700 dark:text-gray-400  ">
                  {truncateText(food.description, maxCharacters)}
                </p>
              </Link>
              <div className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                Add to Cart <GiShoppingCart size={"2.0em"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Food_list;
