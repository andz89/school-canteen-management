import Dashboard from "./pages/admin/Dashboard";
import Register from "./pages/users/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import Private from "./components/Private";
import ProfileUser from "./pages/users/Profile";
import UpdatePasswordUser from "./pages/users/UpdatePassword";
import FoodList from "./pages/users/Food_list";
import Login from "./pages/users/Login";
import NoPageFound from "./components/NoPageFound";
import { useSelector } from "react-redux";
import AdminLogin from "./pages/admin/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "./components/headerAndSidebar/Main";
import Foods from "./pages/admin/Foods";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Tasks from "./pages/admin/Tasks";
import FoodItem from "./components/foods/FoodItem";
import Cart from "./pages/users/Cart";
import Order from "./pages/users/Order";
import PickupOders from "./pages/admin/PickupOrders";
import CompleteOrders from "./pages/admin/CompleteOrders";
function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route element={<PersistLogin />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminLogin />} />

              {/*users view */}

              <Route path="" element={<Private allowedRoles={["user"]} />}>
                <Route path="/profile-user" element={<ProfileUser />} />
                <Route path="/" element={<FoodList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Order />} />

                <Route path="*" element={<NoPageFound />} />
                <Route
                  path="/updatePasswordUser"
                  element={<UpdatePasswordUser />}
                />
                <Route path="/foodItem/:id" element={<FoodItem />} />
              </Route>

              <Route path="" element={<Private allowedRoles={["admin"]} />}>
                <Route element={<Main />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/foods" element={<Foods />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/pickUpOrders" element={<PickupOders />} />
                  <Route path="/CompleteOrders" element={<CompleteOrders />} />

                  <Route path="*" element={<NoPageFound />} />
                </Route>
                {/* <Route
                path="/profile-organizer"
                element={<ProfileOrganizer />}
              />
         
              <Route
                path="/updatePasswordOrganizer"
                element={<UpdatePasswordOrganizer />}
              />
              <Route path="/postsOrganizer" element={<PostsOrganizer />} /> */}
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
