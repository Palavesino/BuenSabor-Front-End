import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
//aca pones todas las rutas que necesitemos esta parte es para linea 35 navbar
export const SidebarData = [
    {
      title: "Home",
      path: "/",
      icon: <AiIcons.AiFillHome />,
      cName: "nav-text",
    },
    {
      title: "Rubro",
      path: "/rubro",
      icon: <IoIcons.IoIosPaper />,
      
    },
    {
      title: "Products",
      path: "/productos",
      icon: <FaIcons.FaCartPlus />,
     
    },
    {
      title: "promociones",
      path: "/promociones",
      icon: <FaIcons.FaCartPlus />,
     
    },
    /*
    {
      title: "Team",
      path: "/team",
      icon: <IoIcons.IoMdPeople />,
      cName: "nav-text",
    },
    {
      title: "Messages",
      path: "/messages",
      icon: <FaIcons.FaEnvelopeOpenText />,
      cName: "nav-text",
    },
    {
      title: "Support",
      path: "/support",
      icon: <IoIcons.IoMdHelpCircle />,
      cName: "nav-text",
    },
    */
  ];
  