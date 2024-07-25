import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const auth = getAuth(app);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log("Google sign-in results:", resultsFromGoogle);

      const userProfile = {
        first_name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        user_image: resultsFromGoogle.user.photoURL,
      };

      const res = await fetch(
        "http://localhost:3000/api/users/register/facebook", // Ensure this endpoint is correct
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userProfile),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", JSON.stringify(data)); // Ensure token is stored as a string
        console.log("Registration successful");
        window.location.href = "/"; // Consider using React Router's navigate method if available
      } else {
        console.log("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return <button onClick={handleGoogleSignIn}>Sign in with Google</button>;
}
