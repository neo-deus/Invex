"use client"

// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const Login = () => {
//     const router = useRouter();
//     const [user, setUser] = useState({
//         email: "",
//         password: "",
//     });
//     const [buttonDisabled, setButtonDisabled] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [showResetForm, setShowResetForm] = useState(false);

//     const onLogin = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.post("/api/users/login", user);
//             console.log("Login success", response.data);
//             toast.success("Login success");
//             router.push("/");
//         } catch (error) {
//             console.log("Login failed", error.message);
//             toast.error("Login failed: " + error.response?.data?.error || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleForgotPassword = () => {
//         setShowResetForm(true);
//     };

//     const resetPassword = async () => {
//         try {
//             const response = await axios.post("/api/users/passwordreset",{email:user.email});
//             console.log("Reset password link sent", response.data);
//             toast.success("Reset password link sent to your email");
//         } catch (error) {
//             console.log("Reset password failed", error.message);
//             toast.error("Reset password failed: " + error.response?.data?.error || error.message);
//         }
//     };

//     useEffect(() => {
//         if (user.email.length > 0 && user.password.length > 0) {
//             setButtonDisabled(false);
//         } else {
//             setButtonDisabled(true);
//         }
//     }, [user]);

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen py-2">
//             <h1>{loading ? "Processing" : "Login"}</h1>
//             <hr />
            
//             <label htmlFor="email">Email</label>
//             <input 
//                 className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//                 id="email"
//                 type="text"
//                 value={user.email}
//                 onChange={(e) => setUser({...user, email: e.target.value})}
//                 placeholder="Email"
//             />
//             <label htmlFor="password">Password</label>
//             <input 
//                 className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//                 id="password"
//                 type="password"
//                 value={user.password}
//                 onChange={(e) => setUser({...user, password: e.target.value})}
//                 placeholder="Password"
//             />
//             <button
//                 onClick={onLogin}
//                 disabled={buttonDisabled}
//                 className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
//             >
//                 Login Here
//             </button>
//             <button onClick={handleForgotPassword} className="p-2 border border-gray-300 rounded-lg mb-2 text-blue-700">Forgot Password?</button>
//             {showResetForm && (
//                 <div>
//                     <button
//                         onClick={resetPassword}
//                         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
//                     >
//                         Reset Password
//                     </button>
//                 </div>
//             )}
//             <Link href="/signup" passHref>Visit Signup Page</Link>
//         </div>
//     );
// };

// export default Login;



import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';


const Login = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    // Dynamically adjust the validation schema
    const validationSchema = showResetForm
        ? Yup.object({
            email: Yup.string().email('Invalid email address').required('Please enter the email'),
          })
        : Yup.object({
            email: Yup.string().email('Invalid email address').required('Please enter the email'),
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Please enter the password'),
          });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: (values) => {
            if (showResetForm) {
                resetPassword(values.email);
            } else {
                login(values);
            }
        },
    });

    const login = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", values);
            toast.success("Login successfully");
            if (typeof window !== 'undefined') {
                localStorage.setItem("email", values.email);
            }
            router.push("/");
        } catch (error) {
            toast.error("Login failed: " + (error.response?.data?.error || error.message));
            formik.resetForm();
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/passwordreset", { email });
            toast.success("Reset password link sent to your email");
            setShowResetForm(false);  // Optionally switch back to login form
            formik.resetForm();
        } catch (error) {
            toast.error("Reset password failed: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const toggleForgotPassword = () => {
        setShowResetForm(!showResetForm);
        // Reset the formik state entirely
        formik.resetForm();
        // Optionally, set initial values explicitly based on the new form state
        formik.setValues({ email: '', password: '' });
        formik.setTouched({});  // Reset touched fields
        formik.setErrors({});   // Clear any existing errors
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Toaster/>
            <h1>{loading ? "Processing" : (showResetForm ? "Reset Password" : "Login")}</h1>
            <form onSubmit={formik.handleSubmit} className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                    className="p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                )}

                {!showResetForm && (
                    <>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...formik.getFieldProps('password')}
                            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="text-red-500 text-sm">{formik.errors.password}</div>
                        )}
                    </>
                )}

                <button
                    type="submit"
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 bg-blue-500 text-white"
                    disabled={formik.isSubmitting || !formik.isValid}
                >
                    {showResetForm ? "Send Reset Link" : "Login Here"}
                </button>
            </form>
            
            <button onClick={toggleForgotPassword} className="p-2 border border-gray-300 rounded-lg mb-2 text-blue-700">
                {showResetForm ? "Back to Login" : "Forgot Password?"}
            </button>
            
            {!showResetForm && (
                <Link href="/signup" passHref className="text-blue-500 hover:underline">Visit Signup Page
                </Link>
            )}
        </div>
    );
};


export default Login;
