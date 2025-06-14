import { Route, Routes } from "react-router"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage"
import AboutUsPage from "../pages/AboutPage/AboutUsPage"
import ProductInfoPage from "../pages/ProductInfoPage/ProductInfoPage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import MainLayout from "../layout/MainLayout"
import AuthPage from "../pages/AuthPage/AuthPage"
import AuthLayout from "../layout/AuthLayout"
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage"
import DashBoard from "../layout/DashBoard/DashBoardLayout"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import AddressPage from "../pages/AddressPage/AddressPage"
import OrdersPage from "../pages/OrdersPage/OrdersPage"
import useAuthStore from "../Store/store"
import ManageOrders from "../pages/ManageOrders"
import AddProducts from "../pages/AddProduct/AddProducts"
import SubCategory from "../pages/SubCategoryPage/SubCategory"
import Category from "../pages/CategoryPage/Category"
import ProductsList from "../pages/ProductsList/ProductsList"
import CategoryDetailsPage from "../pages/CategoryListPage/CategoryDetailsPage"
import CartPage from "../pages/CartPage/CartPage"
import SearchPage from "../pages/SearchPage/SearchPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import SuccessPage from "../pages/SuccessPage/SuccessPage";
import VerifyAccount from "../pages/VerifyAccountPage/VerifyAccountPage";

const AppRoutes: React.FC = () => {
  const user = useAuthStore(state => state.user)
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const roleBasedRoutes =
    user.role === 'USER'
      ? (
        <Route path="user">
          <Route index element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="address" element={<AddressPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      )
      : user.role === 'ADMIN'
        ? (
          <Route path="admin">
            <Route index element={<ManageOrders />} />
            <Route path="manageOrders" element={<ManageOrders />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="categories" element={<Category />} />
            <Route path="subCategories" element={<SubCategory />} />
            <Route path="product/:id" element={<AddProducts />} />
          </Route>
        )
        : null;

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:id" element={<CategoryDetailsPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/search" element={<SearchPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="aboutus" element={<AboutUsPage />} />
          <Route path="/success/:id" element={<SuccessPage/>}/>
          <Route path="products" >
            <Route path=":id" element={<ProductInfoPage />} />
          </Route>
          <Route path="/dashboard" element={<DashBoard />} >
            {roleBasedRoutes}
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes >
  )
}

export default AppRoutes
