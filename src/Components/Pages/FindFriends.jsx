import React from "react";
import  Navbar  from "../Navbar/Navbar";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AppContext/AppContext";
import { Button } from "@material-tailwind/react";




const Findfriends = () => {

    const [userDatas, setUserData] = useState([]);
    const { user, userData } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const usersRef = collection(db, "users");
            const usersSnapshot = await getDocs(usersRef);
            const data = usersSnapshot.docs.map((doc) => doc.data());
            setUserData(data);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
      
        fetchUserData();
      }, []);

     


    return(
        <div className="w-screen h-screen bg-red-200">
             <div className="w-screen h-[6.5%]">
                <Navbar></Navbar>
            </div>
           
            <div className="w-[100%] h-[93.5%] bg-gray-200 flex items-center justify-center overflow-y-scroll ">
               
                <div className="w-[60%] h-[100%] flex flex-col items-center">
                    
                    <div className="w-[100%] h-[12%] flex items-end p-2">
                        <h1 className="text-2xl font-semibold">Find Friends</h1>
                    </div>
                    
                    <div className="w-[100%] flex flex-col">

                        <div className="w-[100%] flex flex-col">
                          
                             <div className="w-[100%] flex flex-row items-center">
                              {userDatas.slice(0,6).map((user, index) => {
                                      if (user.uid !== user.uid || user.uid !== userData.uid) {
                                          return (  
                                            <div className="flex flex-col justify-center items-center">
                                                  <div className="w-48 flex flex-col bg-white rounded-lg items-center m-2 rounded-bl-lg rounded-br-lg">
                                                    <div className="w-[100%] h-52 relative"><img className="w-[100%] h-[100%] absolute object-cover object-center rounded-tl-lg rounded-tr-lg" src={user.image || user.photoURL || require('../pics/nickname.png')} alt={user.name}></img></div>
                                                    <div className="w-[100%] flex items-center p-1"><h1 className="text-sm font-semibold relative">{user.name && user.name.split(' ').slice(0, 2).join(' ')}</h1></div>
                                                    <div className="w-[100%]"><h1 className="text-xs left-1 relative text-blue-500">{user.email}</h1></ div>
                                                    <div className="w-[100%] flex items-center justify-center pl-1 pr-2"><Button className="w-[95%] bg-blue-800 mt-1 mb-1" size="m">Add Friend</Button></div>
                                                    <div className="w-[100%] flex items-center justify-center pl-1 pr-2"><Button className="w-[95%] bg-gray-800 mb-3" size="m">Remove</Button></div>
                                                  </div> 
                                            </div>      
                                          );
                                      }
                                  return null; 
                                   })}
                              </div>    

                             
                             

                        </div>


                    </div>
                </div>
            </div>

        </div>
    );
}

export default Findfriends;