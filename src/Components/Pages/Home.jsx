import React from "react";
import Navbar from "../Navbar/Navbar";
import LeftSide from "../LeftSidebar/LeftSide";
import RightSide from "../RightSidebar/RightSide";
import MainPage from "../Main/Main";

const Home = () => 
{
    return (
        
        <div className="w-screen h-screen">  
            
            <div className="w-screen h-[6.5%]">
                <Navbar></Navbar>
            </div>

            <div className="w-screen h-[93.5%] flex">
               
                <div className="w-[20%] h-[100%]">
                    <LeftSide></LeftSide>
                </div>

                <div className="w-[60%] h-[100%] flex">
                    <MainPage></MainPage>
                </div>

                <div className="w-[20%] h-[100%] flex">
                    <RightSide></RightSide>
                </div>
           
            </div>

        
        </div>
    
    );
};

export default Home;