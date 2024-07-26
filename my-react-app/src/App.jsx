import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// ... rest of your imports
import Sign_Up from "./components_login/Sign_Up";
import Sign_in from "./components_login/Sign_in";
import Home from "./component_home/Home";
import Auction_list from "./auction/Auction_list";
import Auction from "./auction/Auction_details";
import Auction_edit from "./auction/Auction_edit";
import My_auction from "./auction/My_auction";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<Sign_Up />} />
          <Route path="/login" element={<Sign_in />} />
          <Route path="/" element={<Home />} />
          <Route path="/auction" element={<Auction_list />} />
          <Route path="/auction/:id" element={<Auction />} />

          <Route path="/auction/edit/:id" element={<Auction_edit />} />
          <Route path="/auction/my" element={<My_auction />} />

          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
