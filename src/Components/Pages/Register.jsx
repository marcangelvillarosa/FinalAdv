import React, { useContext, useEffect, useState } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
    Button,
  } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import {useFormik} from "formik";
import * as Yup from "yup";
import { AuthContext } from '../AppContext/AppContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const Register = () =>
{

  const { registerWithEmailAndPassword } = useContext(AuthContext);
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
        name: "",
        email: "",
        password: "", 
    };
    const validationSchema = Yup.object({
        name: Yup.string().required('Required').min('4', 'Must be at least 4 characters long').matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),
        email: Yup.string().email("Invalid Email address").required("Required"),
        password: Yup.string().required("Required").min('6', "Must be at least 6 characters long").matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
    });

    const handleRegister = (e) => 
    { 
        e.preventDefault();
        const {name, email, password} = formik.values;
        if(formik.isValid === true) 
        {
          registerWithEmailAndPassword(name, email, password);
        }
        else
        {
          alert("Check your input fields")
        }
       
    }
    const formik = useFormik({initialValues, validationSchema, handleRegister})

    return(
        <div className='h-screen w-screen bg-gray-200 flex justify-center items-center'>
    <Card className="w-96">
      <CardBody className="flex flex-col">
        <div className='w-100 h-20 mb-5 border-b border-gray-400'>
            <div className='w-[100%] h-[60%] flex items-end'>
                <h1 className='text-3xl text-black'>Sign Up</h1>
            </div>
            <div className='w-[100%] h-[40%] flex items-start'>
                <h1 className='text-sm font-thin text-black'>it's quick and easy.</h1>
            </div>
        </div>
        <form onSubmit={handleRegister}>
            <div>
                <Input name='name' type='name' label="Name" size="lg" {...formik.getFieldProps('name')}/>
            </div>
            <div className='mb-2'>
            {
              formik.touched.name && formik.errors.name &&
              <Typography variant="small" color='red'>{formik.errors.name}</Typography>
            }
            </div>
            <div>
                <Input name='email' type='email' label="Email" size="lg" {...formik.getFieldProps('email')}/>
            </div>
            <div className='mb-2'>
            {
              formik.touched.email && formik.errors.email &&
              <Typography variant="small" color='red'>{formik.errors.email}</Typography>
            }
            </div>
            <div>
                <Input name='password' type='password' label="Password" size="lg" {...formik.getFieldProps('password')}/>
            </div>
            <div className='mb-2'>
            {
              formik.touched.password && formik.errors.password &&
              <Typography variant="small" color='red'>{formik.errors.password}</Typography>
            }
            </div>
            <div>
                <div className='w-[100%] h-[50%] flex justify-center items-center mb-4 mt-4'>
                    <h1 className='w-[95%] text-xs'>People who use our service may have uploaded your contact information to Facebook. <span className='text-blue-700'>Learn more.</span> </h1>
                </div>
                <div className='w-[100%] h-[50%] flex justify-center items-center mt-4'>
                    <h1 className='w-[95%] text-xs'>By clicking Sign Up, you agree to our <span className='text-blue-700'>Terms</span>, <span className='text-blue-700'>Privacy Policy</span> and <span className='text-blue-700'>Cookies Policy</span>. You may receive SMS Notifications from us and can opt out any time.</h1>
                </div>
            </div>
            <Button fullWidth type='submit' className='mt-5 bg-green-700 mb-2'>
                Sign up
            </Button>
            <div className='flex justify-center items-center'>
              <Link to="/Reset">
                <h1 className='text-blue-400'>Reset the password</h1>
              </Link>
            </div>
        </form>
      </CardBody>
      <CardFooter className="pt-0">
        <div variant="small" className="flex justify-center items-center">
          Already have an account?
         <Link to='/'>
          <h1 className='text-green-500 font-semibold text-lg ml-1'>Login</h1>
        </Link>
        </div>
      </CardFooter>
    </Card>
        </div>
    );
}

export default Register;