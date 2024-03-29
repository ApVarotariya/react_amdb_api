import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import brandLogo from "../images/Logo.png";
import { AiFillHome } from "react-icons/ai";
import { CgTrending } from "react-icons/cg";
import { RiMovie2Fill } from "react-icons/ri";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const toggleMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  return (
    <>
      <div className="header-main">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 d-flex align-items-center justify-content-between">
              <Navbar expand="lg" className="px-0 navbar-main">
                <Navbar.Brand href="/">
                  <img
                    src={brandLogo}
                    style={{
                      width: "100px",
                      borderRadius: "4px",
                    }}
                  />
                </Navbar.Brand>
                <Navbar.Toggle
                  aria-controls="basic-navbar-nav"
                  className="d-none"
                />
                <Navbar.Collapse id="basic-navbar-nav d-flex">
                  <Nav className="me-auto">
                    <NavLink activeclassname="active" to="trending">
                      Trending
                    </NavLink>
                    <NavLink activeclassname="active" to="movies">
                      Discover
                    </NavLink>
                    {/* <NavLink activeclassname="active" to="bollywoodmovies">
                      BollyWood Movies
                    </NavLink> */}
                    <NavLink activeclassname="active" to="tv-series">
                      TV Series
                    </NavLink>
                    <NavLink activeclassname="active" to="search">
                      Search
                    </NavLink>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <div className={isDarkMode ? "dark_mode" : "light_mode"}>
                <button onClick={toggleMode} className="theme_toggle_icon">
                  {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
                </button>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 d-md-none">
              <Navbar expand="lg" fixed="bottom" className="navbar-mobile">
                <Container fluid>
                  <Nav className="me-auto">
                    <NavLink activeclassname="active" to="">
                      <span>Home</span>
                      <AiFillHome />
                    </NavLink>
                    <NavLink activeclassname="active" to="trending">
                      <span>Trending</span>
                      <CgTrending />
                    </NavLink>
                    <NavLink activeclassname="active" to="movies">
                      <span>Discover</span>
                      <CgTrending />
                    </NavLink>
                    <NavLink activeclassname="active" to="tv-series">
                      <span>Tv Series</span>
                      <RiMovie2Fill />
                    </NavLink>
                    <NavLink activeclassname="active" to="search">
                      <span>Search</span>
                      <BiSearchAlt2 />
                    </NavLink>
                  </Nav>
                </Container>
              </Navbar>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
