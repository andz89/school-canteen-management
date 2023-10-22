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

      <div className="flex justify-end  p-2 font-semibold   sticky top-0 z-10">
        <div className="bg-orange-700 cursor-pointer mr-3 p-2 rounded text-white">
          Check out
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {carts.map((food) => (
              <tr
                key={food.food_id}
                className="bg-white flex  flex-col justify-around sm:flex-row items-center w-full border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <input
                      id={food.food_id}
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded   dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      forhtml={food.food_id}
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Select
                    </label>
                  </div>
                </td>
                <td className="w-32 p-4">
                  <img
                    src={food.image_one}
                    alt="Apple Watch"
                    style={{
                      width: "100px", // Set the image width to 100% to fit the container
                      height: "100px", // Set a fixed height for the banner
                      objectFit: "cover", // Ensure the image covers the container
                    }}
                  />
                </td>
                <td className="px-6 py-4 w-32 font-semibold text-gray-900 dark:text-white">
                  {food.food_name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button
                      className="inline-flex items-center justify-center p-1 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      type="button"
                    >
                      <span className="sr-only">Quantity button</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 2"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 1h16"
                        />
                      </svg>
                    </button>
                    <div>
                      <input
                        type="number"
                        id="first_product"
                        className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="1"
                        required
                      />
                    </div>
                    <button
                      className="inline-flex items-center justify-center h-6 w-6 p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      type="button"
                    >
                      <span className="sr-only">Quantity button</span>
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 1v16M1 9h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  ₱ {food.price}
                </td>
                <td className="px-6 py-4">
                  <span
                    onClick={() => onDelete(food._id)}
                    className="font-medium text-slate-700 hover:bg-slate-700 hover:text-gray-100 cursor-pointer flex w-[100px] px-1 py-2 items-center justify-center   rounded"
                  >
                    Remove <FaTrash className="ml-2" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Food_list;
