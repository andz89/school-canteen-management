import { useState,useEffect } from "react";
import Header from "../Header";
import { FaPlus } from "react-icons/fa";
import { postEditted } from "../../features/posts/postsSlice";
import { useEditPostMutation } from "../../features/posts/postsApiSlice";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
 
const EditPostForm = ({handleHideEditForm, editPostId}) => {
  const { posts } = useSelector((state) => state.posts);
  const postToEdit = posts.filter((post)=> post._id === editPostId)
 
  const [title, setTitle] = useState(postToEdit[0].title);
  const [content, setContent] = useState(postToEdit[0].content);
const name = postToEdit[0].name
const agency = postToEdit[0].agency
const postId = postToEdit[0]._id
const dispatch = useDispatch()
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const canSave = Boolean(title) && Boolean(content);
 

  const [editPost, { isLoading }] = useEditPostMutation();
  const onSubmit = async (e) => {
    e.preventDefault();
    if (title && content) {
      try {
      const dateUpdated = await editPost({
          postId,
          title,
          content,
          name,
          agency,
          dateUpdated:  new Date().toISOString(),
        }).unwrap();
 
        const data = {
          postId,
          title,
          content,
          dateUpdated 
        };

        dispatch(postEditted(data));
        handleHideEditForm()
        toast.success("Edited Successfuly", {
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
  return (
    <>

     
      <section className="fixed top-0 left-0 right-0 z-50     p-4 overflow-x-hidden bg-slate-900 bg-opacity-40 overflow-y-auto md:inset-0 h-[calc(100%-1rem)]  h-screen  flex items-center justify-center ">
        <form className="flex flex-col bg-white justify-center p-2 w-2/3">
          <div className="flex justify-between items-center">
          <div className="bg-teal-700 p-2 rounded text-white font-semibold my-2">Edit Post</div>
          <div className="bg-slate-300 p-1 rounded text-dark font-semibold text-sm my-2 cursor-pointer" onClick={handleHideEditForm}>Close  </div>

          </div>
       
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
            onClick={onSubmit}
            disabled={!canSave}
          >
            Publish
          </button>
        </form>
      </section>
      {isLoading &&  <LoadingSpinner />}
    </>
  );
};

export default EditPostForm;
