import logo from "./asset/Vector.png";
const Header = () => {
  return (
    <header className=" ">
      <a href="/">
        <div
          className="pl-9 flex flex-row p-3 md:pl-16 md:pt-4 md:pb-4  "
          style={{
            // padding: "16px 128px 0 128px",
          }}
        >
          {/* <img src="./asset/Vector.png" alt="Logo" className="h-8 w-8 mr-3" /> */}
          <img
            src={logo}
            alt="Logo"
            width="55.68px"
            height="52.5px"
            className="mr-3 md:w-14 md:h-12 "
            
          />
          <h1
            style={{
              fontFamily: "Manrope",
              
              fontWeight: "700",
              lineHeight: "40.98px",
              textAlign: "left",
            }}
            className="text-[#191D23] text-xl md:text-2xl  "
          >
            Genix Auctions
          </h1>
        </div>
      </a>
      <hr className="header-line" />
    </header>
  );
};

export default Header;
