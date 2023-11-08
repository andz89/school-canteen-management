import React, { useEffect, useState } from "react";
import { FaStar, FaPlus } from "react-icons/fa";
import { useGetReviewsMutation } from "../../features/reviews/reviewsApiSlice";
import { parseISO, formatDistanceToNow, format } from "date-fns";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [getReviews, { isLoading: getReviewsLoading }] =
    useGetReviewsMutation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReviews().unwrap();
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const createStar = (countStar) => {
    const starArray = [];
    for (let i = 1; i <= countStar; i++) {
      starArray.push(<FaStar className="text-yellow-400" key={i} />);
    }
    return starArray;
  };
  const timeAgo = (timestamp) => {
    let data = "";
    let date = parseISO(timestamp);

    // Format the date to display only date and day
    data = format(date, "yyyy-MM-dd, EEEE"); // Adjust the format as per your requirements

    return data;
  };

  const renderReviews = reviews.map((review) => (
    <div key={review._id} className="mx-3 w-[299px] text-center  ">
      <div>
        <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-700 dark:shadow-black/30">
          <div className=" flex  items-center h-12 overflow-hidden rounded-t-lg bg-green-200 px-2 justify-between">
            <div className="flex  gap-1 ">
              {}
              {createStar(review.details.countStars)}
            </div>
            <div className="flex flex-col  justify-start items-start">
              <small className="text-green-700">Date ordered:</small>
              <span className="font-semibold text-[13px] text-green-700">
                {timeAgo(review.details.createAt)}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h4 className="mb-4 text-2xl font-semibold">Maria Smantha</h4>
            <hr />
            <p className="mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="inline-block h-7 w-7 pr-2"
                viewBox="0 0 24 24"
              >
                <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" />
              </svg>
              {review.details.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  ));
  return (
    <div>
      <div className="text-center">
        <h2 className="mt-4 text-2xl text-green-700 font-semibold">
          Customers' Reviews
        </h2>
        <p className=" ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="inline-block h-7 w-7 pr-2"
            viewBox="0 0 24 24"
          >
            <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" />
          </svg>
          Lorem ipsum dolor sit amet eos adipisci, consectetur adipisicing elit.
        </p>
      </div>
      <div>
        <div className="flex   flex-wrap justify-center gap-3 items-center my-5 w-full">
          {renderReviews}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
