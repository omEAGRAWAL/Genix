import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

// import { signInSuccess } from "../redux/user/userSlice";
// import { useNavigate } from "react-router-dom";
export default function OAuth() {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const auth = getAuth(app);
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle);
      // const res = await fetch("http://localhost:3000/api/users/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     first_name: resultsFromGoogle.user.displayName,
      //     email: resultsFromGoogle.user.email,
      //     googlePhotoUrl: resultsFromGoogle.user.photoURL,
      //   }),
      // });
      // const data = await res.json();
      // if (data.success === false) {
      //   console.log(data.message);
      // }

      // if (data) {
      //   // di??spatch(signInSuccess(data));
      //   navigate("/");
      // }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button onClick={handleGoogleSignIn}>
      {/* <className="w-6 h-6 mr-2" /> */}
      Sign in with Google
    </button>
  );
}
