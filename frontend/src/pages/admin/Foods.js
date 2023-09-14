import React from "react";
import Label from "../../components/headerAndSidebar/Label";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { foodAdded } from "../../features/foods/foodsSlice";
import { foodsFetched } from "../../features/foods/foodsSlice";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import TimeAgo from "../../components/foods/TimeAgo";
import { removeFood } from "../../features/foods/foodsSlice";
import {
  useAddFoodMutation,
  useGetFoodsMutation,
  useDeleteFoodMutation,
  useUploadImageMutation
} from "../../features/foods/foodsApiSlice";
// import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
 
import LoadingSpinner from "../../components/LoadingSpinner";


const Foods = () => {
  const imageMapping = {
 
  };
  const dispatch = useDispatch();
  const [addFood, { isLoading: addFoodLading }] = useAddFoodMutation();
  const [getFoods, { isLoading: getFoodsLoading }] = useGetFoodsMutation();
  const [DeleteFood, {isLoading: deleteLoading}] = useDeleteFoodMutation();
  const { foods } = useSelector((state) => state.foods);
  const [showAddForm, setShowAddForm] = useState(false);
  const [foodData, setFormData] = useState({
    food_name: "",
    price: "",
    description: "",
    image_one: "",
    image_two:""
  });
  //   const { food_name, price, description } = formData;
  const onClickShowForm = () => {
    setShowAddForm((prev) => !prev);
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onClickSubmit = async (e) => {
    if (foodData.food_name && foodData.price) {
      const formData = new FormData();
      const image_one = foodData.image_one
      const image_two= foodData.image_two


      const food_name = foodData.food_name
      const price = foodData.price
      const description = foodData.description

       formData.append('image_one',image_one);
       formData.append('image_two',image_two);

       formData.append('food_name',food_name);
       formData.append('price',price);
       formData.append('description',description);

   

 
 
      try {
        const dataFromServer = await addFood(formData).unwrap();
       
        const data = {
          food_name: dataFromServer.food.food_name,
          price: dataFromServer.food.price,
          description: dataFromServer.food.description,
          _id: dataFromServer.food._id,
          dateCreated: dataFromServer.food.dateCreated,
          dateUpdated: dataFromServer.food.dateUpdated,
        };

        dispatch(foodAdded(data));
        setShowAddForm((prev) => !prev);
        toast.success("Publish Successfuly", {
          position: "top-left",
          autoClose: 5000,
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
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };
const onClickDelete = async (foodId)=>{
  try {
    await DeleteFood({foodId}).unwrap();
 
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
    dispatch(removeFood({foodId}))
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

}
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFoods().unwrap();
        console.log(res);
        dispatch(foodsFetched(res));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  
 
  const [image, setImage] = useState(null);
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const handleImageChange = (e) => {
 
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.files[0],
    }));
    
  };
 
  const handleUpload = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        await uploadImage(formData).unwrap();
        // Handle success, e.g., show a success message
      } catch (error) {
        // Handle error, e.g., show an error message
      }
    }
  };
  const orderedFoods = foods
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const renderedFoods = orderedFoods?.map((food) => (
    <article key={food._id} className="my-4">
      <div className="select-none relative z-0 w-full   p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700   ">
      <div className="flex justify-end w-full items-center gap-1  ">
          <div onClick={()=>onClickDelete(food._id)}><FaTrash className="text-slate-700  hover:bg-slate-300 p-1 rounded cursor-pointer" size={"1.5em"}/></div>
          <div><FaEdit  className="text-slate-700 hover:bg-slate-300 p-1 rounded cursor-pointer" size={"1.7em"}/></div>

        </div>
        <div className="md:flex items-center">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src={`http://localhost:3000/images/${food.image_one}`}
              alt="Food Item"
            />
          </div>
          <div className="py-2 px-5 w-full">
            <div className=" mb-0 uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {food.food_name}
            </div>
            <div className="mt-2 text-gray-900 w-44 ">{food.price} pesos</div>
            <div>
              <small className="text-slate-500"> Published: </small>{" "}
              <TimeAgo timestamp={food.createdAt} />
              {food.createdAt !== food.updatedAt && (
                <span>
                  ;<small className="text-slate-500"> last update: </small>{" "}
                  <TimeAgo timestamp={food.updatedAt} />
                </span>
              )}
            </div>
            <p className="mt-2 text-gray-500 w-full">{food.description}</p>
     
          </div>
        </div>
       
      </div>
    </article>
  ));
  return (
    <div>
      {addFoodLading && <LoadingSpinner/>}
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
      {showAddForm && (
        <form className="my-5">
          <div className="relative z-0 w-full mb-6 group">
            <input
              onChange={onChange}
              type="text"
              name="food_name"
              id="food_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="food_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Food Name
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              onChange={onChange}
              type="Number"
              name="price"
              id="Price"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="Price"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Price
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
          <input type="file" accept="image/*" name="image_one" onChange={handleImageChange} />
          <input type="file" accept="image/*" name="image_two" onChange={handleImageChange} />

          </div>
     
          <div className="relative z-0 w-full mb-6 group">
            <label
              htmlFor="Description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Food Description
            </label>
            <textarea
              onChange={onChange}
              name="description"
              id="Description"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:focus:ring-blue-500 focus:outline-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your thoughts here..."
            ></textarea>
          </div>

          <button
            onClick={onClickSubmit}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      )}

      {renderedFoods}
    </div>
  );
};

export default Foods;
