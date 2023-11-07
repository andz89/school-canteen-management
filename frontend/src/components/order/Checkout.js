import { useState } from "react";
import { useSetNewOrderMutation } from "../../features/orders/ordersApiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Checkout = ({ orders, setCheckout, doneCheckout }) => {
  const navigate = useNavigate();
  const [setNewOrder, { isLoading: setNewOrderLoading }] =
    useSetNewOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const subtotal = orders.reduce(
    (accumulator, food) => accumulator + food.price,
    0
  );
  const [reference, setReference] = useState("");
  const placeOrder = async () => {
    const newOrder = {
      orders: orders,
      details: {
        ref: reference,
        status: "preparing",
        subtotal: subtotal,
        buyerName: userInfo.data.user.name,
        buyerEmail: userInfo.data.user.email,
        userId: userInfo.data.user.userId,
      },
    };

    try {
      const data = await setNewOrder(newOrder).unwrap();
      setCheckout(false);
      await doneCheckout();
      navigate("/order");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50   w-full p-4 overflow-x-hidden bg-slate-900 bg-opacity-40 overflow-y-auto md:inset-0 h-[calc(100%-1rem)]  h-screen  flex items-center justify-center ">
      <div
        role="status"
        className="flex     bg-white w-[400px] p-2 rounded h-[500px] flex-col"
      >
        <div className="font-semibold text-[16px]  text-slate-800 w-full bg-slate-200 h-[40px] flex items-center  ">
          <div className="m-auto">Checkout order </div>
        </div>
        <div className="h-[460px] overflow-auto">
          <div className="flex justify-end w-full font-semibold text-slate-800  ">
            <div className="mx-5 mt-4">Total </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              {orders.map((food) => (
                <tr
                  key={food.food_id}
                  className="bg-white flex  justify-around   items-center w-full border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="  p-4">
                    <img
                      src={food.image_one}
                      alt="Apple Watch"
                      style={{
                        width: "50px", // Set the image width to 50% to fit the container
                        height: "50px", // Set a fixed height for the banner
                        objectFit: "cover", // Ensure the image covers the container
                      }}
                    />
                  </td>
                  <td className="px-6 py-4  ">
                    <div className="w-32 font-semibold text-gray-900 dark:text-white">
                      {food.food_name}{" "}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        Qty:{" "}
                        <span className="font-semibold text-gray-900">
                          {food.quantity}{" "}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    ₱ {food.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="h-[100px] cursor-pointer p-2 w-full my-5">
            <div className=" font-semibold     text-left text-slate-800 ">
              Sub Total:₱ {subtotal}
            </div>
            <div>
              Gcash reference code:{" "}
              <input
                onChange={(e) => setReference(e.target.value)}
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                placeholder="Ex. 21km21"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <div
            onClick={() => setCheckout(false)}
            className="text-slate-800 bg-slate-300 font-semibold rounded p-2 w-full text-center cursor-pointer"
          >
            Cancel
          </div>
          {setNewOrderLoading ? (
            <div className="bg-slate-800 font-semibold rounded p-2 w-full text-center text-white cursor-pointer">
              Sending . . .
            </div>
          ) : (
            <div
              onClick={() => placeOrder(orders)}
              className="bg-orange-700 font-semibold rounded p-2 w-full text-center text-white cursor-pointer"
            >
              Place order
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
