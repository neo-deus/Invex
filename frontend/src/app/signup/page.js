"use client";
// import Link from "next/link";
// import React, { useEffect } from "react";
// import {useRouter} from "next/navigation";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const signup=()=>{
//   const router = useRouter();
//   const [user, setUser] = React.useState({
//       email: "",
//       password: "",
//       username: "",
//   })
//   const [buttonDisabled, setButtonDisabled] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);
    
//   const onSignup = async () => {
//     try {
//         setLoading(true);
//         const response = await axios.post("/api/users/signup", user);
//         console.log("Signup success", response.data);
//         router.push("/login");
        
//     } catch (error) {
//         console.log("Signup failed", error.message);
        
//         toast.error(error.message);
//     }finally {
//         setLoading(false);
//     }
// }

// useEffect(() => {
//     if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
//         setButtonDisabled(false);
//     } else {
//         setButtonDisabled(true);
//     }
// }, [user]);


//       return (
//         <div className="flex flex-col items-center justify-center min-h-screen py-2">
//         <h1>{loading ? "Processing" : "Signup"}</h1>
//         <hr />
//         <label htmlFor="username">username</label>
//         <input 
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//             id="username"
//             type="text"
//             value={user.username}
//             onChange={(e) => setUser({...user, username: e.target.value})}
//             placeholder="username"
//             />
//         <label htmlFor="email">email</label>
//         <input 
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//             id="email"
//             type="text"
//             value={user.email}
//             onChange={(e) => setUser({...user, email: e.target.value})}
//             placeholder="email"
//             />
//         <label htmlFor="password">password</label>
//         <input 
//         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//             id="password"
//             type="password"
//             value={user.password}
//             onChange={(e) => setUser({...user, password: e.target.value})}
//             placeholder="password"
//             />
//             <button
//             onClick={onSignup}
//             className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">{buttonDisabled ? "No signup" : "Signup"}</button>
//             <Link href="/login">Visit login page</Link>
//             </div>
//         )
//     }
// export default signup;



import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

const Signup = () => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const[error,seterror]=useState("");
    // Formik setup with Yup validation
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Please enter the username'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Please enter the email'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Please enter the password'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await axios.post("/api/users/signup", values);
                toast.success("Signup success")
                router.push("/login");
            } catch (error) {
                console.error("Signup failed", error);
                toast.error("Signup failed. Please try again.");
            }finally{
                setLoading(false);
            }
        },
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Toaster/>
            <h1>{loading?"Processing...":"Signup"}</h1>

            <form onSubmit={formik.handleSubmit} className="flex flex-col">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    {...formik.getFieldProps('username')}
                    className="p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
                />
                {formik.touched.username && formik.errors.username ? (
                    <div className="text-red-500 text-xs">{formik.errors.username}</div>
                ) : null}

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                    className="p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-xs">{formik.errors.email}</div>
                ) : null}

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    {...formik.getFieldProps('password')}
                    className="p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-xs">{formik.errors.password}</div>
                ) : null}

                
                <button type="submit" className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 bg-blue-500 text-white">
                    Signup
                </button>
            </form>
            <p className="text-red-500 text-xs">{error}</p>
            <Link href="/login" passHref className="text-blue-500 hover:underline">
               Visit login page
            </Link>
        </div>
    );
};

export default Signup;
