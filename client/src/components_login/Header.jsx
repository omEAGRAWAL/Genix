import logo from "./asset/Vector.png";
const Header = () => {
  return (
    <header>
      <a href="/">
        <div
          className="pl-9 flex flex-row "
          style={{
            padding: "16px 128px 0 128px",
          }}
        >
          {/* <img src="./asset/Vector.png" alt="Logo" className="h-8 w-8 mr-3" /> */}
          <img
            src={logo}
            alt="Logo"
            width="55.68px"
            height="52.5px"
            className="mr-3"
          />
          <h1
            style={{
              fontFamily: "Manrope",
              fontSize: "30px",
              fontWeight: "700",
              lineHeight: "40.98px",
              textAlign: "left",
            }}
            className="text-[#191D23]"
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
