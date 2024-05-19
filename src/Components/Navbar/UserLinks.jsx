import React, { useContext } from "react";
import { Avatar, Tooltip, avatar } from "@material-tailwind/react";  
import { AuthContext } from "../AppContext/AppContext";

const UserLinks = () => 
{

    const{ signOutUser } = useContext(AuthContext);
    const {user, userData} = useContext(AuthContext);

    return (
        <div className="h-[100%] w-[100%] flex justify-end items-center pr-3">

        <div className="w-[12%] h-[100%] flex justify-center items-center">
            <div className="menu-div w-[78%] h-[65%] rounded-full flex justify-center items-center">
               <img className="menu" src={require('../pics/menu.png')} alt="menu"/>
            </div>
        </div>

        <div className="w-[12%] h-[100%]  flex justify-center items-center">
            <div className="messenger-div w-[78%] h-[65%] rounded-full flex justify-center items-center">
               <img className="messenger" src={require('../pics/messenger.png')} alt="messenger"/>
            </div>
        </div>

        <div className="w-[12%] h-[100%] flex justify-center items-center">
             <div className="notifications-div w-[78%] h-[65%] rounded-full flex justify-center items-center">
               <img className="notifications" src={require('../pics/notifications.png')} alt="notifications"/>
             </div>
        </div>

        <div className="w-[12%] h-[100%] flex justify-center items-center" onClick={signOutUser}>
             <Tooltip content="Log out">
             <div className="accounts-div w-[78%] h-[65%] rounded-full bg-gray-300 flex justify-center items-center">
                <Avatar src={user?.photoURL || require('../pics/nickname.png')} className="w-[100%] h-[100%]" alt="avatar"></Avatar>
             </div>
             </Tooltip>
        </div>

    </div>

    );
};

export default UserLinks;
