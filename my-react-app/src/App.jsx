import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sign_Up from "./components_login/Sign_Up";
import Sign_in from "./components_login/Sign_in";
import Home from "./component_home/Home";
import Auction_list from "./auction/Auction_list";
import Auction from "./auction/Auion_details";
import Auction_edit from "./auction/Auction_edit";
import My_auction from "./auction/My_auction";
import My_bid from "./bid/My_bid";
import Update_user from "./components_login/Update_user";
import ProtectedRoute from "./ProtectedRouter"; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<Sign_Up />} />
          <Route path="/login" element={<Sign_in />} />
          <Route path="/" element={<Home />} />
          <Route path="/auction/:id" element={<Auction />} />

          {/* Protect the following routes */}
          <Route
            path="/user/update"
            element={<ProtectedRoute element={<Update_user />} />}
          />
          <Route
            path="/auction/new"
            element={<ProtectedRoute element={<Auction_list />} />}
          />

          <Route
            path="/auction/edit/:id"
            element={<ProtectedRoute element={<Auction_edit />} />}
          />
          <Route
            path="/auction/my"
            element={<ProtectedRoute element={<My_auction />} />}
          />
          <Route
            path="/bid/my"
            element={<ProtectedRoute element={<My_bid />} />}
          />

          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
