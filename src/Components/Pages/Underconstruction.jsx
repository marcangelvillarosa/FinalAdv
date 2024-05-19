import React from "react";
import Navbar from "../Navbar/Navbar";

const Underconstruction = () => {
    return(
        <div className="w-screen h-screen bg-green-200">
            <div className="w-screen h-[6.5%]">
                <Navbar></Navbar>
            </div>
          
            <div className="w-[100%] h-[93.5%] bg-gray-200 flex flex-col justify-center items-center">
                    <div className="w-[100%] flex items-center justify-center mb-3">
                        <h1 className="text-5xl font-semibold z-10 text-blue-200">PAGE IS UNDER CONSTRUCTION</h1>
                    </div>
                   <div className="w-[100%] flex  items-center justify-center mt-3">
                        <h1 className="w-[56%] z-10 text-xl text-gray-800 text-center">Sorry for any inconvenience caused by our ongoing updates. We're in the process of making improvements to our website to better serve you. Thank you for your patience as we work to enhance your experience. Stay tuned for exciting changes!</h1>
                   </div>     
            </div>

        </div>
    );
}

export default Underconstruction