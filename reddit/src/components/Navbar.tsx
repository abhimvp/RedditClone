import { FaPlus, FaReddit, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useState } from "react";
import "../styles/Navbar.css";
const Navbar = () => {
  // Returns the current auth state and if a user is signed in, the user object.if they are signed in it gives info about their mail , name and anything clerk storing for us.
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <FaReddit className="reddit-icon" />
            <span className="site-name">Reddit</span>
          </div>
        </Link>
        <div>Searchbar</div>
        <div className="nav-actions">
          <Unauthenticated>
            <SignInButton mode="modal">
              <button className="sign-in-button">Sign In</button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <div className="dropdown-container">
              <button className="icon-button" onClick={() => {}}>
                {/* {"drop down container "} */}
                <FaPlus />
              </button>
            </div>
            <button
              className="icon-button"
              onClick={() => user?.username && navigate(`/u/${user.username}`)}
              title="View Profile"
            >
              <FaUser />
            </button>
            <UserButton />
          </Authenticated>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
