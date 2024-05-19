import React, { useContext, useState } from "react";
import {Input} from "@material-tailwind/react";
import {Button} from "@material-tailwind/react";
import {Typography} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../AppContext/AppContext";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect } from "react";

const Reset = () => 
{
    const [email, setEmail] = useState("");
   

    return(
        <div className="h-screen w-full bg-brown-500 flex flex-col">
          
           <div className="w-full h-[6%] bg-white flex items-center pl-5">
                <h1 className="text-3xl font-semibold text-blue-800">facebook</h1>
           </div>
           
           <div className="w-full h-[46%] bg-gray-200 flex justify-center items-center">
            <div className="h-[65%] w-[25%] bg-white  rounded-md">
                 
                   <div className="w-[100%] h-[20%] flex items-center pl-5 border-b border-gray-400">
                        <h1 className="text-xl font-semibold">Reset Password</h1>
                   </div>
                    
                    <div className="w-[100%] h-[25%] flex justify-center items-center p-1">
                        <Typography className="leading-5 w-[95%]">
                              Enter the email address associated with your account and we'll send you a link to reset your password
                        </Typography>
                    </div>
                   
                   <div className="w-[100%] h-[25%] p-4 flex justify-center items-center">
                        <Input name="email" type="email" label="Email or mobile number" size="lg" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
                   </div>

                   <div className="w-[100%] h-[30%] flex justify-end items-center p-4">
                        <Link to={"/"}>
                              <Button className="bg-gray-400 text-black m-3">Cancel</Button>
                        </Link>
                        <Button className="bg-blue-600">Continue</Button>
                   </div>
   
            </div>
           </div>

           <div className="w-full h-[48%] bg-white flex flex-col items-center justify-center">
           <div className='flex items-center space-x-3 > * + * w-[50%] h-[8%] border-b  border-gray-500 mt-3'>
                    <h1 className='text-xs text-gray-700'>English (UK)</h1>
                    <h1 className='text-xs text-gray-700'>Filipino</h1>
                    <h1 className='text-xs text-gray-700'>Bisaya</h1>
                    <h1 className='text-xs text-gray-700'>Español</h1>
                    <h1 className='text-xs text-gray-700'>日本語</h1>
                    <h1 className='text-xs text-gray-700'>한국어</h1>
                    <h1 className='text-xs text-gray-700'>中文(简体)</h1>
                    <h1 className='text-xs text-gray-700'>العربية</h1>
                    <h1 className='text-xs text-gray-700'>Português (Brasil)</h1>
                    <h1 className='text-xs text-gray-700'>Français (France)</h1>
                    <h1 className='text-xs text-gray-700'>Deutsch</h1>
                </div>    

                 <div className='flex items-center space-x-3 > * + * w-[50%] h-[5%]'>
                    <h1 className='text-xs text-gray-700'>Sign Up</h1>
                    <h1 className='text-xs text-gray-700'>Log in</h1>
                    <h1 className='text-xs text-gray-700'>Messenger</h1>
                    <h1 className='text-xs text-gray-700'>Facebook Lite</h1>
                    <h1 className='text-xs text-gray-700'>Video</h1>
                    <h1 className='text-xs text-gray-700'>Places</h1>
                    <h1 className='text-xs text-gray-700'>Games</h1>
                    <h1 className='text-xs text-gray-700'>Marketplace</h1>
                    <h1 className='text-xs text-gray-700'>Meta Pay</h1>
                    <h1 className='text-xs text-gray-700'>Meta Store</h1>
                    <h1 className='text-xs text-gray-700'>Meta Quest</h1>
                    <h1 className='text-xs text-gray-700'>Meta AI</h1>
                    <h1 className='text-xs text-gray-700'>Instagram</h1>
                    <h1 className='text-xs text-gray-700'>Threads</h1>
                </div>           

                 <div className='flex items-center space-x-3 > * + * w-[50%] h-[5%]'>
                    <h1 className='text-xs text-gray-700'>Fundraisers</h1>
                    <h1 className='text-xs text-gray-700'>Services</h1>
                    <h1 className='text-xs text-gray-700'>Voting Information Centre</h1>
                    <h1 className='text-xs text-gray-700'>Privacy Policy</h1>
                    <h1 className='text-xs text-gray-700'>Privacy Centre</h1>
                    <h1 className='text-xs text-gray-700'>Groups</h1>
                    <h1 className='text-xs text-gray-700'>About</h1>
                    <h1 className='text-xs text-gray-700'>Create ad</h1>
                    <h1 className='text-xs text-gray-700'>Create Page</h1>
                    <h1 className='text-xs text-gray-700'>Developers</h1>
                    <h1 className='text-xs text-gray-700'>Careers</h1>
                    <h1 className='text-xs text-gray-700'>Cookies</h1>
                </div>        

                 <div className='flex items-center space-x-3 > * + * w-[50%] h-[5%]'>
                    <h1 className='text-xs text-gray-700'>AdChoices</h1>
                    <h1 className='text-xs text-gray-700'>Terms</h1>
                    <h1 className='text-xs text-gray-700'>Help</h1>
                    <h1 className='text-xs text-gray-700'>Contact uploading and non-users</h1>
                </div>     

                <div className='flex items-center w-[50%] h-[10%]'>
                    <h1 className='text-xs text-gray-700'>Meta © 2024</h1>
                </div>   

           </div>
            
        </div>
    );
}

export default Reset;