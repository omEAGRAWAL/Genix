import { useState } from "react";
import sign_up from "./asset/sign_up.png";
import Header from "./Header.jsx";
import Facebook from "./Facebook.jsx";
import Oauth from "./Oauth.jsx";

function Sign_Up() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = "/login";
        console.log("Registration successful");
      } else {
        alert("Registration failed. Please try again.");
        console.log("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex m-6 flex-row ">
        <div
          id="sign_up_form"
          className="md:pl-24 md:pt-7 md:w-1/2"
          style={{ height: 581, width: 400 }}
        >
          <form className="md:w-full" onSubmit={handleSignUp}>
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-[#191D23] text-xl/[30px]">Sign Up</h1>
              </div>
              <div>
                <p className="text-[#64748B] text-xs">
                  New bidders, as soon as you have submitted your information
                  you will be eligible to bid in the auction.
                </p>
              </div>
              <div>
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="border border-black w-full rounded p-1"
                  id="first_name"
                  placeholder="Olivia"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="border border-black w-full rounded p-1"
                  placeholder="Rhye"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border border-black w-full rounded p-1"
                  placeholder="olivia@untitledui.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="border border-black w-full rounded p-1"
                  id="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1D4ED8] to-[#5AD7FE] w-full p-1 rounded-sm"
                >
                  Submit
                </button>
              </div>
              <div className="flex justify-center items-center">
                <p>----------or sign up with----------</p>
              </div>
              <div className="google apple facebook"></div>
            </div>
          </form>
          <div className=" flex flex-row justify-between m-2 mt-0  ">
            <Facebook />
            <Oauth />
          </div>
          <div className="flex justify-center items-center text-lg">
            <p>
              Already Have an Accounr?{" "}
              <a href="/login" className="text-[#1D4ED8]">
                Log-in
              </a>
            </p>
          </div>
        </div>
        <div className="hidden  md:flex justify-center items-center w-1/2">
          <img
            className="p-10 m-10 hidden md:flex"
            src={sign_up}
            alt="Sign Up"
            width="550px"
            height="500px"
          />
        </div>
      </div>
    </div>
  );
}

export default Sign_Up;
