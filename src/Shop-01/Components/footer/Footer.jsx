import React from "react";
import styles from "./Footer.module.scss";
import '../../harinistyles.css'
const date = new Date();
const year = date.getFullYear();

const Footer = () => {
  
  return (
    <div className={styles["shop17-footer"]}>
      &copy;{year} Harini Selvamani
      
    </div>
  );
}

export default Footer;
