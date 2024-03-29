import React, { useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

import Logo from "./../UI/Logo";
import Search from "./../UI/Search";


import { FaUserAlt } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import {GiCancel, GiHamburgerMenu} from "react-icons/gi"
import ShoppingBasket from "./shoppingBasket";

const Header = () => {

  const router = useRouter();
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isMenuModal, setIsMenuModal] = useState(false);
  const [showBasket, setShowBasket] = useState(false);

  return (
    <div className={`h-[5.5rem] z-30 relative 
    ${router.pathname === "/" ? "bg-transparent" : "bg-secondary"}`} >
      <div
        className="container mx-auto text-white flex justify-between
    items-center h-full "
      >
        <div className="flex-1 lg:ml-0 ml-2">
          <Logo />
        </div>
        <nav className={`sm:static absolute top-0 left-0  w-full h-screen  
          sm:text-white text-black sm:w-auto sm:h-auto sm:bg-transparent bg-white sm:flex sm:flex-1 hidden
          ${isMenuModal !== false && "!grid place-content-center"}`} >
          <ul className="flex gap-x-2 sm:flex-row flex-col items-center ">
            <li className="px-[0.313rem] py-[1.25rem] uppercase font-size hover:text-primary cursor-pointer">
              <Link href="/" className={router.pathname === "/" ? "text-primary" : ""}> Home</Link>
            </li>
            <li className="px-[0.313rem] py-[1.25rem] uppercase font-size hover:text-primary cursor-pointer">
              <Link href="/menu" className={router.pathname === "/menu" ? "text-primary" : ""}> Menu</Link>
            </li>
            <li className="px-[0.313rem] py-[1.25rem] uppercase font-size hover:text-primary cursor-pointer">
              <Link href="/about" className={router.pathname === "/about" ? "text-primary" : ""}> About</Link>
            </li>
            <li className="px-[0.313rem] py-[1.25rem] uppercase font-size hover:text-primary cursor-pointer">
              <Link href="/reservation" className={router.pathname === "/reservation" ? "text-primary" : ""}> Book Table</Link>
            </li>
          </ul>
          {isMenuModal && (
              <button className=" absolute top-4 right-4 z-50 text-secondary "
                      onClick={() => setIsMenuModal(false)}>
                <GiCancel
                    size={30}
                    className="hover:text-primary transition-all"
                />
              </button>
          )}
        </nav>
        <div className="flex gap-x-4 items-center relative"
             onMouseEnter={()=>setShowBasket(false)}
        >
          <button onClick={() => setIsSearchModal(true)}>
            <BsSearch className="hover:text-primary transition-all cursor-pointer" />
          </button>
          <Link href="/auth/login" className={router.pathname === "/auth/login" ? "text-primary" : ""}
                onMouseEnter={()=>setShowBasket(false)}>
             <FaUserAlt className="hover:text-primary transition-all cursor-pointer" />
          </Link>

            <ShoppingBasket router={router} isMenuModal={isMenuModal} setShowBasket={setShowBasket} showBasket={showBasket}/>

          <Link href="" className="md:inline-block hidden"
                onMouseEnter={()=>setShowBasket(false)}>
            <button className="btn-primary"> Order Online</button>
          </Link>
          <button
              className="sm:hidden lg:mr-0 mr-2 inline-block"
              onClick={()=>setIsMenuModal(true)}
          >
            <GiHamburgerMenu className="text-xl hover:text-primary transition-all"/>
          </button>

        </div>
      </div>
      {isSearchModal && <Search setIsSearchModal={setIsSearchModal}/>}
    </div>
  );
};

export default Header;
