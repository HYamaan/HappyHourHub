import React from "react";
import Image from "next/image";
import Title from "./UI/Title";
import Button from "./UI/Button";
import ChatBox from "./layout/ChatBox";

const About = () => {
  return (
    <React.Fragment>
      <div className="bg-secondary py-20 ">
        <div className="container mx-auto flex justify-center items-center lg:gap-20 gap-10 text-white sm:flex-nowrap flex-wrap">
          <div className="sm:order-1 order-2">
            <div className="relative md:w-[445px] sm:w-[384px] w-[345px] md:h-[600px] sm:h-[525px] h-[472px]">
              <Image
                src="/images/about-img.png"
                alt="about-img.png"
                priority={true}
                fill
                sizes="w-full h-full"
              />
            </div>
          </div>
          <div className="sm:order-2 order-1 md:w-[555px] md:p-0 px-3 ">
            <Title className="text-[40px]"> We Are Feane</Title>
            <p className="mt-4 mb-6 ">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which dont look even slightly
              believable. If you are going to use a passage of Lorem Ipsum, you
              need to be sure there isnt anything embarrassing hidden in the
              middle of text. All
            </p>

            <Button>Read More</Button>
          </div>
        </div>
      </div>
      <ChatBox/>
    </React.Fragment>
  );
};
export default About;
