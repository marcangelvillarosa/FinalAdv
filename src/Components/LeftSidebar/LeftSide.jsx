import React, { useContext, useEffect, useState } from "react";
import { Avatar } from "@material-tailwind/react";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";



const LeftSide = () => 
{
    const {user, userData} = useContext(AuthContext);





    return(
        
        <div className="w-[100%] h-[100%] pl-1.5  bg-gray-200">
          <div className="w-[100%] h-[60%]">
          
                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                    
                        <div className="w-[70%] h-[70%] rounded-full flex justify-center items-center">
                            <Avatar src={user?.photoURL || require('../pics/nickname.png')} className="w-[100%] h-[100%]" alt="avatar"></Avatar>
                        </div>
                            
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                  
                        <Link to={'/Profile'}>
                                 <h1 className="text-sm font-semibold">
                                {/* {user?.displayName === null && userData?.name !== undefined ? userData?.name?.charAt(0)?.toUpperCase() + userData?.name?.slice(1) : user?.displayName?.split(" ")[0]}*/}
                                    {user?.displayName === null && userData?.name !== undefined ? userData?.name?.charAt(0)?.toUpperCase() + userData?.name?.slice(1) : user?.displayName}
                                </h1>
                        </Link>
          
                      
                    </div>

                </div>

                <Link to={"/Findfriends"}>
                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[60%]" src={require('../pics/find_friends.png')} alt="findfriends"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Find Friends</h1>
                    </div>

                </div>
                </Link>

                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[60%]" src={require('../pics/memories.png')} alt="memories"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Memories</h1>
                    </div>

                </div>

                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[60%]" src={require('../pics/bookmark.png')} alt="bookmark"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Saved</h1>
                    </div>

                </div>

                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[60%]" src={require('../pics/groups2.png')} alt="groups"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Groups</h1>
                    </div>

                </div>

                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[60%]" src={require('../pics/videos2.png')} alt="videos"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Video</h1>
                    </div>

                </div>

                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[60%]" src={require('../pics/marketplace2.png')} alt="marketplace"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Marketplace</h1>
                    </div>

                </div>

                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[60%]" src={require('../pics/feeds.png')} alt="feeds"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Feeds</h1>
                    </div>

                </div>

                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[53%]" src={require('../pics/events.png')} alt="events"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Events</h1>
                    </div>

                </div>

                <div className=" profile w-[100%] h-[10%] flex">
                    
                    <div className="w-[15%] h-[100%] flex justify-center items-center">
                            <img className="w-[60%]" src={require('../pics/fundraiser.png')} alt="fundraisers"/>
                    </div>

                    <div className="w-[85%] h-[100%] pl-2 flex items-center">
                        <h1 className="text-sm font-semibold">Fundraisers</h1>
                    </div>

                </div>

         </div>  
            

           <div className="w-[100%] h-[40%] flex items-end ">
               
                <div className="w-[100%] h-[20%] flex flex-col">  
                   
                    <div className="flex w-[100%] h-[50%] items-end">
                        <h1 className="text-sm text-gray-700 m-1">Privacy</h1>
                        <h1 className="text-sm text-gray-700 m-1">Terms</h1>
                        <h1 className="text-sm text-gray-700 m-1">Advertising</h1>
                        <h1 className="text-sm text-gray-700 m-1">Adds</h1>
                        <h1 className="text-sm text-gray-700 m-1">Cookies</h1> 
                    </div>    

                    <div className="flex w-[100%] h-[50%] items-start">
                        <h1 className="text-sm text-gray-700 m-1">More</h1>
                        <h1 className="text-sm text-gray-700 m-1">Meta © 2024</h1>
                    </div>   
                   
                </div>
              
           </div>

        </div>
    );
};

export default LeftSide;