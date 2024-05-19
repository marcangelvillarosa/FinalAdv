import React from "react";
import { Avatar } from "@material-tailwind/react";

const profilePost = ({name, comment, image}) => 
{
    return (
        <div className="flex items-center mt-3 w-full pl-8">
            <div className="w-[5%] h-[100%] flex items-center justify-center mr-2">
                <Avatar size="sm" alt="avatar" variant="circular" src={image || require('../pics/nickname.png')}></Avatar>
            </div>
            <div className="flex flex-col items-start bg-gray-300 rounded-xl p-2 pl-5 pr-5">
                <h2 className="text-xs font-semibold">{name}</h2>
                <h1 className="text-m">{comment}</h1>
            </div>
        </div>
    );
}

export default profilePost;