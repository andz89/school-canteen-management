import { useState } from "react";

import { FaPlus } from "react-icons/fa";
import { postAdded } from "../../features/posts/postsSlice";
import { useAddPostMutation } from "../../features/posts/postsApiSlice";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

const AddPostForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const name = userInfo.data.user.name;
  const agency = userInfo.data.user.agency;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [form, setForm] = useState(false);
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const dispatch = useDispatch();
  const [addPost, { isLoading }] = useAddPostMutation();

  const onSavePostClicked = async (e) => {
    e.preventDefault();
    let dataStamp = new Date().toISOString();
    if (title && content) {
      try {
        const res = await addPost({
          title,
          content,
          name,
          agency,
          dateCreated: dataStamp,
          dateUpdated: dataStamp,
        }).unwrap();

        const data = {
          title,
          content,
          name,
          agency,
          _id: res.posts._id,
          dateCreated: res.posts.dateCreated,
          dateUpdated: res.posts.dateUpdated,
        };

        dispatch(postAdded(data));
        setForm(false);
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
        setTitle("");
        setContent("");
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

  const canSave = Boolean(title) && Boolean(content);
  const handleShowForm = () => {
    setForm((prev) => !prev);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex justify-end m-5">
        <div
          className={
            form
              ? "bg-rose-500 font-semibold  p-2 text-white rounded flex items-center gap-2 cursor-pointer"
              : "bg-teal-700 font-semibold  p-2 text-white rounded flex items-center gap-2 cursor-pointer"
          }
          onClick={handleShowForm}
        >
          {form ? (
            "Cancel Post"
          ) : (
            <div className="flex items-center gap-2  ">
              <FaPlus /> Add Post{" "}
            </div>
          )}
        </div>
      </div>
      {form && (
        <section className=" min-w-[300px] max-w-[600px] flex flex-col bg-white justify-center p-2 mx-auto rounded my-5">
          <form className="flex flex-col bg-white justify-center p-2">
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Post Title:
              </label>
              <input
                type="text"
                id="first_name"
                className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Big Event this coming 2023"
                required
                name="postTitle"
                value={title}
                onChange={onTitleChanged}
              />
            </div>

            <label
              htmlFor="message"
              className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Post Content:
            </label>
            <textarea
              rows="4"
              className="block p-2.5 w-full text-sm outline-none text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your thoughts here..."
              name="postContent"
              value={content}
              onChange={onContentChanged}
            ></textarea>

            <button
              type="button"
              className={
                canSave
                  ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium  my-5 rounded-lg text-sm px-5 py-2.5     dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
                  : "text-gray-400 bg-gray-700   focus:ring-4 focus:ring-blue-300 font-medium my-5 rounded-lg text-sm px-5 py-2.5     dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 cursor-not-allowed"
              }
              onClick={onSavePostClicked}
              disabled={!canSave}
            >
              Publish
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default AddPostForm;
