import { useState } from "react";
import "./MenuDes.css";

import { IconContext } from "react-icons";
import { FaBars } from "react-icons/fa";


import { SidebarData } from "./MenuDesData";

import { Link } from "react-router-dom";



export function MenuDes() {
    const [sidebar, setSidebar] = useState(false);
  
    const showSidebar = () => setSidebar(!sidebar);
  
    return (
      <>
        <IconContext.Provider value={{ color: "undefined" }}>
      
          
          
          <nav className={sidebar ? "nav-menu-des active" : "nav-menu-des"}>
            <ul>
              <li className="navbar-toggle">
                <Link to="#" className="bars-menu" onClick={showSidebar}>
                  <FaBars />
                </Link>
              </li>
              {SidebarData.map((item, index) => {
                if (sidebar==true) {
                  return (
                  
                    <li key={index} className={"nav-text"}>
                      <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                }else{
                return (
                  
                  <li key={index} className={"nav-icon-text"}>
                    <Link to={item.path}>
                      {item.icon}
                      
                    </Link>
                  </li>
                );
                }
              })}
            </ul>
          </nav>
        </IconContext.Provider>
      </>
    );
  }
  /*
  
    <div className="container">
  <button className="toggle-button">Abrir menú</button>
  <div className="menu">Contenido del menú</div>
</div>
 */