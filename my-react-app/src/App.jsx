import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// ... rest of your imports
import Sign_Up from "./components_login/Sign_Up";
import Sign_in from "./components_login/Sign_in";
import Home from "./component_home/Home";
import Auction_list from "./auction/Auction_list";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<Sign_Up />} />
          <Route path="/login" element={<Sign_in />} />
          <Route path="/" element={<Home />} />
          <Route path="/auction" element={<Auction_list />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
