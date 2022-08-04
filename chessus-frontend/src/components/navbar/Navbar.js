import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth";
import { clearMessage } from "../../actions/message";
import { history } from "../../helpers/history";
import './navbar.scss';

const Menu = () => (
  <div className="navbar-inner navbar">
    <div className="nav-item">
      <Link as="div" className="nav-item-inner" to="/play">Play
      </Link>
      <div className="inner-menu">
        <Link as="div" className="inner-menu-item upper-right-corner" to="/home">
          Join a game
        </Link>
        <Link as="div" className="inner-menu-item" to="/home">
          Create a game
        </Link>
        <Link as="div" className="inner-menu-item" to="/home">
          Browse games
        </Link>
        <Link as="div" className="inner-menu-item lower-corner" to="/home">
          Play with friends
        </Link>
      </div>
    </div>
    {/*
    Join a game
    Create a game
    Join a random open game
    Browse open games
    Play with friends */}
    <div className="nav-item">
      <Link as="div" className="nav-item-inner" to="/design">Design
      </Link>
      <div className="inner-menu">
        <Link as="div" className="inner-menu-item upper-right-corner" to="/home">
          Design a game
        </Link>
        <Link as="div" className="inner-menu-item" to="/home">
          Design a piece
        </Link>
        <Link as="div" className="inner-menu-item lower-corner" to="/home">
          Browse games
        </Link>
      </div>
    </div>

    
    {/* design a game, design a piece, browse games */}

    <div className="nav-item">
      <Link as="div" className="nav-item-inner" to="/media">Media
      </Link>
      <div className="inner-menu">
        <Link as="div" className="inner-menu-item upper-right-corner" to="/home">
          General forums
        </Link>
        <Link as="div" className="inner-menu-item" to="/home">
          Game forums
        </Link>
        <Link as="div" className="inner-menu-item" to="/home">
          Social media
        </Link>
        <Link as="div" className="inner-menu-item" to="/home">
          Streams
        </Link>
        <Link as="div" className="inner-menu-item lower-corner" to="/home">
          News
        </Link>
      </div>
    </div>
    {/* general forums, new game forums, social media, contact, news */}
    <div className="nav-item">
      <Link as="div" className="nav-item-inner" to="/community">Community
      </Link>
      <div className="inner-menu">
        <Link as="div" className="inner-menu-item upper-right-corner" to="/home">
          Players
        </Link>
        <Link as="div" className="inner-menu-item" to="/home">
          Leaderboard
        </Link>
        <Link as="div" className="inner-menu-item lower-corner" to="/home">
          Donate
        </Link>
      </div>
    </div>
    
    {/* players, donate, leaderboard */}
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
    dispatch(logout());
  };

  return (
    <div className="navbar" id="navbar">
      <div className="navbar-links">
        <div className="nav-container">
          <Link to="/" className="main-logo">CHESSUS</Link>
          <div className="navbar-links-container">
            <Menu />
          </div>
        </div>
        {currentUser ? (
          <div className="user-info">
            <div className="nav-item">
              <Link to={"/profile"} className="nav-item-inner">
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
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Sign In
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li> */}
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
  )
}
 
export default Navbar;