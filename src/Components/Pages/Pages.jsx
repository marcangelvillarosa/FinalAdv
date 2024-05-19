import React from "react";
import Home from './Home';
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import {Routes, Route} from "react-router-dom";
import FriendProfile from "./FriendProfile";
import Profile from "./Profile";
import Findfriends from "./FindFriends";
import Videos from "./Videos";
import Underconstruction from "./Underconstruction";


const Pages = () => 
{
  return (
    <div>
      <Routes> 
        <Route path ="/" element={<Login></Login>}></Route>
        <Route path ="Home" element={<Home></Home>}></Route>
        <Route path ="Register" element={<Register></Register>}></Route>
        <Route path ="Reset" element={<Reset></Reset>}></Route>
        <Route path ="Profile" element={<Profile></Profile>}></Route>
        <Route path ="Findfriends" element={<Findfriends></Findfriends>}></Route>
        <Route path ="Videos" element={<Videos></Videos>}></Route>
        <Route path ="Underconstruction" element={<Underconstruction></Underconstruction>}></Route>
        <Route path ="/profile/:id" element={<FriendProfile></FriendProfile>}></Route>
      </Routes>
    </div>
  );
 
};

export default Pages;