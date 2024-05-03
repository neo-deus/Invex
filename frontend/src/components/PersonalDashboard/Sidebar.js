"use client"
import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { TiContacts } from "react-icons/ti";
import { FiMail } from "react-icons/fi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const sidebarItems = [
  {
    name: "Home",
    href: "/",
    icon: AiOutlineHome,
  },
  {
    name: "About",
    href: "/about",
    icon: BsPeople,
  },
  {
    name: "Mails",
    href: "/mails",
    icon: FiMail,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: TiContacts,
  },
];

const Sidebar = () => {
  const [isCollapsed, settoggleSidebarcollapse] = useState(true);

  const toggleSidebarcollapse = () => {
    settoggleSidebarcollapse((prevState) => !prevState);
  };

  return (
    <div className="sidebar__wrapper fixed z-50 bg-white h-full">
      <button className="btn absolute right-0 top-20 translate-x-1/2 bg-white border-0 z-50 w-6 h-6 rounded-full flex justify-center items-center cursor-pointer text-lg" onClick={toggleSidebarcollapse}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
        {console.log(isCollapsed)}
      </button>
      <aside className="sidebar w-52 h-full p-4 transition-all duration-400 ease-linear" data-collapse={isCollapsed}>
        <div className="sidebar__top w-max flex items-center gap-4 pb-2 mb-2 ">
          <Image
            width={80}
            height={80}
            className="sidebar__logo object-cover "
            src="/fin.png"
            alt="logo"
          />
          <p className="sidebar__logo-name text-lg font-semibold">Finnest</p>
        </div>
        <ul className="sidebar__list list-none ">
          {sidebarItems.map(({ name, href, icon: Icon }) => {
            return (
              <li className="sidebar__item" key={name}>
                <Link
                  className="sidebar__link text-base no-underline text-black py-3 px-4 flex bg-gray-100 mb-4 rounded-lg"
                  href={href}
                >
                  <span className="sidebar__icon text-xl inline-block">
                    <Icon />
                  </span>
                  <span className="sidebar__name ml-2">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;