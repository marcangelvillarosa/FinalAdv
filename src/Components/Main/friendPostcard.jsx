import React, { useContext, useEffect, useReducer, useState } from "react";
import { Avatar } from "@material-tailwind/react";
import {AuthContext} from "../AppContext/AppContext";
import { PostsReducer, postActions, postsStates } from "../AppContext/PostReducer";
import {doc, setDoc, collection, documentId, serverTimestamp, orderBy, query, onSnapshot, where, getDocs, updateDoc, arrayUnion, deleteDoc} from "firebase/firestore";
import {db} from "../firebase/firebase";
import CommentSection from "./CommentSection";

const FriendPostCard = ({uid, id, logo, name, email, text, image, timestamp}) => 
{
    const {user} = useContext(AuthContext);
    const [state, dispatch] = useReducer(PostsReducer, postsStates);
    const likesRef = doc(collection(db, 'posts', id, "likes"));
    const likesCollection = collection(db, "posts", id, "likes");
    const singlePostDocument = doc(db, "posts", id);
    const {ADD_LIKE, HANDLE_ERROR} = postActions;
    const [open, setOpen] = useState(false);

    const handleOpen = (e) => {
        e.preventDefault();
        setOpen(true);
      };
    
    const addUser = async () =>
    {
        try
        {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].ref;
            await updateDoc(data, {friends: arrayUnion({id: uid, image: logo, name: name,}), });
        }
        catch(err)
        {
            alert(err.message);
            console.log(err.message);
        }
    };

    const handleLike = async (e) => 
    {
        e.preventDefault();
        const q = query(likesCollection, where('id', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        const likesDocId = await querySnapshot?.docs[0]?.id;
        try
        {
            if(likesDocId !== undefined)
            {
                const deleteId = doc(db, 'posts', id, 'likes', likesDocId);
                await deleteDoc(deleteId);
            }
            else
            {
                await setDoc(likesRef, {id: user?.uid,})
            }
        }
        catch(err)
        {
            alert(err.message);
            console.log(err.message);
        }
    };

    const deletePost = async (e) => 
    {
        e.preventDefault();
        try
        {
            if(user?.uid == uid)
            {   
                await deleteDoc(singlePostDocument);
            }
            else
            {
                alert("You can't delete other users posts")
            }
        }
        catch(err)
        {
            alert(err.message);
            console.log(err.message);
        }
    }

    useEffect (() => {
        const getLikes = async () =>
        {
            try
            {
                const q = collection(db, "posts", id, "likes");
                await onSnapshot(q, (doc) => {
                    dispatch({type: ADD_LIKE, likes: doc.docs.map((item) => item.data()),});
                });
            }
            catch(err)
            {
                dispatch({type: HANDLE_ERROR});
                alert(err.message);
                console.log(err.message);
            }
        };
        return () => getLikes();
    }, [id, ADD_LIKE, HANDLE_ERROR]);



    return(
        <div className="flex w-[100%] items-center justify-center flex-col">
            
            <div className="w-[92%] flex flex-col justify-center items-center bg-white rounded-xl mb-5">
               
                <div className="w-[100%] h-20 p-3 pb-1 flex"> 
                   
                    <div className="w-[8%] h-[100%] flex justify-center items-center">
                        <Avatar className="bg-gray-500" size="m" variant="circular" src={logo || require("../pics/nickname.png")} alt="avatar"></Avatar>
                    </div>

                    <div className="w-[33%] h-[100%]">
                        <div className="w-[100%] h-[55%] flex items-end pl-2">
                            <h1 className="text-sm font-semibold">{name}</h1>
                        </div>
                         <div className="w-[100%] h-[45%]flex items-start pl-2">
                            <h1 className="text-xs">{timestamp}</h1>
                        </div>
                    </div>

                    <div className="w-[60%] h-[100%] flex justify-end">
                        {user?.uid !== uid &&
                            <div className="w-[15%] h-[100%] flex justify-center items-center cursor-pointer">
                                <div className="add rounded-full w-[70%] h-[70%] flex items-center justify-center">
                                    <div className="flex justify-center items-center" onClick={addUser}><img className="w-[70%]" src={require('../pics/addfriend.png')} alt="addFriend"></img></div>
                                </div>
                            </div>
                        }
                        {user?.uid === uid && (
                            <div className="w-[7%] h-[100%] flex justify-end items-start cursor-pointer" onClick={deletePost}>
                                    <div className="add rounded-full w-[100%] h-[45%] flex items-center justify-center">
                                        <div className="flex justify-center items-center"><img className="w-[40%]" src={require('../pics/close.png')} alt="addFriend"></img></div>                       
                                    </div>     
                            </div>
                        )}
                    </div>

                </div>

                <div className="w-[100%] pl-3 pr-3 pt-2 pb-2">
                    <h1 className="text-m font-semibold">{text}</h1>
                </div>
                    
                <div className="flex relative">
                        {image && (
                            <img className="post bg-cover w-[100%] h-[600px] p-3 pt-1 pb-1 object-contain absolute" src={image}></img>
                        )}
                        {image && (
                       <video className="post bg-cover w-[100%] h-[600px]  p-3 pt-1 pb-1 object-cover z-1" controls={image.includes('.mp4')}>
                            <source src={image} type="video/mp4"></source>
                        </video>
                    )}
                </div>
                
                <div className="w-[95%] h-[1px] border-t border-gray-500 m-3"></div>

                <div className="w-[100%] h-14 flex pb-3">
                    
                    <div className="w-[34%] h-[100%] flex justify-center items-center cursor-pointer">
                        <div className="w-[30%] h-[100%] flex justify-center items-center">
                            <button className="cursor-pointer flex justify-center items-center" onClick={handleLike}>
                                <img className="w-[40%]" src={require("../pics/like.png")} alt="like"></img>
                            </button>
                        </div>  
                        {state.likes?.length > 0 && state?.likes?.length}
                    </div>

                    <div className="w-[34%] h-[100%] flex justify-center items-center cursor-pointer" onClick={handleOpen}>
                        <div className="w-[30%] h-[100%] flex justify-center items-center">
                             <button className="cursor-pointer flex justify-center items-center">
                                <img className="w-[40%]" src={require("../pics/comment.png")} alt="comments"></img>
                            </button>
                        </div>  
                        <h1 className="font-semibold">Comments</h1>
                    </div>

                    
                    <div className="w-[34%] h-[100%] flex justify-center items-center cursor-pointer">
                        <div className="w-[30%] h-[100%] flex justify-center items-center">
                             <button className="cursor-pointer flex justify-center items-center">
                                <img className="w-[40%]" src={require("../pics/share.png")} alt="like"></img>
                            </button>
                        </div>  
                        <h1 className="font-semibold">Share</h1>
                    </div>
                </div>
                
                {open && <CommentSection postId={id}></CommentSection>}
            </div>
            
          
        </div>

    );
};

export default FriendPostCard;