/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to the home page if token is not found
    return <Navigate to="/" />;
  }

  // Return the protected element if token is found
  return element;
};

export default ProtectedRoute;
