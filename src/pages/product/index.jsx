import React from "react";
import Image from "next/image";
import Title from "../../components/UI/Title";



const Index = ()=>{
    return <React.Fragment>
        <div className="h-screen flex flex-wrap  items-center md:gap-14 md:p-20 "  >
            <div className="relative lg:flex-1 w-[80%] lg:h-[80%] md:h-[50%] h-[40%] lg:mx-0 mx-20">
                <Image src="/images/f1.png" alt="" fill style={{objectFit:"cover"}} sizes="w-full h-full"/>
            </div>
            <div className="lg:flex-1  lg:text-start text-center ">
                <Title className="text-5xl" >Good Pizza</Title>
                <span className="text-primary text-2xl font-bold underline
            underline-offset-3 inline-block my-4">$10</span>
                <p className="text-sm lg:my-4 lg:pr-24 py-4 lg:mx-0 mx-[1rem]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aperiam consequatur culpa cum eum ex
                    exercitationem id, maiores natus numquam officia officiis recusandae sapiente sed sint tempora
                    voluptatem voluptatibus voluptatum.
                </p>
                <div>
                    <h4 className="font-bold text-xl mb-2">Choose the Size</h4>
                    <div className="flex items-center gap-x-20
                                lg:justify-start justify-center">
                        <div className="relative w-8 h-8">
                            <Image src="/images/size.png" fill sizes="w-full h-full"/>
                            <span className="absolute top-0 -right-6 text-xs
                        bg-primary rounded-full px-[5px] font-medium">
                            Small
                        </span>
                        </div>
                        <div className="relative w-12 h-12">
                            <Image src="/images/size.png" fill sizes="w-full h-full"/>
                            <span className="absolute top-0 -right-8 text-xs
                        bg-primary rounded-full px-[5px] font-medium">
                            Medium
                        </span>
                        </div>
                        <div className="relative w-16 h-16">
                            <Image src="/images/size.png" fill sizes="w-full h-full"/>
                            <span className="absolute top-0 -right-5 text-xs
                        bg-primary rounded-full px-[10px] font-medium">
                            Large
                        </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-x-4 my-6 lg:justify-start justify-center">
                    <label className="flex items-center gap-x-2">
                        <input type="checkbox" className="w-5 h-5 accent-primary  "/>
                        <span className="text-sm font-semibold">ketçap</span>
                    </label>
                    <label className="flex items-center gap-x-2">
                        <input type="checkbox" className="w-5 h-5 accent-primary  "/>
                        <span className="text-sm font-semibold">ketçap</span>
                    </label>
                </div>
                <button className="btn-primary ">Add to Cart</button>
            </div>
        </div>
    </React.Fragment>
}
export default Index;