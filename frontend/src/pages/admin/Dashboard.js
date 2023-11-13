import Label from "../../components/headerAndSidebar/Label";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  useGetOrdersMutation,
  useEditOrderMutation,
} from "../../features/orders/ordersApiSlice";
import { ordersFetched } from "../../features/orders/ordersSlice";
const Dashboard = () => {
  const dispatch = useDispatch();

  const [getOrders, { isLoading: getOrdersLoading }] = useGetOrdersMutation();
  const { orders } = useSelector((state) => state.orders);

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
  return (
    <>
      <div>
        <Label>Dashboard</Label>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  --------
                </th>
                <th scope="col" className="px-6 py-3">
                  Preparing
                </th>
                <th scope="col" className="px-6 py-3">
                  Ready to Pick up
                </th>
                <th scope="col" className="px-6 py-3">
                  Complete Orders
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
             
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Orders
                </th>
                <td className="px-6 py-4">
                  {
                    orders.filter((food) => food.details.status === "preparing")
                      .length
                  }
                </td>
                <td className="px-6 py-4">
                  {" "}
                  {
                    orders.filter(
                      (food) => food.details.status === "ready to pick up"
                    ).length
                  }
                </td>
                <td className="px-6 py-4">
                  {" "}
                  {
                    orders.filter((food) => food.details.status === "complete")
                      .length
                  }
                </td>
                <td className="px-6 py-4"> {orders.length}</td>

                
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
