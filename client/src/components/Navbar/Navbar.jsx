import React from "react";
import "./Navbar.css";
import { navList } from "./Navlist";
import SignUpForm from "../SignUpForm";

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <ul className="navbar-items">
          {navList.map((item) => {
            return <li>{item.title}</li>;
          })}
        </ul>
        <SignUpForm />
      </div>
    </>
  );
};

export default Navbar;