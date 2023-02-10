import Image from "next/image";
import React from "react";
import OutsideClickHandler from "react-outside-click-handler";

import Title from "./Title";
import{GiCancel} from "react-icons/gi"

function Search(props) {
  return (
    <div
      className="fixed w-screen h-screen z-50 top-0 left-0
    after:content-[''] after:w-screen after:h-screen after:bg-white
    after:opacity-60 after:absolute after:top-0 after:left-0  grid place-content-center"
    >
      <OutsideClickHandler onOutsideClick={() => props.setIsSearchModal(false)}>
        <div className="w-full h-full grid place-content-center ">
          <div className="relative z-50 md:w-[37.5rem] w-[23.125rem]
           bg-white border-2 p-5 shadow-lg rounded-3xl">
            <Title className="text-center" >Search</Title>
            <input type="text" placeholder="Search..." 
              className="border w-full my-10"
            />
              <ul >
                <li className="flex items-center justify-between
                p-1 hover:bg-primary transition-all">
                  <div className="relative flex">
                    <Image
                        src="/images/f1.png"
                        alt="f1.png"

                        width={48}
                        height={48}
                        />
                  </div>
                  <span className="font-bold">Good Pizza</span>
                  <span className="font-bold">$10</span>
                </li>

              </ul>
            <button className="absolute top-4 right-4"
            onClick={() => props.setIsSearchModal(false)}>
              <GiCancel
              size={30}
              className="hover:text-primary transition-all"
              />
            </button>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
}

export default Search;
