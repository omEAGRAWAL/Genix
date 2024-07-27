/* eslint-disable no-unused-vars */
import { LoginSocialFacebook } from "reactjs-social-login";
import { useState } from "react";

function Facebook() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (profile) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/register/facebook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            password: profile.id,
            user_image: profile.image,
          }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", JSON.stringify(result));
        console.log("Registration successful");
        window.location.href = "/";
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
        <button className="facebook-login-button">Login with Facebook</button>
        {/* Uncomment the below line if using a styled button from a library */}
        {/* <FacebookLoginButton /> */}
      </LoginSocialFacebook>
      {profile && (
        <div>
          <h3>Welcome, {profile.name ? profile.name : "User"}</h3>
          {/* <p>Email: {profile.email}</p> */}
          {/* Add more profile details if needed */}
        </div>
      )}
      {error && <div className="error">Error: {error.message}</div>}
    </div>
  );
}

export default Facebook;
