import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import brandLogo from "../images/Logo.png";
import { AiFillHome } from "react-icons/ai";
import { CgTrending } from "react-icons/cg";
import { RiMovie2Fill } from "react-icons/ri";
import { BiSearchAlt2 } from "react-icons/bi";

const Header = () => {
  return (
    <>
      <div className="header-main">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <Navbar expand="lg" className="px-0 navbar-main">
                <Navbar.Brand href="/react_amdb_api">
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
                    {/* <NavLink activeclassname="active" to="trending-movies">
                      Trending
                    </NavLink> */}
                    <NavLink activeclassname="active" to="movies">
                      Discover
                    </NavLink>
                    <NavLink activeclassname="active" to="bollywoodmovies">
                      BollyWood Movies
                    </NavLink>
                    <NavLink activeclassname="active" to="tv-series">
                      TV Series
                    </NavLink>
                    <NavLink activeclassname="active" to="search">
                      Search
                    </NavLink>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 d-md-none">
              <Navbar expand="lg" fixed="bottom" className="navbar-mobile">
                <Container fluid>
                  <Nav className="me-auto">
                    <NavLink activeclassname="active" to="react_amdb_api">
                      <span>Home</span>
                      <AiFillHome />
                    </NavLink>
                    <NavLink activeclassname="active" to="movies">
                      <span>Discover</span>
                      <CgTrending />
                    </NavLink>
                    <NavLink activeclassname="active" to="bollywoodmovies">
                      <span>BollyWood</span>
                      <CgTrending />
                    </NavLink>
                    {/* <NavLink activeclassname="active" to="trending-movies">
                      <span>Trending</span>
                      <CgTrending />
                    </NavLink> */}
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
