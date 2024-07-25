import { LoginSocialFacebook } from "reactjs-social-login";
// import { FacebookLoginButton } from "react-social-login-buttons";
import { useState } from "react";
function Facebook() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="facebook-login-container">
      <LoginSocialFacebook
        appId="1868654896885794" // Provide appId as a prop
        onResolve={(profile) => {
          setProfile(profile);
          console.log("Facebook profile:", profile);
        }}
        onReject={(error) => {
          setError(error);
          console.error("Facebook login error:", error);
        }}
      >
        <button className="">Login with Facebook</button>
        {/* <FacebookLoginButton  /> */}
      </LoginSocialFacebook>
      {profile && <div>{profile.name}</div>}
      {error && <div className="error">{error.message}</div>}
    </div>
  );
}

export default Facebook;
