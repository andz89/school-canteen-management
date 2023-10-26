import Label from "../../components/headerAndSidebar/Label";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetOrdersMutation,
  useEditOrderMutation,
} from "../../features/orders/ordersApiSlice";
import { toast } from "react-toastify";
import { ordersFetched } from "../../features/orders/ordersSlice";
import { parseISO, formatDistanceToNow, format } from "date-fns";

import { useNavigate } from "react-router-dom";
import MiniLoading from "../../components/MiniLoading";
const PickupOrders = () => {
  const navigate = useNavigate();
  const [getOrders, { isLoading: getOrdersLoading }] = useGetOrdersMutation();
  const [editOrder, { isLoading: editOrderLoading }] = useEditOrderMutation();
  const { orders } = useSelector((state) => state.orders);
  const orders_reversed = [...orders].reverse();
  const pickupOrders = orders_reversed.filter(
    (order) => order.details.status === "ready to pick up"
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrders().unwrap();

        dispatch(ordersFetched(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const timeAgo = (timestamp) => {
    let data = "";

    let date = parseISO(timestamp);
    let timePeriod = formatDistanceToNow(date);
    data = `${timePeriod} ago`;

    return data;
  };
  const handleChangeStatus = async (orderId) => {
    // Update the state with the new orders array
    const status = "complete";
    try {
      await editOrder({ orderId, status }).unwrap();
      const updatedOrders = orders.filter((order) => order._id !== orderId);
      dispatch(ordersFetched(updatedOrders));
      navigate("/completeOrders");
      toast.success("Order moved  Successfully", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <div>
      <Label>Pick up Orders</Label>
      <div className="flex justify-center items-center p-2 font-semibold   sticky top-0 z-10">
        {getOrdersLoading ? (
          <MiniLoading />
        ) : (
          <div className="relative overflow-x-auto w-full">
            {pickupOrders.map((order) => (
              <div
                key={order._id}
                className="my-5 p-2 bg-green-100 relative overflow-x-auto w-full"
              >
                <div className="flex p-2 justify-between">
                  <div className="text-slate-600">
                    {" "}
                    {timeAgo(order.createdAt)}{" "}
                  </div>
                  <div
                    onClick={() => handleChangeStatus(order._id)}
                    className="text-slate-600 bg-blue-300 p-2 rounded cursor-pointer"
                  >
                    Move to complete Order
                  </div>
                </div>

                <div className="flex justify-between items-center gap-3">
                  <div className="bg-yellow-300 uppercase font-semibold  p-2 rounded text-center text-slate-800   my-1  ">
                    {order.details.status}
                  </div>
                  <div className="text-slate-600 text-[14px]">
                    Order Id: {order._id}{" "}
                  </div>
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Product name
                      </th>
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
                    <div> reference code: {order.details.ref} </div>
                    <div> Buyer Email: {order.details.buyerEmail}</div>
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
    </div>
  );
};

export default PickupOrders;
