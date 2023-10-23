import Header from "../../components/Header";
import { useGetFoodsMutation } from "../../features/foods/foodsApiSlice";
import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { foodsFetched } from "../../features/foods/foodsSlice";
import MiniLoading from "../../components/MiniLoading";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAddFoodToCartMutation } from "../../features/carts/cartsApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

const Food_list = () => {
  const [addtoCart, { isLoading: addtoCartLoading }] =
    useAddFoodToCartMutation();

  const { foods } = useSelector((state) => state.foods);
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
  return (
    <>
      <Header />
      {addtoCartLoading && <LoadingSpinner />}
      {getFoodsLoading ? (
        <div className="mt-5">
          <MiniLoading />
        </div>
      ) : (
        <div className="flex justify-center   flex-wrap w-full p-5 gap-2 bg-orange-200  ">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white hover:bg-slate-100 w-[300px]  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  "
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
      )}
    </>
  );
};
export default Food_list;
