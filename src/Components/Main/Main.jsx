import React, { useContext, useEffect, useReducer, useState } from "react";
import Story from "./Story";
import { useRef } from 'react';
import { Avatar, Button } from "@material-tailwind/react";
import { AuthContext } from "../AppContext/AppContext";
import {doc, setDoc, collection, documentId, serverTimestamp, orderBy, query, onSnapshot, toDate} from "firebase/firestore";
import {db} from "../firebase/firebase";
import { PostsReducer, postActions, postsStates, } from "../AppContext/PostReducer";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { get } from "firebase/database";
import PostCard from "./PostCard";
import { Alert } from "@material-tailwind/react";


const MainPage = () => 
{
    const {user, userData} = useContext(AuthContext);
    const text = useRef("");
    const [image, setImage] = useState(null);
    const [file, setFile] =useState(null);
    const collectionRef = collection(db, "posts");
    const postRef = doc (collection(db, "posts"));
    const document = postRef.id;
    const [state, dispatch] = useReducer(PostsReducer, postsStates);
    const {SUBMIT_POST, HANDLE_ERROR} = postActions
    const [progressBar, setProgressBar] = useState(0);

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
          "video/mp4",
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
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 95
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
        const postData = async () => {
          const q = query(collectionRef, orderBy("timestamp", "asc"));
          await onSnapshot(q, (doc) => {
            dispatch({
              type: SUBMIT_POST,
              posts: doc?.docs?.map((item) => item?.data()),
            });
            setImage(null);
            setFile(null);
            setProgressBar(0);
          });
        };
        return () => postData();
      }, [SUBMIT_POST]);
      

    return (
       
      <div className="w-[100%] flex flex-col bg-gray-200 overflow-y-scroll">
           
            <div className=" w-[100%]">
                <Story></Story>
            </div>
            
            <div className="w-[100%] flex justify-center items-center">
                
                <form className="w-[62.6%] h-48 flex justify-center items-center" onSubmit={handleSubmitPost}>
                    
                    <div className="h-[72%] w-[100%] bg-white rounded-lg flex justify-center items-center flex-col">
                        
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
                                    <img className="w-[45%]" src={require('../pics/live.png')} alt="placeholder"/>
                                </div>
                                 <div className="w-[50%] h-[100%]  flex justify-center items-center">
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
                                      {file && (<Button variant="text" onClick={submitImage} className="text-black p-4 hover:bg-inherit active:bg-inherit" >Upload</Button>)}
                                  </div>
                              </div>
                            <div className="w-[30%] h-[100%] flex justify-center items-center">
                                <div className="w-[30%] h-[100%] flex justify-center items-center">
                                    <img className="w-[50%]" src={require('../pics/feeling.png')} alt="placeholder"/>
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



            <div className="w-[100%]">
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
                        <PostCard
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
                        ></PostCard>
                      );
                    })}
                </div>
                   )}

                <div className="w-[100%] flex items-center justify-center p-10">
                   <h1 className="text-xl font-semibold text-gray-700">There are no more posts to show right now.</h1>
                </div>
                
            </div>
        </div>
    );
};

export default MainPage;