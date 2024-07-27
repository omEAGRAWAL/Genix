import logo from "../components_login/asset/Vector.png";
import { useEffect, useState } from "react";

function Nav_bar() {
  const [token, setToken] = useState("");
  const [isAuctionDropdownOpen, setIsAuctionDropdownOpen] = useState(false);
  const [isBiddingDropdownOpen, setIsBiddingDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const tokenm = localStorage.getItem("token");
    setToken(tokenm);
  }, []);

  useEffect(() => {
    if (token) {
      userData();
    }
  }, [token]);

  const userData = async () => {
    try {
      if (!token) {
        console.log("No token available");
        return;
      }
      const response = await fetch("http://localhost:3000/api/users/user", {
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

  function signout() {
    localStorage.removeItem("token");
    setToken("");
    window.location.reload();
  }

  return (
    <div
      className="bg-[#FFE5F1]"
      style={{
        padding: "10px 60px 10px 100px",
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
      }}
    >
      <header
        className="flex justify-between items-center"
        style={{ fontFamily: "Manrope" }}
      >
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
        <div className=" hidden md:flex items-center" id="w">
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
                //wait for 2 sec
                setTimeout(() => {
                  setIsAuctionDropdownOpen(false);
                }, 1500);
              }}

              // onMouseLeave={() => setIsAuctionDropd  ownOpen(false)}
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
                  {/* <a
                    href="/auctions/past"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Past Auctions
                  </a> */}
                </div>
              )}
            </li>
            <li
              className="relative"
              onMouseEnter={() => {
                setIsBiddingDropdownOpen(true);
                setTimeout(() => {
                  setIsBiddingDropdownOpen(false);
                }, 1500);
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

            {token ? (
              <li
                className="relative"
                onMouseEnter={() => {
                  setIsUserDropdownOpen(true);
                  setTimeout(() => {
                    setIsUserDropdownOpen(false);
                  }, 2000);
                }}
                // onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <img
                  src={user?.user_image}
                  alt="Sample"
                  className="w-12 h-12 rounded-full border-4 border-white hidden md:block"
                />
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10">
                    <div className=" flex flex-row ">
                      <img
                        src={user?.user_image}
                        alt="Sample"
                        className="w-12 h-12 rounded-full border-4 border-white hidden md:block"
                      />
                      <div className="flex flex-col">
                        <div className="">{user.first_name}</div>
                        <div className="max-w-10 text-xs text-[#667085]">
                          {user.email}
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
              </li>
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
          </ul>
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            buttonLabel
          </button>
          {isOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <ul>
                <li>home</li>
                <li>Auctions</li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Nav_bar;
