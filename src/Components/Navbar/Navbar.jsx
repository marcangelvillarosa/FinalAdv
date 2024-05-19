import React from "react";
import NavLinks from "./NavLinks";
import UserLinks from "./UserLinks";

const Navbar =() =>
{
    return (
        <div className="w-screen h-[100%] flex bg-white shadow-2xl  border-b border-gray-300">
            
            {/*Facebook logo */}
            <div className="w-[25%] h-[100%] flex">
                
                <div className="h-[100%] w-[20%] flex justify-center items-center">
                    <img className="w-[50%] h-[70%]" src={require('../pics/facebook.png')} alt="logo"/>  
                </div>

                <div className="h-[100%] w-[80%] flex  items-center text-blue-800">
                    <h1 className="text-3xl font-semibold">Facebook</h1>
                </div>

            </div>

            {/*navigation*/}
            <div className="h-[100%] w-[50%]">

                <div className="w-[100%] h-[100%] flex justify-center items-center">
                    <NavLinks></NavLinks>
                </div>

            </div>

            {/*profile*/}
           <div className="h-[100%] w-[25%]">
               
                <div className="w-[100%] h-[100%] flex justify-center items-center">
                    <UserLinks></UserLinks>
                </div>

           </div>
            
        </div>

    );
};

export default Navbar;