import React from "react";
import Label from "../../components/headerAndSidebar/Label";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { foodsFetched } from "../../features/foods/foodsSlice";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import TimeAgo from "../../components/foods/TimeAgo";
import { removeFood } from "../../features/foods/foodsSlice";
import {
  useAddFoodMutation,
  useGetFoodsMutation,
  useDeleteFoodMutation,
  useUploadImageMutation,
} from "../../features/foods/foodsApiSlice";
// import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";

import LoadingSpinner from "../../components/LoadingSpinner";
import EditFoodForm from "../../components/foods/EditFoodForm";
import AddFoodForm from "../../components/foods/AddFoodForm";

const Foods = () => {
  const dispatch = useDispatch();

  const [getFoods, { isLoading: getFoodsLoading }] = useGetFoodsMutation();
  const [DeleteFood, { isLoading: deleteLoading }] = useDeleteFoodMutation();
  const { foods } = useSelector((state) => state.foods);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFoodId, setEditFoodId] = useState("");

  //   const { food_name, price, description } = formData;
  const onClickShowForm = () => {
    setShowAddForm((prev) => !prev);
  };

  const onClickDelete = async (foodId) => {
    try {
      await DeleteFood({ foodId }).unwrap();

      toast.success("Delete Successfully", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(removeFood({ foodId }));
    } catch (error) {
      toast.error(error?.data?.message, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const onClickEdit = (foodId) => {
    setShowEditForm(true);
    setEditFoodId(foodId);
  };
  const handleHideEditForm = (val) => {
    setShowEditForm((prev) => !prev); //the val here is false
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFoods().unwrap();

        dispatch(foodsFetched(res));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const hideAddForm = () => setShowAddForm((prev) => !prev);
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

  const orderedFoods = foods
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const renderedFoods = orderedFoods?.map((food) => (
    <article key={food._id} className="my-4">
      <div className=" relative z-0 w-[300px] p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700   ">
        <div className="flex justify-between   items-center gap-1  ">
          <div className="flex items-center">
            <div onClick={() => onClickDelete(food._id)}>
              <FaTrash
                className="text-slate-700  hover:bg-slate-300 p-1 rounded cursor-pointer"
                size={"1.5em"}
              />
            </div>
            <div onClick={() => onClickEdit(food._id)}>
              <FaEdit
                className="text-slate-700 hover:bg-slate-300 p-1 rounded cursor-pointer"
                size={"1.7em"}
              />
            </div>
          </div>
        </div>
        <div className="  ">
          <div className="md:flex-shrink-0">
            <img
              draggable="false"
              className="h-48  select-none w-full object-cover  "
              src={food.image_one}
              alt="Food Item"
            />
          </div>
          <div className="py-2 px-2 w-full ">
            <div>
              <small className="text-slate-500"> Published: </small>{" "}
              <TimeAgo timestamp={food.createdAt} />
              {food.createdAt !== food.updatedAt && (
                <span className="block mt-[-10px]">
                  <small className="text-slate-500"> last update: </small>{" "}
                  <TimeAgo timestamp={food.updatedAt} />
                </span>
              )}
            </div>
            <div className=" leading-none mb-0 uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {food.food_name}
            </div>
            <div className="mt-2 text-gray-900 w-44  leading-none">
              {food.price} pesos
            </div>

            <p className="mt-2 h-[50px] text-gray-500 w-full leading-normal ">
              {truncateText(food.description, maxCharacters)}
            </p>
          </div>
        </div>
      </div>
    </article>
  ));
  return (
    <div>
      {showEditForm && (
        <EditFoodForm
          handleHideEditForm={handleHideEditForm}
          editFoodId={editFoodId}
        />
      )}

      {deleteLoading && <LoadingSpinner />}
      <Label>Foods</Label>
      <div className="flex justify-end my-2">
        {showAddForm ? (
          <div
            onClick={onClickShowForm}
            className=" bg-slate-500 flex text-white  cursor-pointer hover:bg-slate-600 items-center gap-2 rounded p-1 "
          >
            Cancel
          </div>
        ) : (
          <div
            onClick={onClickShowForm}
            className=" bg-orange-500 flex text-white cursor-pointer hover:bg-orange-600 items-center gap-2 rounded p-1 "
          >
            {" "}
            <FaPlus /> Add Food{" "}
          </div>
        )}
      </div>
      {showAddForm && <AddFoodForm hideAddForm={hideAddForm} />}
      <div className="flex justify-start flex-wrap bg-orange-300 w-full p-5 gap-2">
        {renderedFoods}
      </div>
    </div>
  );
};

export default Foods;
