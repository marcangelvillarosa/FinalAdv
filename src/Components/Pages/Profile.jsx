import React, {  useReducer, useEffect, useState, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import { useRef } from 'react';
import { Avatar, Alert } from "@material-tailwind/react";
import { collection, setDoc, doc, serverTimestamp, orderBy, query, onSnapshot, where, getDocs, getDoc, documentId, writeBatch, updateDoc, addDoc, arrayRemove } from "firebase/firestore";
import {db} from "../firebase/firebase";    
import { Button } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { getStorage, ref, listAll, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { PostsReducer, postsStates, postActions } from "../AppContext/PostReducer";
import firebase from "firebase/compat/app";
import { getFirestore } from 'firebase/firestore';
import { AuthContext } from "../AppContext/AppContext";
import PostCard from "../Main/PostCard";
import { updateProfile } from 'firebase/auth';
import Profilepostcard from "../Main/profilePostcard";
import { Link } from "react-router-dom";



const Profile = () => 
{

  const { user, userData } = useContext(AuthContext);
  const text = useRef("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const collectionRef = collection(db, "posts");
  const postRef = collection(db, "posts");
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const { SUBMIT_POST, HANDLE_ERROR } = postActions;
  const [progressBar, setProgressBar] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);

  const [userDatas, setUserData] = useState([]);

  const { users } = useContext(AuthContext);
  const [progress, setProgress] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [toggle, setToggle] = useState(1);
  function updateToggle(id){
    setToggle(id); 
  }

  const toggleForm = () => {
      setShowForm(!showForm);
  };
  const handleCloseForm = () => {
    setShowForm(false);
};

  const handleUploads = async () => {
    try {
      const storageRef = ref(storage, `profile-images/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);
        },
        (error) => {
          console.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, {
            photoURL: downloadURL    
          });
          // Update profile picture in all posts authored by the user
          const postsQuery = query(collection(db, "posts"), where("uid", "==", user?.uid));
          const postsQuerys = query(collection(db, "users"), where("uid", "==", user?.uid));
          const postsSnapshot = await getDocs(postsQuery);
          const postsSnapshots = await getDocs(postsQuerys);
          const batch = writeBatch(db);
          postsSnapshot.forEach((postDoc) => {
            const postRef = doc(db, "posts", postDoc.id);
            batch.update(postRef, { logo: downloadURL });
          });
          postsSnapshots.forEach((postDoc) => {
            const postRef = doc(db, "users", postDoc.id);
            batch.update(postRef, { image: downloadURL });
          });
          await batch.commit();
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    
    if (!file || !(file instanceof Blob)) {
      console.error("Invalid file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  
  };

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
        const storage = getStorage();
        const imagesRef = ref(storage, `profile-images/${user.uid}`);
        const imageList = await listAll(imagesRef);
        const urls = await Promise.all(imageList.items.map(async (item) => {
          return getDownloadURL(item);
        }));
        setImageUrls(urls);
        console.log(imagesRef);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    if (user) {
      fetchImages();
    }
  }, [user]);


  const handleUpload = (e) => {
      setFile(e.target.files[0]);
    };

    const handleSubmitPost = async (e) => {
      e.preventDefault();
      if (text.current.value !== "") {
        try {
          await setDoc(postRef, {
            documentId: document,
            uid: user?.uid || userData?.uid,
            logo: user?.photoURL,
            name: user?.displayName || userData?.name,
            email: user?.email || userData?.email,
            text: text.current.value,
            image: image,
            timestamp: serverTimestamp(),
          });
          text.current.value = "";
        } catch (err) {
          dispatch({ type: HANDLE_ERROR });
          alert(err.message);
          console.log(err.message);
        }
      } else {
        dispatch({ type: HANDLE_ERROR });
      }
    };
    
    const storage = getStorage();
    const metadata = {
      contentType: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ],
    };

    const submitImage = async () => {
      const fileType = metadata.contentType.includes(file["type"]);
      if (!file) return;
      if (fileType) {
        try {
          const storageRef = ref(storage, `images/${file.name}`);
          const uploadTask = uploadBytesResumable(
            storageRef,
            file,
            metadata.contentType
          );
          await uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgressBar(progress);
            },
            (error) => {
              alert(error);
            },
            async () => {
              await getDownloadURL(uploadTask.snapshot.ref).then(
                (downloadURL) => {
                  setImage(downloadURL);
                }
              );
            }
          );
        } catch (err) {
          dispatch({ type: HANDLE_ERROR });
          alert(err.message);
          console.log(err.message);
        }
      }
    };

    useEffect(() => {
      const fetchUserPosts = async () => {
        try {
          const q = query(collectionRef, where("uid", "==", user?.uid || userData?.uid), orderBy("timestamp", "asc"));
          await onSnapshot(q, (snapshot) => {
            dispatch({
              type: SUBMIT_POST,
              posts: snapshot.docs.map((doc) => doc.data()),
            });
            setImage(null);
            setFile(null);
            setProgressBar(0);
          });
        } catch (error) {
          console.error("Error fetching user posts:", error);
          dispatch({ type: HANDLE_ERROR });
        }
      };
  
      fetchUserPosts();
    }, [SUBMIT_POST, user, userData]);
    
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
      const fetchUserCount = async () => {
        try {
          const usersCollectionRef = collection(db, 'users');
          const querySnapshot = await getDocs(usersCollectionRef);
          const count = querySnapshot.size;
          setUserCount(count);
        } catch (error) {
          console.error('Error getting users count:', error);
        }
      };
      fetchUserCount();
    }, []);

    const [input, setInput] = useState("");

    const friendList = userData?.friends;

    const searchFriends = (data) => {
      if (!data) {
          return []; // Return an empty array if data is undefined or null
      }
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

    const filteredFriends = searchFriends(friendList);
    const friendCount = filteredFriends.length;

    return (
        <div className="w-screen h-screen bg-gray-200 overflow-y-scroll overflow-x-hidden">
           
            {showForm && (
                <div className="popup-form w-screen h-screen absolute bg-black z-20 opacity-90 flex items-center justify-center flex-col">   

                           <div className="w-[100%] h-[60%] flex items-center justify-center">
                                <div className="w-[25%] h-[80%] bg-white rounded-full">
                                    {previewUrl && <img className="w-[100%] h-[100%] object-cover rounded-full" src={previewUrl}/>}    
                                </div>
                            </div>
                            <div className="w-[100%] h-[40%] flex flex-col items-center">
                               <div className="w-[15%] h-[10%]">
                                   {progress > 0 && <progress className="w-[100%] " value={progress} max="100"/>}
                                </div>
                               <div className="w-[10%] flex items-center justify-center">
                                    <div className="w-[51.6%] bg-black flex items-center justify-center">
                                        <input type="file"onChange={handleFileChange}/>
                                    </div>
                               </div>
                                <div className=" h-[15%] flex items-center justify-center mt-2">
                                    <Button className="bg-blue-600" onClick={handleUploads}>Update Profile Picture</Button>
                                </div>
                            </div>   

                          <div className="w-[5%] h-[5%] absolute right-0 top-0 flex items-center justify-center">
                            <img className="w-[30%] cursor-pointer" src={require("../pics/closewhite.png")}  onClick={handleCloseForm}/>
                          </div>                         
                </div> 
            )}
  
            
            <div className="w-screen h-[6.5%]">
                <Navbar></Navbar>
            </div>

            <div className="w-[100%] h-[70%] bg-white flex items-center justify-center flex-col mb-2">
                
                <div className="w-[68.4%] h-[65%] bg-gray-300 rounded-bl-xl rounded-br-xl flex items-center justify-center"> 
                      {imageUrls.slice(0,1).map((url, index) => (
                          <div className="w-[100%] h-[100%] flex flex-col items-center justify-center"> 
                               <img className="w-[100%] h-[100%] object-cover rounded-bl-xl rounded-br-xl" key={index} src={url} alt={`Image ${index}`} />     
                           </div>
                      ))}    
                </div>

                <div className="w-[68.4%] h-[35%] flex items-center justify-center flex-col">
                    
                    <div className="w-[100%] h-[70%] flex items-center justify-center">

                        <div className="w-[15%] h-[100%]">
                            <div className="w-[87%] h-[100%] rounded-full relative bottom-8">                           
                              <Avatar variant="circular" className="w-[100%] h-[100%] object-cover" src={ user?.image || user?.photoURL || require('../pics/nickname.png')} alt="avatar"></Avatar>                               
                            </div>
                        </div>
                        
                        <div className="w-[40%] h-[100%]">
                           
                              <div className="w-[100%] h-[43%] flex items-end pb-2"> 
                                  <h1 className="font-semibold text-3xl"> {user?.displayName === null && userData?.name !== undefined ? userData?.name?.charAt(0)?.toUpperCase() + userData?.name?.slice(1) : user?.displayName}</h1>                       
                              </div>
                            
                              <div className="w-[100%] h-[20%] flex items-start">
                                  <h1 className="font-semibold text-gray-800">{friendList?.length || 0} friends</h1>
                              </div>
                              
                              <div className="w-[100%] h-[37%] relative flex flex-row">
                                  {friendList && friendList.map((friend) => (
                                      <Avatar size="sm" key={friend.id} src={friend.image} alt={friend.name} />
                                  ))} 
                              </div>

                        </div>
                        
                      <div className="w-[40%] h-[100%]">
                            <div className="w-[100%] h-[50%]">

                            </div>

                          <div className="w-[100%] h-[50%] flex justify-end items-center relative">
                             <div className="w-[30%] h-[42%] m-1">
                                <Button className="w-[100%] h-[100%] bg-blue-700 flex items-center justify-center"><span className="text-lg mr-2">+</span> Add Story</Button>
                             </div>
                             <div className="w-[28%] h-[42%] m-1">
                                <Button className="w-[100%] h-[100%] flex items-center justify-center bg-gray-300"><h1 className="text-xs text-black" onClick={toggleForm}>Update Profile</h1></Button>
                             </div>
                             <div className="w-[10%] h-[42%] m-1">
                                <Button className="w-[90%] h-[100%] flex items-center justify-center bg-gray-300 text-black text-lg">...</Button>
                             </div>
                          </div>

                          </div>

                      </div>

                    <div className="w-[95%] h-[30%] relative p-2 flex items-center border-t border-gray-500">
                       <div className="w-[7%] h-[100%] flex items-center justify-center cursor-pointer rounded-lg hover:bg-gray-200" onClick={() => updateToggle(1)}> 
                            <h1 className="font-semibold text-sm">Posts</h1>
                       </div>
                       <div className="w-[7%] h-[100%] flex items-center justify-center cursor-pointer rounded-lg  hover:bg-gray-200" onClick={() => updateToggle(2)}> 
                            <h1 className="font-semibold text-sm">About</h1>
                       </div>
                       <div className="w-[7%] h-[100%] flex items-center justify-center cursor-pointer rounded-lg  hover:bg-gray-200" onClick={() => updateToggle(3)}> 
                            <h1 className="font-semibold text-sm">Friends</h1>
                       </div>
                       <div className="w-[7%] h-[100%] flex items-center justify-center cursor-pointer rounded-lg  hover:bg-gray-200" onClick={() => updateToggle(4)}> 
                            <h1 className="font-semibold text-sm">Photos</h1>
                       </div>
                       <div className="w-[7%] h-[100%] flex items-center justify-center cursor-pointer rounded-lg  hover:bg-gray-200"> 
                            <h1 className="font-semibold text-sm">Check-ins</h1>
                       </div>
                       <div className="w-[7%] h-[100%] flex items-center justify-center cursor-pointer rounded-lg  hover:bg-gray-200"> 
                            <h1 className="font-semibold text-sm">More</h1>
                       </div>

                       <div className="w-[5%] h-[50%] right-2 absolute flex items-center justify-center bg-gray-200 cursor-pointer rounded-lg"> 
                            <h1 className="font-semibold text-sm">...</h1>
                       </div>
                    </div>
               
                </div>

            </div>

            <div  className={toggle === 1?  "show-content" : "content"}>
                
                <div className="w-[26%] h-[100%] flex flex-col items-end relative">
                    
                      <div className="w-[93.5%] bg-white rounded-lg mb-5 flex flex-col p-2">
                           <div className="w-[100%] h-14 flex items-center">
                               <h1 className="font-semibold text-2xl">Intro</h1>
                            </div>
                            <div className="w-[100%] h-10 flex items-center">
                                <img className="w-[4.5%] h-[50%] mr-3" src={require("../pics/gmail.png")}/>
                                <h1 className="text-blue-500">{user?.email}</h1>
                            </div>

                            <div className="w-[100%] h-64 flex">

                              <div className="w-[100%] h-[100%] relative flex flex-row items-center">
                                      {imageUrls.slice(0, 3).map((url, index) => (
                                        <div className="w-36 h-[100%] m-1 flex flex-col items-center justify-center"> 
                                            <img className="w-[100%] h-[90%] object-cover rounded-xl" key={index} src={url} alt={`Image ${index}`} /> 
                                            <h1 className="text-sm font-semibold">Featured</h1>
                                        </div>
                                        ))}           
                              </div>
                             
                            </div>
                      </div>

                      <div className="w-[93.5%] bg-white rounded-lg mb-5 p-2">
                         
                          <div className="w-[100%] h-10 flex items-center relative">
                              <h1 className="font-semibold text-2xl">Photos</h1>
                              <h1 className="text-m absolute right-0 text-blue-500">See all photos</h1>
                          </div>    

                          
                              <div className="w-[100%] h-32 flex mb-1">              
                                 
                                 <div className="w-[33%] h-[100%] relative mr-1">
                                    {imageUrls.slice(0, 1).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover rounded-tl-lg" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                                  <div className="w-[33%] h-[100%] relative">
                                    {imageUrls.slice(1, 2).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                                  <div className="w-[33%] h-[100%] relative ml-1">
                                    {imageUrls.slice(2, 3).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover rounded-tr-lg" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                              </div>         

                              <div className="w-[100%] h-32 flex mb-1">              
                                 
                                 <div className="w-[33%] h-[100%] relative mr-1">
                                    {imageUrls.slice(3, 4).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                                  <div className="w-[33%] h-[100%] relative">
                                    {imageUrls.slice(4, 5).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                                  <div className="w-[33%] h-[100%] relative ml-1">
                                    {imageUrls.slice(5, 6).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                              </div>         

                              <div className="w-[100%] h-32 flex mb-3">              
                                 
                                 <div className="w-[33%] h-[100%] relative mr-1">
                                    {imageUrls.slice(6, 7).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover rounded-bl-lg" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                                  <div className="w-[33%] h-[100%] relative">
                                    {imageUrls.slice(7, 8).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                                  <div className="w-[33%] h-[100%] relative ml-1">
                                    {imageUrls.slice(8, 9).map((url, index) => (
                                      <img className="w-[100%] h-[100%] mr-2 object-cover rounded-br-lg" key={index} src={url} alt={`Image ${index}`} />
                                      ))}
                                  </div>

                              </div>         
                          
                      </div>

                      <div className="w-[93.5%] bg-white rounded-lg relative flex flex-col p-2">
                         
                         <div className="w-[100%] h-10 flex items-center pl-1">
                              <h1 className="font-semibold text-2xl">Friends</h1>
                         </div>

                          <div className="w-[100%] flex flex-col relative">
                              
                              <div className="w-[100%] flex mb-2">
                                {friendList && friendList.slice(0,4).map((user, index) => {
                                      if (user.uid !== user.uid || user.uid !== userData.uid) {
                                          return (  
                                            <div className="w-40 h-[100%] flex flex-col">
                                                  <div className="w-[100%] h-[100%]flex flex-col items-center">
                                                    <div className="w-[93%] h-32"><img className="w-[100%] h-[98%] object-cover rounded-lg" src={user.image || user.photoURL || require('../pics/nickname.png')} alt={user.name}></img></div>
                                                    <div className="w-[100%] h-[13%]"><h1 className="text-xs left-1 relative">{user.name && user.name.split(' ').slice(0, 2).join(' ')}</h1></div>
                                                  </div> 
                                            </div>      
                                          );
                                      }
                                      return null; 
                                  })}
                              </div>

                              <div className="w-[100%] flex mb-2">
                                {friendList && friendList.slice(4,8).map((user, index) => {
                                      if (user.uid !== user.uid || user.uid !== userData.uid) {
                                          return (  
                                            <div className="w-40 h-[100%] flex flex-col">
                                                  <div className="w-[100%] h-[100%]flex flex-col items-center">
                                                    <div className="w-[93%] h-32"><img className="w-[100%] h-[98%] object-cover rounded-lg" src={user.image || user.photoURL || require('../pics/nickname.png')} alt={user.name}></img></div>
                                                    <div className="w-[100%] h-[13%]"><h1 className="text-xs left-1 relative">{user.name && user.name.split(' ').slice(0, 2).join(' ')}</h1></div>
                                                  </div> 
                                            </div>      
                                          );
                                      }
                                      return null; 
                                  })}
                              </div>

                              <div className="w-[100%] flex mb-2">
                                {friendList && friendList.slice(8, 12).map((user, index) => {
                                      if (user.uid !== user.uid || user.uid !== userData.uid) {
                                          return (  
                                            <div className="w-40 h-[100%] flex flex-col">
                                                  <div className="w-[100%] h-[100%]flex flex-col items-center">
                                                    <div className="w-[93%] h-32"><img className="w-[100%] h-[98%] object-cover rounded-lg" src={user.image || user.photoURL || require('../pics/nickname.png')} alt={user.name}></img></div>
                                                    <div className="w-[100%] h-[13%]"><h1 className="text-xs left-1 relative">{user.name && user.name.split(' ').slice(0, 2).join(' ')}</h1></div>
                                                  </div> 
                                            </div>      
                                          );
                                      }
                                      return null; 
                                  })}
                              </div>
                  
                          </div>                
  
                      </div>
                
                      <div className="w-[93.5%] pt-5 pb-5 rounded-lg mt-2 flex items-center justify-center">
                          <h1 className="text-sm m-1">Privacy</h1>
                          <h1 className="text-sm m-1">Terms</h1>
                          <h1 className="text-sm m-1">Advertising</h1>
                          <h1 className="text-sm m-1">Ad Choices</h1>
                          <h1 className="text-sm m-1">Cookies</h1>  
                          <h1 className="text-sm m-1">More</h1>  
                          <h1 className="text-sm m-1">Meta © 2024</h1>  
                      </div>
  
                </div>
               
               <div className="w-[42%] h-[100%] relative">

                <div className="w-[100%] h-[100%] flex items-center flex-col overflow-y-scroll relative">
                       
                    <div className="w-[92%] min-h-40 flex justify-center items-center">
                        
                    <form className="w-[100%] h-40 flex justify-center" onSubmit={handleSubmitPost}>
                    
                    <div className="h-[85%] w-[100%] bg-white rounded-lg flex justify-center items-center flex-col">
                        
                        <div className="w-[100%] h-[50%] flex">
                            <div className="w-[12%] h-[100%] flex justify-center items-center">
                               <div className=" bg-gray-500 flex justify-center items-center rounded-full">
                                    <Avatar variant="circular" src={user?.photoURL ||require('../pics/nickname.png')} alt="avatar"></Avatar>
                               </div>
                            </div>
                            <div className="w-[73%] h-[100%] flex justify-center items-center relative">
                                <input type="text" name="text" ref={text}  placeholder={`Whats on your mind ${user?.displayName?.split(" ")[0] || userData?.name?.charAt(0).toUpperCase() + userData?.name?.slice(1)}`} className="w-[100%] h-[70%] outline-none rounded-l-full pl-5 bg-gray-100"></input>
                            </div>
                            
                            <div className="w-[15%] h-[100%] flex items-center">
                                <button varient="text" className="pl-2 pr-2 bg-gray-100 text-black w-[80%] h-[70%] text-sm rounded-r-full" type="submit">Post</button>
                            </div>
                        </div>

                        <div className="w-[95%] h-[0.1%] bg-gray-800 "></div>

                        <span style={{ width: `${progressBar}%` }} className="bg-blue-700 h-[2%] rounded-2xl"></span>

                        <div className="w-[100%] h-[49.9%] flex justify-center items-center p-2">
                            
                            <div className="w-[30%] h-[100%] flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-lg">
                                <div className="w-[30%] h-[100%] flex justify-center items-center">
                                    <img className="w-[40%]" src={require('../pics/live.png')} alt="placeholder"/>
                                </div>
                                 <div className="w-[45%] h-[100%]  flex justify-center items-center">
                                    <h1 className="text-sm font-semibold text-black">Live video</h1>
                                </div>
                            </div>
                            
                             <div className="w-[30%] h-[100%] flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-lg">
                                <div className="w-[30%] h-[100%] flex justify-center items-center">
                                    <label htmlFor="addImage" className="cursor-pointer flex items-center">
                                            <img className="w-[100%]" src={require('../pics/upload.png')} alt="addImage"></img>
                                            <input id="addImage" type="file" style={{ display: "none" }} onChange={handleUpload}></input>      
                                    </label>
                                 </div>
                                 <div>
                                     {!file && <h1 className="text-sm font-semibold text-black">Photo/Video</h1>}  
                                     {file && (<Button variant="text" onClick={submitImage} className="text-black p-4 hover:bg-inherit active:bg-inherit">Upload</Button>)}
                                 </div>
                            </div>

                            <div className="w-[30%] h-[100%] flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-lg">
                                <div className="w-[30%] h-[100%] flex justify-center items-center">
                                    <img className="w-[40%]" src={require('../pics/feeling.png')} alt="placeholder"/>
                                </div>
                                 <div className="w-[50%] h-[100%] flex justify-center items-center">
                                    <h1 className="text-sm font-semibold text-black">Feeling/Activity</h1>
                                </div>
                            </div>
                                
                        </div>
                       
                    </div>

                    <div className="h-[72%] object-cover relative flex items-center justify-center ml-2">
                        <div className="object-cover h-[100%] w-[100%] flex items-center justify-center">
                            {image && <img className="rounded-xl w-[100%] h-[100%] object-cover" src={image} alt="previewImage"></img>}
                        </div>
                    </div>
                </form>

                    </div>

                    <div className="w-[100%] h-[48%]">
                            {state.error ?
                            (
                            <div className="flex justify-center items-center">
                              <Alert color="red">
                                Something went wrong please try again later
                              </Alert>
                            </div>
                            ) : (
                              <div>
                                {state?.posts?.length > 0 &&
                                  state?.posts?.map((post, index) => {
                                    return (
                                      <Profilepostcard
                                        key={index}
                                        logo={post?.logo}
                                        id={post?.documentId}
                                        uid={post?.uid}
                                        name={post?.name}
                                        email={post?.email}
                                        image={post?.image}
                                        text={post?.text}
                                        timestamp={new Date(
                                          post?.timestamp?.toDate()
                                        )?.toUTCString()}
                                      ></Profilepostcard>
                                    );
                                  })}
  
                              </div>)}

                              <div className="w-[100%] h-[20%] flex items-center justify-center">
                                  <h1 className="text-xl font-semibold text-gray-700">There are no more posts to show right now.</h1>
                              </div>
                      </div>

                        
                 </div>

              
            </div>

            </div>

            <div className={toggle === 2?  "show-about" : "content"}> 
              <div className="w-[100%] h-[100%] bg-gray-200 flex justify-center"> 
                    <div className="w-[16%] h-[70%] bg-white p-2 rounded-xl">
                      <div className="w-[100%] h-[10%] flex items-center p-2">
                          <h1 className="text-2xl font-semibold">About</h1>
                      </div>
                      <div className="w-[100%] h-[12%] mt-2 mb-2 flex items-center p-2 hover:bg-gray-300 cursor-pointer rounded-lg">
                          <h1 className="font-semibold text-gray-800">Overview</h1>
                      </div>
                      <div className="w-[100%] h-[12%] mt-2 mb-2flex items-center p-2 hover:bg-gray-300 cursor-pointer rounded-lg">
                          <h1 className="font-semibold text-gray-800">Work and education</h1>
                      </div>
                      <div className="w-[100%] h-[12%] mt-2 mb-2 flex items-center p-2 hover:bg-gray-300 cursor-pointer rounded-lg">
                          <h1 className="font-semibold text-gray-800">Contact and basic info</h1>
                      </div>
                      <div className="w-[100%] h-[12%] mt-2 mb-2 flex items-center p-2 hover:bg-gray-300 cursor-pointer rounded-lg">
                          <h1 className="font-semibold text-gray-800">Family and relationships</h1>
                      </div>
                      <div className="w-[100%] h-[12%] mt-2 mb-2 flex items-center p-2 hover:bg-gray-300 cursor-pointer rounded-lg">
                          <h1 className="font-semibold text-gray-800">Details about you</h1>
                      </div>
                      <div className="w-[100%] h-[12%] mt-2 mb-2 flex items-center p-2 hover:bg-gray-300 cursor-pointer rounded-lg">
                          <h1 className="font-semibold text-gray-800">Life events</h1>
                      </div>
                    </div>    

                    <div className="w-[52%] h-[70%] bg-white ml-3 rounded-xl p-2 flex items-center flex-col justify-center">
                          <div className="w-[100%] h-[15%] mb-1 mt-1 flex">
                                <div className="w-[7%] h-[100%] flex items-center justify-center">
                                    <img src={require("../pics/fullname.png")}/>
                                </div>
                                <div className="w-[83%] h-[100%] flex items-center">
                                    <h1 className="text-m text-black">Full name: <span className="text-blue-800">{user?.displayName && user?.displayName.split(' ').slice(0).join(' ')}</span></h1>
                                </div>
                                <div className="w-[10%] h-[100%] flex items-center">
                                    <img className="w-[20%]" src={require("../pics/public.png")} alt="public"/>
                                </div>
                          </div>
                          <div className="w-[100%] h-[15%] mb-1 mt-1 flex">
                                <div className="w-[7%] h-[100%] flex items-center justify-center">
                                   <img className="w-[40%]" src={require("../pics/nickname.png")}/>
                                </div>
                                <div className="w-[93%] h-[100%] flex items-center">
                                    <h1 className="text-m">Nickname: <span className="text-blue-800">{user?.displayName && user?.displayName.split(' ').slice(0,1).join(' ')}</span></h1>
                                </div>
                          </div>
                          <div className="w-[100%] h-[15%] mb-1 mt-1 flex">
                                <div className="w-[7%] h-[100%] flex items-center justify-center">
                                    <img src={require("../pics/gradhat.png")} alt="studied"/>
                                </div>
                                <div className="w-[83%] h-[100%] flex items-center">
                                    <h1 className="text-m">Studied at Holy Cross of Davao College</h1>
                                </div>
                                <div className="w-[10%] h-[100%] flex items-center">
                                    <img className="w-[20%]" src={require("../pics/public.png")} alt="public"/>
                                </div>
                          </div>
                          <div className="w-[100%] h-[15%] mb-1 mt-1 flex">
                                <div className="w-[7%] h-[100%] flex items-center justify-center">
                                    <img src={require("../pics/mobile.png")}/>
                                </div>
                                <div className="w-[83%] h-[100%] flex items-center">
                                    <h1 className="text-m text-black">Email: <span className="text-blue-800">{user?.email}</span></h1>
                                </div>
                                <div className="w-[10%] h-[100%] flex items-center">
                                    <img className="w-[20%]" src={require("../pics/public.png")} alt="public"/>
                                </div>
                          </div>
                          <div className="w-[100%] h-[15%] mb-1 mt-1 flex">
                                <div className="w-[7%] h-[100%] flex items-center justify-center">
                                    <img src={require("../pics/uid.png")}/>
                                </div>
                                <div className="w-[93%] h-[100%] flex items-center">
                                    <h1 className="text-m text-black">User Id: <span className="text-blue-800">{user?.uid}</span></h1>
                                </div>
                          </div>
                    </div>              
              </div>
            </div>

            <div className={toggle === 3?  "show-friend" : "content"}> 
                        
                        <div className="w-[67%] bg-white rounded-lg flex flex-col p-3 pt-5 mb-40">                     
                          
                           <div className="w-[100%] flex">
                                  <div className="w-[50%] h-20 flex items-center">
                                      <h1 className="font-semibold text-2xl">Friends</h1>
                                  </div>
                                  <div className="w-[50%] h-20 bg-gray-250 flex justify-end items-center">
                                    <div className="w-[5%] h-[55%] bg-gray-100 rounded-l-full flex justify-end items-center">
                                        <img className="w-[70%]" src={require("../pics/search.png")}/>
                                    </div>
                                    <div className="w-[40%] h-[55%] flex items-center justify-center">
                                          <input className="w-[100%] h-[100%] bg-gray-100 rounded-r-full outline-none p-4" name="input" value={input} type="text" placeholder="Search contact" onChange={(e) => setInput(e.target.value)}></input>
                                    </div>        
                                  </div>
                          </div>  

                          <div className="w-[100%] h-16 mb-2 p-2 flex">
                              <div className="h-[100%] flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200 pl-5 pr-5">
                                    <h1 className="text-m font-semibold text-gray-800">All friends</h1>
                              </div>
                              <div className="h-[100%] flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200 pl-5 pr-5">
                                    <h1 className="text-m font-semibold text-gray-800">Recently added</h1>
                              </div>
                              <div className="h-[100%] flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200 pl-5 pr-5">
                                    <h1 className="text-m font-semibold text-gray-800">College</h1>
                              </div>
                              <div className="h-[100%] flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200 pl-5 pr-5">
                                    <h1 className="text-m font-semibold text-gray-800">Follower</h1>
                              </div>
                              <div className="h-[100%] flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200 pl-5 pr-5">
                                    <h1 className="text-m font-semibold text-gray-800">Following</h1>
                              </div>
                            
                          </div>

                          <div className="w-[100%] flex">

                            <div className="w-[100%] flex flex-col">
                            
                            <div className="w-[100%] flex">
                               {friendList?.length > 0 ? searchFriends(friendList)?.slice(0, 2).map((friend) =>{
                                        return <div className="rounded-lg flex items-center w-[50%] h-24 p-2 m-1 border border-gray-200" key={friend.id}>
                                            
                                                <div className="flex items-center justify-center cursor-pointer w-[14%] h-[100%]">
                                                    <Avatar variant="rounded" className="w-[100%] h-[100%] object-cover" src={friend?.image || require('../pics/nickname.png')} alt="avatar"></Avatar>
                                                </div>
                                                <Link to={`/profile/${friend.id}`} className="flex items-center justify-start w-[65%] h-[100%]">
                                                <div className="w-[100%] h-[100%] flex items-center pl-5">
                                                    <h1 className="font-semibold text-gray-800 text w-[100%]">{friend.name}</h1>
                                                </div>
                                                </Link>
                                                <div className="w-[21%] h-[100%] flex items-center justify-center cursor-pointer" onClick={() => removeFriend(friend.id, friend.name, friend.image)}>                                    
                                                    <div className="w-[30%] h-[45%] bg-gray-200 flex justify-center items-center rounded-l-lg border-r border-gray-400 hover:bg-gray-300">
                                                        <img className="w-[65%]" src={require('../pics/deleteaccount.png')} alt="unfriend"/>
                                                    </div>
                                                    <div className="w-[70%] h-[45%] bg-gray-200 flex items-center justify-center rounded-r-lg hover:bg-gray-300">
                                                        <h1 className="text-sm font-semibold">Unfriend</h1>       
                                                    </div>
                                                </div>
                                            
                                        </div>
                                    }) : 
                                    <div ></div>}
                               </div>
                                
                               <div className="w-[100%] flex">
                               {friendList?.length > 0 ? searchFriends(friendList)?.slice(2, 4).map((friend) =>{
                                        return <div className="rounded-lg flex items-center w-[50%] h-24 p-2 m-1 border border-gray-200" key={friend.id}>
                                            
                                                <div className="flex items-center justify-center cursor-pointer w-[14%] h-[100%]">
                                                    <Avatar variant="rounded" className="w-[100%] h-[100%] object-cover" src={friend?.image || require('../pics/nickname.png')} alt="avatar"></Avatar>
                                                </div>
                                                <Link to={`/profile/${friend.id}`} className="flex items-center justify-start w-[65%] h-[100%]">
                                                <div className="w-[100%] h-[100%] flex items-center pl-5">
                                                    <h1 className="font-semibold text-gray-800 text w-[100%]">{friend.name}</h1>
                                                </div>
                                                </Link>
                                                <div className="w-[21%] h-[100%] flex items-center justify-center cursor-pointer" onClick={() => removeFriend(friend.id, friend.name, friend.image)}>                                    
                                                    <div className="w-[30%] h-[45%] bg-gray-200 flex justify-center items-center rounded-l-lg border-r border-gray-400">
                                                        <img className="w-[65%]" src={require('../pics/deleteaccount.png')} alt="unfriend"/>
                                                    </div>
                                                    <div className="w-[70%] h-[45%] bg-gray-200 flex items-center justify-center rounded-r-lg">
                                                        <h1 className="text-sm font-semibold">Unfriend</h1>       
                                                    </div>
                                                </div>
                                            
                                        </div>
                                    }) : 
                                    <div ></div>}
                               </div>
                               
      
                            </div>          
                        </div>
                    </div>

            </div>

            <div className={toggle === 4?  "show-photo" : "content"}> 
               <div className="w-[67%] bg-white p-3 pt-5 flex flex-col rounded-lg">
                  
                  <div className="w-[100%] h-20 flex items-center"> 
                      <h1 className="text-2xl font-semibold">Photos</h1>
                  </div>

                  <div className="w-[100%] flex relative flex-col mt-2 mb-1">         
                      <div className="w-[100%] relative flex cursor-pointer">
                          <div className="w-[16%] h-[100%] relative mr-1 ml-1 flex">
                               {imageUrls.slice(0, 6 ).map((url, index) => (
                                    <img className="w-[100%] h-52 mr-2 object-cover rounded-xl" key={index} src={url} alt={`Image ${index}`} />
                              ))}   
                          </div>
                      </div>
                  </div>

                  <div className="w-[100%] flex  relative flex-col  mt-2 mb-1">         
                      <div className="w-[100%] relative flex">
                          <div className="w-[16.66%] h-[100%] relative mr-1 ml-1 flex">
                               {imageUrls.slice(6, 12).map((url, index) => (
                                    <img className="w-[100%] h-52 mr-2 object-cover rounded-xl" key={index} src={url} alt={`Image ${index}`} />
                              ))}   
                          </div>
                      </div>
                  </div>

                  <div className="w-[100%] flex  relative flex-col  mt-2 mb-1">         
                      <div className="w-[100%] relative flex">
                          <div className="w-[16.66%] h-[100%] relative mr-1 ml-1 flex">
                               {imageUrls.slice(12, 18).map((url, index) => (
                                    <img className="w-[100%] h-52 mr-2 object-cover rounded-xl" key={index} src={url} alt={`Image ${index}`} />
                              ))}   
                          </div>
                      </div>
                  </div>

               </div>
            </div>

  
        </div>
        
        
    );
}

export default Profile;