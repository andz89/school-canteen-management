import TimeAgo from "./TimeAgo";
import { useEffect, useState } from "react";
import { removeComment } from "../../features/posts/postsSlice";

import { useSelector, useDispatch } from "react-redux";
import { useDeleteCommentMutation } from "../../features/posts/postsApiSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import { FaTrash } from "react-icons/fa";

const Comments = ({ comments, postId, postOwnerId, readOnly }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [viewComments, setViewComments] = useState(false);
  const [deleteComment, { isLoading: deleteCommentLoading }] =
    useDeleteCommentMutation();
  const dispatch = useDispatch();
  const handleRemove = async (commentId) => {
    try {
      await deleteComment({ postId, commentId }).unwrap();

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

      dispatch(removeComment({ postId, commentId }));
      console.log(comments.length);
      if (comments.length === 1) {
        setViewComments(false);
      }
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
  const orderedPosts = comments
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const userComments = orderedPosts.map((comment) => {
    return (
      <article key={comment.commentId}>
        <div className="border-slate-300 border p-2 rounded mb-3">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center">
                <div className="font-medium dark:text-white">
                  <div className="text-sm my-[-8px]">{comment.name}</div>
                  <TimeAgo timestamp={comment.createdAt} />
                </div>
              </div>
              <p className="  text-gray-500 text-sm dark:text-gray-400">
                {comment.comment}
              </p>
            </div>
            <div>
              {!readOnly && postOwnerId === userInfo.data.user.userId ? (
                <div
                  className="hover:bg-blue-200 p-1 text-[11px] rounded cursor-pointer"
                  onClick={() => handleRemove(comment.commentId)}
                >
                  <FaTrash className="text-slate-700" size="1.5em" />
                </div>
              ) : (
                ""
                // comment?.userId === userInfo.data.user.userId && (
                //   <div
                //     className="hover:bg-blue-200 p-1 text-[11px] rounded cursor-pointer"
                //     onClick={() => handleRemove(comment.commentId)}
                //   >
                //     <FaTrash className="text-slate-700" size="1.5em" />
                //   </div>
                // )
              )}
            </div>
          </div>
        </div>
      </article>
    );
  });

  return (
    <div>
      {deleteCommentLoading && <LoadingSpinner />}
      <div className="h-[1px] bg-gray-300 border-0 rounded my-4"></div>
      <div className="flex justify-end">
        {comments.length > 0 ? (
          <small
            className="cursor-pointer"
            onClick={() => setViewComments((prev) => !prev)}
          >
            {comments.length !== 1 && (
              <>
                {!viewComments ? <span>View</span> : <span>Hide</span>}{" "}
                {!viewComments
                  ? comments.length === 0
                    ? comments.length - 1
                    : comments.length
                  : comments.length}{" "}
                Comments
              </>
            )}
          </small>
        ) : (
          " "
        )}
      </div>
      <div
        className={
          viewComments
            ? comments.length === 1
              ? "  overflow-y-auto"
              : "h-[240px] overflow-y-auto"
            : "  overflow-y-auto"
        }
      >
        {viewComments && userComments}
        {readOnly === true ||
          (!viewComments && comments.length > 0 && (
            <article key={comments[comments.length - 1]?.commentId}>
              <div className="border-slate-300 border p-1 rounded mb-3">
                <div className="flex  justify-between ">
                  <div className="font-medium dark:text-white p-2">
                    <div className="w-full text-sm my-[-8px] flex justify-between">
                      <div> {comments[comments.length - 1]?.name}</div>
                    </div>
                    <TimeAgo
                      timestamp={comments[comments.length - 1]?.createdAt}
                    />
                  </div>
                  <div>
                    {postOwnerId === userInfo.data.user.userId
                      ? userInfo.data.user.userId && (
                          <div
                            className="hover:bg-slate-200 p-1 text-[11px] rounded cursor-pointer"
                            onClick={() =>
                              handleRemove(
                                comments[comments.length - 1]?.commentId
                              )
                            }
                          >
                            <FaTrash className="text-slate-700" size="1.5em" />
                          </div>
                        )
                      : comments[comments.length - 1]?.userId ===
                          userInfo.data.user.userId && (
                          <div
                            className="hover:bg-slate-200 p-1 text-[11px] rounded cursor-pointer"
                            onClick={() =>
                              handleRemove(
                                comments[comments.length - 1]?.commentId
                              )
                            }
                          >
                            <FaTrash className="text-slate-700" size="1.5em" />
                          </div>
                        )}
                  </div>
                </div>

                <p className="  text-gray-500 text-sm dark:text-gray-400 px-2">
                  {comments[comments.length - 1]?.comment}
                </p>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
};

export default Comments;
