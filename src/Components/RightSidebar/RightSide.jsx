import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";
import { Avatar } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { collection, updateDoc, arrayRemove, doc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";



const RightSide = () => 
{

    const [input, setInput] = useState("");

    const {user, userData} = useContext(AuthContext);
    const friendList = userData?.friends;

    const searchFriends = (data) => 
    {
        return data.filter((item) => 
            item["name"].toLowerCase().includes(input.toLowerCase())
        );
    }

    const removeFriend = async (id, name, image) =>
    {
        const q = query(collection(db, "users"), where ("uid", "==", user?.uid));
        const getDoc = await getDocs(q);
        const userDocumentId = getDoc.docs[0].id;

        await updateDoc(doc(db, "users", userDocumentId), {
            friends: arrayRemove({id: id, name: name, image: image}),
        })
    };
    

    return(
        <div className="w-[100%] h-[100%] bg-gray-200">
            
            <div className="w-[100%] h-[9%] flex items-end"><h1 className="text-gray-900 font-bold text-xl">Sponsored</h1></div>
            
            <div className="w-[100%] h-[18%] flex border-b border-gray-500">
                <div className="h-[100%] w-[40%] flex justify-start items-start p-1">
                    <img className="w-[90%] h-[90%]" src={require('../pics/hcdc.png')}/>
                </div>
                <div className="h-[100%] w-[60%] flex justify-center flex-col pb-2">
                    <h1 className="font-bold text-xl text-gray-900">Holy Cross Of Davao College</h1>
                    <h1 className="text-gray-900">studentportal.hcdc.edu.ph</h1>
                </div>
            </div>

            <div className="w-[100%] h-[4%] flex items-center">
                <h1 className="font-semibold text-lg text-gray-900">Contacts</h1>
            </div>

            <div className="w-[100%] h-[69%]">
                <input className="w-[100%] bg-gray-100 rounded-m h-[7%] outline-none p-4 mb-2" name="input" value={input} type="text" placeholder="Search contact" onChange={(e) => setInput(e.target.value)}></input>
                {friendList?.length > 0 ? searchFriends(friendList)?.map((friend) =>{
                    return <div className="friend rounded-xl flex items-center w-[100%] h-[9%]" key={friend.id}>
                        
                            <div className="flex items-center justify-center cursor-pointer w-[20%] h-[100%]">
                                <Avatar size="sm" variant="circular" src={friend?.image || require('../pics/nickname.png')} alt="avatar"></Avatar>
                            </div>
                            <Link to={`/profile/${friend.id}`} className="flex items-center justify-start w-[70%] h-[100%]">
                            <div className="w-[100%] h-[100%] flex items-center">
                                <h1 className="font-semibold text-gray-800 text w-[100%]">{friend.name}</h1>
                            </div>
                            </Link>
                            <div className="w-[10%] h-[100%] flex items-center justify-center cursor-pointer">
                                <img className="w-[35%] h-[25%]" onClick={() => removeFriend(friend.id, friend.name, friend.image)} src={require('../pics/close.png')} alt="unfriend"/>
                            </div>
                        
                    </div>
                }) : <div className="w-[100%] h-[100%] flex justify-center items-center flex-col">
                         <img className="w-[30%]" src={require('../pics/nofriends.png')}/>
                         <h1 className="text-xl">No Friends to Show</h1>
                    </div>}
            </div>
        </div>
    );
};

export default RightSide;