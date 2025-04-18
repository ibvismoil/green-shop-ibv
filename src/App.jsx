import "./App.css";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Home from "./pages/home";
import Navbar from "./components/Navbar/index.tsx";
import Shop from "./pages/Shop/index.jsx";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Account from "./pages/Profile/ProfileComponents/Account.jsx";
import MyProducts from "./pages/Profile/ProfileComponents/MyProducts.jsx";
import Wishlist from "./pages/Profile/ProfileComponents/Wishlist.jsx";
import Track from "./pages/Profile/ProfileComponents/Track.jsx";
import { ConfigProvider, App as AntdApp } from "antd";
import { Toaster } from "sonner";
import Blog from "./components/Blog/index.tsx"
import Address from "./pages/Profile/ProfileComponents/Address.jsx";
import '@ant-design/v5-patch-for-react-19';
import ProductsCars from "./components/Home/Product";
import ProductChek from "./components/ProductChek/index.jsx";

function App() {
  return (
    <ConfigProvider>
      <AntdApp>
        <Toaster position="top-right" richColors />
        <Navbar />
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Shop />} path="/shop" />
          <Route element={<ProductChek />} path="/product-checkout" />
          <Route element={<Blog />} path="/blog" />
          <Route element={<ProductsCars />} path="/product-card" />
          <Route element={<Profile />} path="/profile">
            <Route element={<Account />} path="account" />
            <Route element={<MyProducts />} path="myproducts" />
            <Route element={<Address />} path="address" />
            <Route element={<Wishlist />} path="wishlist" />
            <Route element={<Track />} path="track" />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
