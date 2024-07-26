/* eslint-disable no-unused-vars */
import logo from "../components_login/asset/Vector.png";
import { useEffect } from "react";
import { useState } from "react";
function Nav_bar() {
  const [token, setToken] = useState("");
  useEffect(() => {
    const tokenm = localStorage.getItem("token");
    setToken(tokenm);
  }, []);

  function signout() {
    localStorage.removeItem("token");
    setToken("");
    window.location.reload();
  }

  return (
    <div
      className="bg-[#FFE5F1] "
      style={{
        padding: "10px 60px 10px 100px",
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
      }}
    >
      <header
        className="flex justify-between items-center "
        style={{ fontFamily: "Manrope" }}
      >
        <a href="/">
          <div className="flex items-center ">
            <img
              src={logo}
              alt="Logo"
              width="55.68px"
              height="52.5px"
              className="mr-3"
            />
            <h1
              className="text-[#191D23] font-bold text-lg md:text-2xl"
              style={{ fontFamily: "Manrope" }}
            >
              Genix Auctions
            </h1>
          </div>
        </a>
        <div className="flex items-center " id="w">
          <ul className="flex gap-6 items-center">
            <li>
              <a href="/auction" className="hover:font-bold">
                Auctions
              </a>
            </li>
            <li>
              <a href="#" className="hover:font-bold">
                Bidding
              </a>
            </li>
            <li>
              <a href="#" className="hover:font-bold">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:font-bold">
                English
              </a>
            </li>
            {token ? (
              <>
                {" "}
                <img
                  src={logo}
                  alt="Sample"
                  className="w-12 h-12 rounded-full border-4 border-white hidden md:block"
                />
                <button
                  onClick={signout}
                  className="bg-[#FF3366] text-white px-4 py-2 rounded-md"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div>
                <a href="/login" className="hover:font-bold">
                  Sign in
                </a>
                <a href="/signup" className="hover:font-bold">
                  Sign up
                </a>
              </div>
            )}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Nav_bar;
