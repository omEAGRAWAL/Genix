import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";
import { FcGoogle } from "react-icons/fc";

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
        "/api/users/register/facebook", // Ensure this endpoint is correct
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userProfile),
        }
      );

      const data = await res.json();
      console.log("Registration data:", data);

      if (res.ok) {
        localStorage.setItem("token", data); // Ensure token is stored as a string
        console.log("Registration successful");
        window.location.href = "/"; // Consider using React Router's navigate method if available
      } else {
        console.log("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex flex-row items-center border border-gray-300 rounded-md  px-4 py-1 hover:bg-gray-100"
    >
      <FcGoogle className="m-1 inline" />
      <span className="ml-2">Google</span>
    </button>
  );
}
