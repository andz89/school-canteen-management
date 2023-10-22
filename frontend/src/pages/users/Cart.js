import Header from "../../components/Header";
import { useGetFoodsMutation } from "../../features/foods/foodsApiSlice";
import React from "react";

import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { cartsFetched, removeCart } from "../../features/carts/cartsSlice";

import {
  useGetCartMutation,
  useDeleteFoodFromCartMutation,
} from "../../features/carts/cartsApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

const Food_list = () => {
  const [getCart, { isLoading }] = useGetCartMutation();
  const [deleteFoodFromCart, { isLoading: deleteLoading }] =
    useDeleteFoodFromCartMutation();
  const { carts } = useSelector((state) => state.carts);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCart().unwrap();

        dispatch(cartsFetched(data));
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
  const onDelete = async (cartId) => {
    try {
      await deleteFoodFromCart({ cartId }).unwrap();
      dispatch(removeCart({ cartId }));
      toast.success("Delete Successfully", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <>
      {deleteLoading && <LoadingSpinner />}
      <Header />
      <div className="flex justify-center p-2 font-semibold text-2xl bg-orange-200 ">
        Your Cart
      </div>
      <div className="flex justify-center   flex-wrap w-full p-5 gap-2 bg-orange-200  ">
        {carts.map((food) => (
          <div
            key={food._id}
            className="bg-white hover:bg-slate-100 w-[300px]  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  "
          >
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

            <div className="p-5">
              <h5 className="  text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {food.food_name}
              </h5>
              <div className="block font-semibold text-slate-500">
                ₱ {food.price}
              </div>
              <p className=" h-[50px] mb-3 font-normal text-gray-700 dark:text-gray-400  ">
                {truncateText(food.description, maxCharacters)}
              </p>
              <div className="flex gap-2">
                {" "}
                <div className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                  <div className="flex items-center">
                    <input
                      id={food._id}
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={food._id}
                      className="ml-2 text-sm font-medium"
                    >
                      Select
                    </label>
                  </div>
                </div>
                <div
                  onClick={() => onDelete(food._id)}
                  className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                >
                  Remove <FaTrash className="ml-2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Food_list;
