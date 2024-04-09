import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { useDispatch, useSelector } from "react-redux";
import { logout, removeUsers } from "../../actions/auth";
import { clearMessage } from "../../actions/message";
import { history } from "../../helpers/history";
import './navbar.scss';

const Menu = () => (
  <div className="navbar-inner navbar">
    {/*
    Join a game
    Create a game
    Join a random open game
    Browse open games
    Play with friends */}
    <div className="nav-item">
      <Link as="div" className="nav-item-inner" to="/news">News
      </Link>
    </div>
    <div className="nav-item">
      <Link as="div" className="nav-item-inner" to="/forums">Forums
      </Link>
    </div>
  </div>
)

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  const logOut = () => {
    dispatch(removeUsers());
    dispatch(logout());
  };

  return (
    <div>
      <div className="navbar" id="navbar">
        <div className="navbar-links">
          <div className="nav-container">
            <Link to="/" className="main-logo">FIBI</Link>
            <div className="navbar-links-container">
              <Menu />
            </div>
          </div>
          {currentUser ? (
            <div className="user-info">
              <div className="nav-item">
                <Link to={"/profile/" + currentUser.username} className="nav-item-inner">
                  {currentUser.username}
                </Link>
              </div>
              <div className="nav-item">
                <Link to="/login" className="nav-item-inner" onClick={logOut}>
                  LogOut
                </Link>
              </div>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <div className="nav-item">
                <Link to={"/login"} className="nav-item-inner">
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="navbar-menu">
          { toggleMenu 
            ? <RiCloseLine color="fff" size={27} onClick={() => setToggleMenu(false)} />
            : <RiMenu3Line color="fff" size={27} onClick={() => setToggleMenu(true)} />
          }
          { toggleMenu && (
            <div className="navbar-menu-container scale-up-center">
              <div className="navbar-menu-container-links">
                <Menu />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="navbar-border"></div>
    </div>
  )
}
 
export default Navbar;