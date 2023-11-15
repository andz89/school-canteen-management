import Header from "../../components/Header";
import { useGetFoodsMutation } from "../../features/foods/foodsApiSlice";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAddFoodToCartMutation } from "../../features/carts/cartsApiSlice";

import { foodsFetched } from "../../features/foods/foodsSlice";
import { GiShoppingCart } from "react-icons/gi";
import { useSelector, useDispatch } from "react-redux";
const FoodItem = () => {
  const [addtoCart, { isLoading: addtoCartLoading }] =
    useAddFoodToCartMutation();
  const { foods } = useSelector((state) => state.foods);
  const { id } = useParams();
  const [food, setFood] = useState();
  const addFoodToCartFunc = async (data) => {
    const foodData = {
      food_id: data[0]._id,
      food_name: data[0].food_name,
      price: data[0].price,
      description: data[0].description,
      quantity: 1,
      orig_price: data[0].price,
      image_one: removeDomainFromURL(data[0].image_one),
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
      <div className="bg-slate-500  p-2        text-white font-semibold">
        <Link className="cursor-pointe hover:underline" to={"/"}>
          Back to List
        </Link>
      </div>
      <div className="mt-3 flex flex-col justify-center items-center mx-auto">
        <div>
          {food.map((e) => (
            <div className="flex    sm:w-[650px]    " key={e._id}>
              <div className="p-4 mx-auto">
                <div className="bg-green-100   border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
                      {e.quantity !== 0 ? (
                        <div
                          onClick={() => addFoodToCartFunc(food)}
                          className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                        >
                          Add to Cart <GiShoppingCart size={"2.0em"} />
                        </div>
                      ) : (
                        <div className=" inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 cursor-not-allowed">
                          Not Available Today
                        </div>
                      )}
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
