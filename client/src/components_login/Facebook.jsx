/* eslint-disable no-unused-vars */
import { LoginSocialFacebook } from "reactjs-social-login";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";

function Facebook() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (profile) => {
    try {
      const response = await fetch("/api/users/register/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          password: profile.id, // This is generally not recommended; consider a secure method.
          user_image: profile.image,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token); // Ensure the token is properly stored
        console.log("Registration successful");
        window.location.href = "/"; // Redirect to the home page
      } else {
        console.log("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="facebook-login-container">
      <LoginSocialFacebook
        appId="1868654896885794" // Your Facebook app ID
        onResolve={(response) => {
          setProfile(response.data);
          console.log("Facebook profile:", response.data);
          handleLogin(response.data); // Call handleLogin here
        }}
        onReject={(error) => {
          setError(error);
          console.error("Facebook login error:", error);
        }}
      >
        <button className="flex  w-full items-center border border-gray-300 rounded-md px-2 py-1 ">
          <FaFacebook className="inline mr-2" />
          Facebook
        </button>
      </LoginSocialFacebook>
    </div>
  );
}

export default Facebook;
