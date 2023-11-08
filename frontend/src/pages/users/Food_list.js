import Header from "../../components/Header";
import { useGetFoodsMutation } from "../../features/foods/foodsApiSlice";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { GiShoppingCart } from "react-icons/gi";
import {
  MdOutlineNoMeals,
  MdOutlineFastfood,
  MdOutlineEmojiFoodBeverage,
} from "react-icons/md";

import { foodsFetched } from "../../features/foods/foodsSlice";
import MiniLoading from "../../components/MiniLoading";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAddFoodToCartMutation } from "../../features/carts/cartsApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ReviewButton from "../../components/ReviewButton";

const Food_list = () => {
  const [category, setCategory] = useState("meals");
  const [addtoCart, { isLoading: addtoCartLoading }] =
    useAddFoodToCartMutation();

  const { foods } = useSelector((state) => state.foods);
  const categorized_foods = foods.filter((food) => food.category === category);
  const dispatch = useDispatch();
  const [getFoods, { isLoading: getFoodsLoading }] = useGetFoodsMutation();
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
  const addFoodToCartFunc = async (data) => {
    const foodData = {
      food_name: data.food_name,
      price: data.price,
      description: data.description,
      food_id: data._id,
      quantity: 1,
      orig_price: data.price,
      image_one: removeDomainFromURL(data.image_one),
    };

    try {
      await addtoCart(foodData).unwrap();
      toast.success("Added to cart Successfully", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error(error?.data?.message, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };
  function removeDomainFromURL(url) {
    const parsedURL = new URL(url);

    const pathAndQuery = `${parsedURL.pathname}${parsedURL.search}${parsedURL.hash}`;
    return pathAndQuery;
  }
  const changeCategory = (category) => {
    setCategory(category);
  };
  return (
    <>
      <ReviewButton />
      <Header />
      {addtoCartLoading && <LoadingSpinner />}
      {getFoodsLoading ? (
        <div className="mt-5">
          <MiniLoading />
        </div>
      ) : (
        <>
          <div className=" border-b border-gray-200 dark:border-gray-700 w-full flex justify-center">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              <li className="gap-1 flex  mx-5 items-center justify-center">
                <MdOutlineNoMeals size={"1.2rem"} />
                <Link
                  id="meals"
                  onClick={(e) => changeCategory(e.target.id)}
                  className={`${
                    category === "meals" && "text-green-600 border-green-700"
                  }   py-4   border-b-2  rounded-t-lg  hover:text-green-600`}
                >
                  Meals
                </Link>
              </li>
              <li className="gap-1 flex  mx-5 items-center justify-center">
                <MdOutlineFastfood size={"1.2rem"} />
                <Link
                  id="snacks"
                  onClick={(e) => changeCategory(e.target.id)}
                  className={`${
                    category === "snacks" && "text-green-600 border-green-700"
                  }   py-4   border-b-2  rounded-t-lg  hover:text-green-600`}
                >
                  Snacks
                </Link>
              </li>
              <li className="gap-1   flex  mx-5 items-center justify-center ">
                <MdOutlineEmojiFoodBeverage size={"1.2rem"} />
                <Link
                  id="drinks"
                  onClick={(e) => changeCategory(e.target.id)}
                  className={`${
                    category === "drinks" && "text-green-600 border-green-700"
                  }   py-4   border-b-2  rounded-t-lg  hover:text-green-600`}
                >
                  Drinks
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex justify-center   flex-wrap w-full p-5 gap-2  ">
            {categorized_foods.map((food) => (
              <div
                key={food._id}
                className="bg-green-100  hover:bg-slate-100 w-[300px]  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  "
              >
                <Link to={"/foodItem/" + food._id}>
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
                  <div
                    onClick={() => addFoodToCartFunc(food)}
                    className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                  >
                    Add to Cart <GiShoppingCart size={"2.0em"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
export default Food_list;
