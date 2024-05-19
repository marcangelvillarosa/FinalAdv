import React from "react";
import { Tooltip } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const NavLinks = () => 
{
    return(
        <div className="w-[100%] h-[100%] flex justify-center items-center">
             
             <Tooltip content="Home">
                <div className="w-[15%] h-[100%] p-1">
                    <div className="w-[100%] h-[100%] flex justify-center items-center hover:bg-gray-200 rounded-lg">
                        <Link to={"/#"} className="flex items-center justify-center h-[100%] w-[100%]">
                            <img className="w-[15%] h-[40%]" src={require('../pics/home.png')} alt="Home"/>
                        </Link>
                    </div> 
                </div>
            </Tooltip>

            <Tooltip content="Find Friends">
                <div className="w-[15%] h-[100%] p-1">
                    <div className="w-[100%] h-[100%] flex justify-center items-center hover:bg-gray-200 rounded-lg">
                        <Link to={"/Findfriends"} className="flex items-center justify-center h-[100%] w-[100%]">
                            <img className="w-[17%] h-[45%]" src={require('../pics/friends.png')} alt="friends"/>
                        </Link>          
                    </div>
                </div>
            </Tooltip>

            <Tooltip content="Videos">
                <div className="w-[15%] h-[100%] p-1">
                    <div className="w-[100%] h-[100%] flex justify-center items-center  hover:bg-gray-200 rounded-lg">
                        <Link to={"/Videos"} className="flex items-center justify-center h-[100%] w-[100%]">
                            <img className="w-[20%] h-[45%]" src={require('../pics/videos.png')} alt="videos"/> 
                        </Link> 
                    </div>
                </div>
            </Tooltip>
            
            <Tooltip content="Marketplace">
                <div className="w-[15%] h-[100%] p-1">
                    <div className="w-[100%] h-[100%] flex justify-center items-center hover:bg-gray-200 rounded-lg">
                        <Link to={"/Underconstruction"} className="flex items-center justify-center h-[100%] w-[100%]">
                                <img className="w-[15%] h-[35%]" src={require('../pics/marketplace.png')} alt="marketplace"/>
                        </Link>  
                    </div>
                </div>
            </Tooltip>

            <Tooltip content="Groups">
                <div className="w-[15%] h-[100%] p-1">
                    <div className="w-[100%] h-[100%] flex justify-center items-center  hover:bg-gray-200 rounded-lg">
                        <Link to={"/Underconstruction"} className="flex items-center justify-center h-[100%] w-[100%]">
                            <img className="w-[15%] h-[35%]" src={require('../pics/groups.png')} alt="groups"/>
                        </Link>     
                    </div>
                </div>
            </Tooltip>

        </div> 
    );
}

export default NavLinks;