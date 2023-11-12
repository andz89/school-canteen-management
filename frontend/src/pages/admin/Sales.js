import React, { useEffect, useState } from "react";
import Label from "../../components/headerAndSidebar/Label";
import { useGetOrdersMutation } from "../../features/orders/ordersApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { ordersFetched } from "../../features/orders/ordersSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, formatDistanceToNow, parse, format } from "date-fns";

const Sales = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [getOrders, { isLoading: getOrdersLoading }] = useGetOrdersMutation();

  const setDateFromDatePicker = (dateString) => {
    let data = "";
    // Format the date to display in "MM/dd/yyyy" format
    data = format(dateString, "MM/dd/yyyy");
    return data;
  };
  const setDateFromOrder = (timestamp) => {
    let data = "";
    let date = parseISO(timestamp);

    // Format the date to display only date and day
    data = format(date, "MM/dd/yyyy");

    return data;
  };
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
  const { orders } = useSelector((state) => state.orders);
  const selected_orders = orders.filter((order) => {
    return (
      setDateFromOrder(order.createdAt) === setDateFromDatePicker(startDate)
    );
  });
  console.log(selected_orders);
  return (
    <div>
      <Label>Sales</Label>
      <div className="flex mt-5  gap-3 items-center">
        <label className="block mt-5  mx-1 text-sm font-medium text-gray-900 dark:text-white">
          Select range date
        </label>
        <div>
          <label className="block my-1 mx-1 text-sm font-medium text-gray-900 dark:text-white">
            Start Date
          </label>
          <DatePicker
            className="outline-none border border-green-500 p-1 rounded"
            dateFormat="MM/dd/yyyy"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div>
          <label className="block my-1 mx-1 text-sm font-medium text-gray-900 dark:text-white">
            End Date
          </label>
          <DatePicker
            className="outline-none border border-green-500 p-1 rounded"
            dateFormat="MM/dd/yyyy"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
        <div className="bg-green-700 font-semibold px-2 p-1 rounded mt-7 text-white cursor-pointer">
          Get Sales
        </div>
      </div>
      {setDateFromDatePicker(startDate)} : ₱{" "}
      {selected_orders.reduce((accumulator, order) => {
        return accumulator + order.details.subtotal;
      }, 0)}
      <div>
        {selected_orders.map((order) => (
          <div
            key={order._id}
            className="my-5 p-2 bg-green-100 relative overflow-x-auto w-full"
          >
            <div className="flex p-2 justify-between">
              <div className="text-slate-600">
                {" "}
                {setDateFromOrder(order.createdAt)}{" "}
              </div>
            </div>

            <div className="flex justify-between items-center gap-3">
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
    </div>
  );
};

export default Sales;
