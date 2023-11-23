import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { useGetOrdersMutation } from "../../features/orders/ordersApiSlice";
import { ordersFetched } from "../../features/orders/ordersSlice";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { Link } from "react-router-dom";
import MiniLoading from "../../components/MiniLoading";
const Order = () => {
  const [getOrders, { isLoading: getOrdersLoading }] = useGetOrdersMutation();
  const { orders } = useSelector((state) => state.orders);
  const [copyOfOrders, setCopyOfOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState("preparing");

  const orders_reversed = [...orders].reverse();
  const preparingOrders = orders_reversed.filter((order) => {
    return order.details.status === orderStatus;
  });

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrders().unwrap();
        setCopyOfOrders(data);
        dispatch(ordersFetched(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [orderStatus]);
  const timeAgo = (timestamp) => {
    let data = "";

    let date = parseISO(timestamp);
    let timePeriod = formatDistanceToNow(date);
    data = `${timePeriod} ago`;

    return data;
  };

  // const datePurchase = (serverDate) => {
  //   const parsedDate = parseISO(serverDate);

  //   // Format the parsed date to your desired format
  //   const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");
  //   return formattedDate;
  // };
  const handleChangeTab = (stat) => {
    setOrderStatus(stat);
  };
  return (
    <>
      {" "}
      <Header />
      <div className="flex  justify-around items-center p-1 mt-5 w-full  sm:w-[78%]  mx-auto  font-semibold cursor-pointer">
        <div
          onClick={() => handleChangeTab("preparing")}
          className={` ${
            orderStatus === "preparing"
              ? "bg-white border-b-4 border-x-0 border-t-0  border-green-200"
              : "    "
          }  w-full text-center p-2 hover:bg-green-200  text-[13px]`}
        >
          Preparing
        </div>
        <div
          onClick={() => handleChangeTab("ready to pick up")}
          className={` ${
            orderStatus === "ready to pick up"
              ? "bg-white border-b-4 border-x-0 border-t-0  border-green-200"
              : "    "
          }  w-full text-center p-2 hover:bg-green-200  text-[13px]`}
        >
          To pick up
        </div>
        <div
          onClick={() => handleChangeTab("complete")}
          className={` ${
            orderStatus === "complete"
              ? "bg-white border-b-4 border-x-0 border-t-0  border-green-200"
              : "    "
          }  w-full text-center p-2 hover:bg-green-200  text-[13px]`}
        >
          Complete
        </div>
      </div>
      <div className="flex justify-between items-center p-2 font-semibold   sticky top-0 z-10 w-full sm:w-[90%] mx-auto">
        {getOrdersLoading ? (
          <div className="mx-auto">
            <MiniLoading />
          </div>
        ) : (
          <div className="relative overflow-x-auto w-full">
            {preparingOrders.map((order) => (
              <div
                key={order._id}
                className="my-5 p-2 bg-green-100 relative overflow-x-auto w-full"
              >
                <div className="text-slate-600">
                  {" "}
                  {timeAgo(order.createdAt)}{" "}
                </div>

                <div className="flex justify-between items-center gap-3">
                  <div className="flex justify-center items-center gap-2">
                    <div
                      className={` uppercase font-semibold  p-2 rounded text-center    my-1  ${
                        order.details.status === "complete"
                          ? "bg-green-700 text-slate-100"
                          : "bg-yellow-300 text-slate-800"
                      }`}
                    >
                      {order.details.status}
                    </div>
                    {order.details.status === "complete" && (
                      <Link
                        to={`/reviewForm/${order._id}`}
                        className="hover:bg-green-300  text-green-800 flex items-center  gap-1 bg-green-200 p-2 rounded text-sm"
                      >
                        Send a review
                      </Link>
                    )}
                  </div>

                  <div className="text-slate-600 text-[14px]">
                    Order Id: {order._id}{" "}
                  </div>
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3"></th>
                      <th scope="col" className="px-6 py-3">
                        Qty
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.orders.map((order) => (
                      <tr
                        key={order._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700  "
                      >
                        <td className="  p-4">
                          <img
                            src={order.image_one}
                            alt="Apple Watch"
                            style={{
                              width: "50px", // Set the image width to 50% to fit the container
                              height: "50px", // Set a fixed height for the banner
                              objectFit: "cover", // Ensure the image covers the container
                            }}
                          />
                        </td>
                        <td className="px-6 py-4  ">
                          <div className="w-32 font-semibold text-gray-900  ">
                            {order.food_name}{" "}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div>
                              Qty:{" "}
                              <span className="font-semibold text-gray-900">
                                {order.quantity}{" "}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          ₱ {order.orig_price}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          ₱ {order.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center">
                  <div className="text-slate-600 text-[14px] ">
                    {order.details.ref === "pay-on-pickup"
                      ? "pay-on-pickup"
                      : "reference code: " + order.details.ref}
                  </div>
                  <div className=" bg-slate-300   font-semibold  p-2 rounded text-center text-slate-800   my-1 w-[200px] ">
                    Subtotal: ₱ {order.details.subtotal}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
