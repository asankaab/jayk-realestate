"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">JayK</Link>
      </div>
      <div className={styles.navLinks}>
        <Link href="/properties">Properties</Link>
        <Link href="/agents">Agents</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <div className={styles.login}>
        <Link href="/login" className={styles.loginButton}>
          Login
        </Link>
      </div>
      <div className={styles.hamburger} onClick={toggleMenu}>
        {/* Hamburger Icon */}
        <div></div>
        <div></div>
        <div></div>
      </div>
      {isOpen && (
        <div className={styles.mobileNav}>
          <Link href="/properties" onClick={toggleMenu}>
            Properties
          </Link>
          <Link href="/agents" onClick={toggleMenu}>
            Agents
          </Link>
          <Link href="/contact" onClick={toggleMenu}>
            Contact
          </Link>
          <Link href="/login" onClick={toggleMenu} className={styles.loginButton}>
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
