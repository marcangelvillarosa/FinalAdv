import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import { AuthContext } from '../AppContext/AppContext';
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
  } from "@material-tailwind/react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { getDoc, getDocs } from 'firebase/firestore';

const Login = () => 
{
    const { signInWithGoogle, loginWithEmailAndPassword } = useContext ( AuthContext );
    const navigate = useNavigate();

    useEffect(() =>{
        onAuthStateChanged(auth, (user) =>{
            if(user)
            {
                navigate("/Home")
            }
            else
            {

            }
        });
    }, [navigate]);

    let initialValues = 
    {
        email: "",
        password: "",
    };

    
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid Email address").required("Required"),
        password: Yup.string().required("Required").min('6', "Must be at least 6 characters long").matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
    });

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        const {email, password} = formik.values;
        if (formik.isValid === true)
        {
           loginWithEmailAndPassword(email, password);
        }
        else
        {
            alert("Check your input fields");
        }
    };
    const formik = useFormik({initialValues, validationSchema, handleSubmit});

   

    return(

        <div className='h-screen flex flex-col'>
           
            <div className='bg-gray-200 w-[100%] h-[75%] flex'>

                <div className='w-[50%] h-[100%] flex flex-col items-end'>
                    <div className='w-[55%] h-[35%] flex items-end'>
                        <h1 className='text-blue-700 text-6xl font-bold'>facebook</h1>
                    </div>
                    <div className='w-[55%] h-[65%] pt-2'>
                        <h1 className='w-[90%] text-2xl'>Facebook helps you connect and share with the people in your life.</h1>
                    </div>
                </div>
                
                <div className='w-[50%] h-[100%]    flex flex-col justify-center pl-10'>
                    <Card className="w-[45%] flex">
                
                        <CardBody className="flex flex-col p-6 pb-0">
                        
                            <form onSubmit={handleSubmit} className='flex flex-col justify-center'>
                                
                                <div className='h-[20%] flex justify-center flex-col mb-1'>
                                    <Input name='email' type='email' label="Email address or phone number" size='lg' {...formik.getFieldProps('email')}/>
                                    <div>
                                    {
                                    formik.touched.email && formik.errors.email &&
                                    <Typography variant="small" color='red'>{formik.errors.email}</Typography>
                                    }
                                    </div>
                                </div>   

                                <div className='h-[20%] flex justify-center flex-col mt-3'>
                                    <Input name='password' type='password' label="Password" size="lg" {...formik.getFieldProps('password')} /> 
                                    <div>
                                    {
                                    formik.touched.password && formik.errors.password &&
                                    <Typography variant="small" color='red'>{formik.errors.password}</Typography>
                                    }
                                    </div>
                                </div>  

                                <Button className='login bg-blue-800 mt-5 mb-5' fullWidth type="submit">
                                    Login
                                </Button>
                               
                                <div className='border-b border-gray-400 pb-3.5'>
                                    <Link to="/Reset">
                                        <h1 className="mt-1 flex justify-center text-sm text-blue-500">
                                            Reset the password?
                                        </h1>
                                    </Link>
                                </div>
                               
                            </form>

                        </CardBody>

                        <CardFooter className='flex justify-center pt-6 pb-6'>
                            <Link to="/Register">
                                <Button className='create bg-green-600'>
                                    Create new account
                                </Button>
                            </Link>
                        </CardFooter>


                    </Card>

                    
                          <div className="flex w-[44.5%] h-[10%] items-center justify-center">  
                                <Link>
                                    <h1 >Sign In with <span className='text-red-700 text-lg font-semibold' onClick={signInWithGoogle}>Google</span> </h1>
                                </Link>
                            </div>
                </div>

            </div>   

            <div className='w-[100%] h-[25%] flex flex-col items-center bg-white'>
                <div className='flex items-center space-x-2 > * + * w-[50%] h-[15%] border-b  border-gray-500 mt-3'>
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

                 <div className='flex items-center space-x-2 > * + * w-[50%] h-[10%]'>
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

                 <div className='flex items-center space-x-2 > * + * w-[50%] h-[10%]'>
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

                 <div className='flex items-center space-x-2 > * + * w-[50%] h-[10%]'>
                    <h1 className='text-xs text-gray-700'>AdChoices</h1>
                    <h1 className='text-xs text-gray-700'>Terms</h1>
                    <h1 className='text-xs text-gray-700'>Help</h1>
                    <h1 className='text-xs text-gray-700'>Contact uploading and non-users</h1>
                </div>     

                <div className='flex items-center w-[50%] h-[15%]'>
                    <h1 className='text-xs text-gray-700'>Meta © 2024</h1>
                </div>   
               
            </div>
            
        </div> 
    );
};

export default Login;