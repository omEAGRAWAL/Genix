/* eslint-disable no-unused-vars */
import logo from "../components_login/asset/Vector.png";
import { useEffect, useState } from "react";

function Nav_bar() {
  // State variables to manage the token, user data, and dropdown visibility
  const [token, setToken] = useState("");
  const [isAuctionDropdownOpen, setIsAuctionDropdownOpen] = useState(false);
  const [isBiddingDropdownOpen, setIsBiddingDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown menu's open/close state
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Retrieve the token from localStorage on component mount
  useEffect(() => {
    const tokenm = localStorage.getItem("token");
    setToken(tokenm);
  }, []);

  // Fetch user data if token is present
  useEffect(() => {
    if (token) {
      userData();
    }
  }, [token]);

  // Function to fetch user data from the server
  const userData = async () => {
    try {
      if (!token) {
        console.log("No token available");
        return;
      }
      const response = await fetch("/api/users/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        console.log(data);
      } else {
        const errorText = await response.text();
        console.error("Error fetching user data:", errorText);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  // Sign out function to clear the token and reload the page
  function signout() {
    localStorage.removeItem("token");
    setToken("");
    window.location.reload();
  }

  return (
    <div
      className="bg-[#FFE5F1] px-1 md:px-10 py-2 md:py-4 "
      style={{
        // padding: "10px 60px 10px 100px",
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
      }}
    >
      <header
        className="flex justify-between  items-center flex-row "
        style={{ fontFamily: "Manrope" }}
      >
        {/* Logo and Site Title */}

        <a href="/">
          <div className="flex items-center">
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

        {/* Navigation Menu */}
        <div className="flex flex-row items-center gap-6">
          <div className="hidden md:flex items-end">
            <ul className="flex gap-6 items-center relative">
              <li>
                <a href="/" className="hover:font-bold">
                  Home
                </a>
              </li>
              <li
                className="relative"
                onMouseEnter={() => {
                  setIsAuctionDropdownOpen(true);
                  setTimeout(() => {
                    setIsAuctionDropdownOpen(false);
                  }, 1500); // Auto-close after 1.5 seconds
                }}
                // onMouseLeave={() => setIsAuctionDropdownOpen(false)}
              >
                <a className="hover:font-bold">Auctions</a>
                {isAuctionDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <a
                      href="/auction/my"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Auctions
                    </a>
                    <a
                      href="/auction/new"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      New Auctions
                    </a>
                  </div>
                )}
              </li>
              <li
                className="relative"
                onMouseEnter={() => {
                  setIsBiddingDropdownOpen(true);
                  setTimeout(() => {
                    setIsBiddingDropdownOpen(false);
                  }, 1500); // Auto-close after 1.5 seconds
                }}
                // onMouseLeave={() => setIsBiddingDropdownOpen(false)}
              >
                <a className="hover:font-bold">Bids</a>
                {isBiddingDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <a
                      href="/bid/my"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Bids
                    </a>
                    <a
                      href="/bidding/history"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Bid History
                    </a>
                    <a
                      href="/bidding/rules"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Bidding Rules
                    </a>
                  </div>
                )}
              </li>
              <li>
                <a href="#" className="hover:font-bold">
                  About us
                </a>
              </li>
            </ul>
          </div>

          {/* Profile Section for Desktop */}
          <div id="profile" className="md:flex hidden ">
            {token ? (
              <div className="relative">
                <img
                  src={user?.user_image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-4 border-white hidden md:block"
                  onMouseEnter={() => {
                    setIsUserDropdownOpen(true);
                    setTimeout(() => {
                      setIsUserDropdownOpen(false);
                    }, 1500); // Auto-close after 1.5 seconds
                  }}

                  // onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                />
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10">
                    <div className="flex flex-row">
                      <img
                        src={user?.user_image}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-4 border-white"
                      />
                      <div className="flex flex-col">
                        <div className="">{user?.first_name}</div>
                        <div className="max-w-10 text-xs text-[#667085]">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <a
                      href="/user/update"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Update Profile
                    </a>
                    <a
                      href="/bid/my"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Bids
                    </a>
                    <a
                      href="/auction/my"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Auctions
                    </a>
                    <button
                      onClick={signout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                <a href="/login" className="hover:font-bold">
                  Sign in
                </a>
                <a href="/signup" className="hover:font-bold">
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Profile section visible on mobile */}
        <div className="md:hidden flex items-center justify-end ">
          {token && (
            <div className="relative">
              <img
                src={user?.user_image}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              />
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10">
                  <div className="flex flex-row">
                    <img
                      src={user?.user_image}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-4 border-white"
                    />
                    <div className="flex flex-col">
                      <div className="">{user?.first_name}</div>
                      <div className="max-w-10 text-xs text-[#667085]">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <a
                    href="/user/update"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Update Profile
                  </a>
                  <a
                    href="/bid/my"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Bids
                  </a>
                  <a
                    href="/auction/my"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Auctions
                  </a>
                  <button
                    onClick={signout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Nav_bar;
