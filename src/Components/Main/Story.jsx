import React from "react";
import { Avatar } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AppContext/AppContext";
import { Button } from "@material-tailwind/react";
import { getStorage, listAll, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";


const Story = () => 
{

    const [userDatas, setUserData] = useState([]);
    const { user, userData } = useContext(AuthContext);
    const [imageUrls, setImageUrls] = useState([]);
    const { id } = useParams();

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

      useEffect(() => {
        const fetchImages = async () => {
            try {
                if (user) {
                    const storage = getStorage();
                    const imagesRef = ref(storage, `profile-images/${id}`);
                    const imageList = await listAll(imagesRef);
                    const urls = await Promise.all(imageList.items.map(async (item) => {
                        return getDownloadURL(item);
                    }));
                    
                    // Filter the image URLs based on the user's ID
                    const userImageUrls = urls.filter(url => url.includes(id)); // Adjust the condition based on your URL structure
                    
                    setImageUrls(userImageUrls);
                    console.log(imagesRef);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        
        fetchImages();
    }, [user, id]);

    

    
    return(
        <div className="w-[100%] h-64 flex justify-center items-center">
            
            <div className="w-[63%] h-[100%] flex overflow-x-scroll">
                {userDatas.slice(0,6).map((user, index) => {
                 if (user.uid == user.uid || user.uid == userData.uid) {
                     return (  
                         <div className="flex flex-col justify-center items-center relative h-[100%]">
                              <div className="w-44 h-[100%] flex flex-col bg-white rounded-lg items-center m-2 rounded-bl-lg rounded-br-lg relative">
                                    <div className="w-[100%] h-[25%] relative flex items-center pl-2 z-30"><Avatar size="m" className="object-cover object-center border-4 border-blue-600" src={user.image || user.photoURL || require('../pics/nickname.png')} alt={user.name}></Avatar></div>
                                    <div className="w-[100%] h-[100%] absolute"> 
                                          {userDatas.slice(0,1).map((url, index) => (
                                              <img className="w-[100%] h-[100%] object-cover rounded-lg" key={index} src={user.image || user.photoURL || require('../pics/nickname.png')} alt={`Image ${index}`} /> 
                                          ))}
                                    </div>
                                    <div className="w-[100%] h-[25%] flex items-center pl-2    z-30 absolute bottom-0"><h1 className="text-sm font-semibold relative text-white">{user.name && user.name.split(' ').slice(0, 2).join(' ')}</h1></div>
                              </div> 
                          </div>      
                            );
                             }
                    return null; 
                            })}
            </div>

        </div>
    );
};

export default Story;