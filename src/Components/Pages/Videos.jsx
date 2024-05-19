import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import FriendPostCard from "../Main/friendPostcard";
import { Link } from "react-router-dom";

const Videos = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(
                    collection(db, "posts"),
                    orderBy("timestamp", "asc"),
                    where("image", ">=", ".mp4")
                  );
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const videoPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setPosts(videoPosts);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="w-screen h-screen bg-gray-200 overflow-y-scroll flex items-center justify-center flex-col shadow-2xl">
           
            <div className="w-screen h-[6.5%]">
                <Navbar></Navbar>
            </div>

            <div className="w-[100%] h-[93.5%] flex">

              <div className="w-[20%] h-[100%] bg-white p-2  border-r border-gray-300">  
                 
                  <div className="w-[100%] h-[7%] pl-2 flex items-center">
                      <h1 className="text-2xl font-semibold">Video</h1>
                  </div>

                  <Link to="/Home">
                  <div className="w-[100%] h-[6%] p-1 flex hover:bg-gray-200 cursor-pointer rounded-lg">
                      <div className="w-[15%] h-[100%] flex items-center justify-center">
                          <img className="w-[55%]" src={require('../pics/homeblack.png')}/>
                      </div>
                      <div className="w-[85%] h-[100%] flex items-center">
                          <h1 className="font-semibold text-gray-800">Home</h1>
                      </div>
                  </div>
                  </Link>

                  <Link to={"/Underconstruction"} >
                  <div className="w-[100%] h-[6%] p-1 flex hover:bg-gray-200 cursor-pointer rounded-lg">
                      <div className="w-[15%] h-[100%] flex items-center justify-center">
                          <img className="w-[50%]" src={require('../pics/liveblack.png')}/>
                      </div>
                      <div className="w-[85%] h-[100%] flex items-center">
                          <h1 className="font-semibold text-gray-800">Live</h1>
                      </div>
                  </div>
                  </Link>

                  <Link to={"/Underconstruction"} >
                  <div className="w-[100%] h-[6%] p-1 flex hover:bg-gray-200 cursor-pointer rounded-lg">
                      <div className="w-[15%] h-[100%] flex items-center justify-center">
                          <img className="w-[45%]" src={require('../pics/reelsblack.png')}/>
                      </div>
                      <div className="w-[85%] h-[100%] flex items-center">
                          <h1 className="font-semibold text-gray-800">Reels</h1>
                      </div>
                  </div>
                  </Link>

                  <Link to={"/Underconstruction"} >
                  <div className="w-[100%] h-[6%] p-1 flex hover:bg-gray-200 cursor-pointer rounded-lg">
                      <div className="w-[15%] h-[100%] flex items-center justify-center">
                          <img className="w-[50%]" src={require('../pics/movieblack.png')}/>
                      </div>
                      <div className="w-[85%] h-[100%] flex items-center">
                          <h1 className="font-semibold text-gray-800">Show</h1>
                      </div>
                  </div>
                  </Link>

                  <Link to={"/Underconstruction"} >
                  <div className="w-[100%] h-[6%] p-1 flex hover:bg-gray-200 cursor-pointer rounded-lg">
                      <div className="w-[15%] h-[100%] flex items-center justify-center">
                          <img className="w-[55%]" src={require('../pics/exploreblack.png')}/>
                      </div>
                      <div className="w-[85%] h-[100%] flex items-center">
                          <h1 className="font-semibold text-gray-800">Explore</h1>
                      </div>
                  </div>
                  </Link>

                  <Link to={"/Underconstruction"} >
                  <div className="w-[100%] h-[6%] p-1 flex hover:bg-gray-200 cursor-pointer rounded-lg">
                      <div className="w-[15%] h-[100%] flex items-center justify-center">
                          <img className="w-[55%]" src={require('../pics/bookmarkblack.png')}/>
                      </div>
                      <div className="w-[85%] h-[100%] flex items-center">
                          <h1 className="font-semibold text-gray-800">Saved Videos</h1>
                      </div>
                  </div>
                  </Link>

              </div>

              <div className="w-[80%] h-[100%] bg-gray-200 flex items-center justify-center overflow-y-scroll">
                <div className="w-[66%] h-[100%] flex flex-col mt-10">
                    {posts.map((post, index) => (
                        <FriendPostCard
                            key={index}
                            logo={post?.logo}
                            id={post?.documentId}
                            uid={post?.uid}
                            name={post?.name}
                            email={post?.email}
                            image={post?.image}
                            text={post?.text}
                            timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()}
                        />
                    ))}
                  </div>
              </div>

            </div>
            
           
        </div>
    );
}

export default Videos;
