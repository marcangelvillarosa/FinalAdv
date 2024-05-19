import React from "react";
import { Avatar } from "@material-tailwind/react";
import { useContext } from "react";
import { AuthContext } from "../AppContext/AppContext";

const Comment = ({name, comment, image}) => 
{

    const {user, userData} = useContext(AuthContext);

    return (
        <div className="flex items-center mt-3 w-full pl-8">
            <div className="w-[5%] h-[100%] flex items-center justify-center mr-2">
                <Avatar size="sm" alt="avatar" variant="circular" src={user?.photoURL || require('../pics/nickname.png')}></Avatar>
            </div>
            <div className="flex flex-col items-start bg-gray-300 rounded-lg p-2 pl-4 pr-4">
                <h2 className="text-sm font-semibold">{name}</h2>
                <h1 className="text-m">{comment}</h1>
            </div>
        </div>
    );
}

export default Comment;