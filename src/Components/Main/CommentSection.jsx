import { Avatar } from "@material-tailwind/react";
import React, { useContext, useReducer, useRef, useEffect } from "react";
import { AuthContext } from "../AppContext/AppContext";
import { collection, setDoc, doc, serverTimestamp, orderBy, query, onSnapshot } from "firebase/firestore";
import {db} from "../firebase/firebase";
import { PostsReducer, postActions, postsStates } from "../AppContext/PostReducer";
import Comment from "./Comment";

const CommentSection = ({postId}) => 
{
    const comment = useRef("");
    const { user, userData } = useContext(AuthContext);
    const commentRef = doc(collection(db, "posts", postId, "comments"));
    const [state, dispatch] = useReducer(PostsReducer, postsStates);
    const {ADD_COMMENT, HANDLE_ERROR} = postActions;
    
    const addComment = async (e) => 
    {   
        e.preventDefault();
        if(comment.current.value !== "")
        {
            try
            {
                await setDoc (commentRef, {
                    id: commentRef.id,
                    comment: comment.current.value,
                    image: user?.photoURL,
                    name: user?.diplayName?.split(" ")[0] || userData?.name?.charAt(0)?.toUpperCase() + userData?.name?.slice(1),
                    timestamp: serverTimestamp(),
                });
                comment.current.value = "";
            }
            catch(err) 
            {
                dispatch({type: HANDLE_ERROR});
                alert(err.message);
                console.log(err.error);
            }
        }
    };

    useEffect(() => {
        const getComments = async () => {
          try {
            const collectionOfComments = collection(db, `posts/${postId}/comments`);
            const q = query(collectionOfComments, orderBy("timestamp", "desc"));
            await onSnapshot(q, (doc) => {
              dispatch({
                type: ADD_COMMENT,
                comments: doc.docs.map((item) => item.data()),
              });
            });
          } catch (err) {
            dispatch({ type: HANDLE_ERROR });
            alert(err.message);
            console.log(err.message);
          }
        };
        return () => getComments();
      }, [postId, ADD_COMMENT, HANDLE_ERROR]);

    return (
        <div className="flex flex-col w-[100%] pb-4">
            <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-[5%] mr-1">
                    <Avatar size="sm" variant="circular" src={user?.photoURL || require('../pics/nickname.png')}></Avatar>
                </div>
                <div className="w-[85%] bg-gray-200 ml-1 rounded-full">
                    <form className="flex items-center w-[100%] rounded-full" onSubmit={addComment}> 
                        <input name="comment" className="w-[100%] p-2 pl-5 outline-none border-0 rounded-full bg-gray-100" type="text" placeholder="Write a public comment" ref={comment}></input>
                        <button className="hidden" type="submit">Submit</button>
                    </form>
                </div>
            </div>
            {state?.comments?.map((comment, index) => {
        return (
          <Comment
            key={index}
            image={comment?.image}
            name={comment?.name}
            comment={comment?.comment}
          ></Comment>
        );
      })}
        </div>
    );
};

export default CommentSection;