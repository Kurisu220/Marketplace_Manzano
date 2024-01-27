import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Store from "./pages/Store";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/home";
import Cart from "./pages/Cart";
import "./marketplace.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./component/navbar";
import Footer from "./component/footer";
import Banner from "./component/Banner";

import { AuthProvider } from './component/AuthContext';
import { CartProvider } from './component/CartContext';
import PrivateRoute from "./component/PrivateRoute";



function App() {
  return (
    <div className="App">
      
      <AuthProvider>
      <CartProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<>  <Banner /> <Login /></>} />
            <Route path="/signup" element={<>  <Banner /> <Signup/></>} />
            <Route path="/store/*" element={<><NavigationBar /><PrivateRoute><Store /></PrivateRoute></>}/>
            <Route path="/add" element={<><NavigationBar /><PrivateRoute><Add /></PrivateRoute></>}/>
            <Route path="/home" element={<><NavigationBar /><PrivateRoute><Home /></PrivateRoute></>}/>
            <Route path="/update/:id" element={<><NavigationBar /><PrivateRoute><Update /></PrivateRoute></>}/>
            <Route path="/cart" element={<><NavigationBar /><PrivateRoute><Cart /></PrivateRoute></>}/>
          </Routes>
        </BrowserRouter>
            <Footer />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
