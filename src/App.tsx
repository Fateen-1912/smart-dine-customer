import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Walkthrough from './pages/Walkthrough';
import Login from './pages/Login';
import ConfirmPhone from './pages/ConfirmPhone';
import Home from './pages/Home';
import SearchFood from './pages/SearchFood';
import FeaturedPartners from './pages/FeaturedPartners';
import SingleRestaurant from './pages/SingleRestaurant';
import AddToOrder from './pages/AddToOrder';
import Cart from './pages/Cart';
import AddPayment from './pages/AddPayment';
import OrderSuccess from './pages/OrderSuccess';
import CollectMeal from './pages/CollectMeal';

import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center font-sans">
        <div className="w-full max-w-[375px] bg-white h-[812px] shadow-2xl relative overflow-hidden flex flex-col">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/walkthrough" element={<Walkthrough />} />
            <Route path="/login" element={<Login />} />
            <Route path="/confirm" element={<ConfirmPhone />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchFood />} />
            <Route path="/partners" element={<FeaturedPartners />} />
            <Route path="/restaurant/:id" element={<SingleRestaurant />} />
            <Route path="/add-to-order/:itemId" element={<AddToOrder />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<AddPayment />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/collect-meal" element={<CollectMeal />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
