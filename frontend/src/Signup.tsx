import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './components/ui/Button';
import { Label } from './components/ui/Label';
import { useGeolocated } from 'react-geolocated';
import logo from './assets/imageBG.png';
import "react-phone-number-input/style.css";
import React from "react";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { supabase } from './supabase';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [foodBankInfo, setFoodBankInfo] = useState({
        title: '',
        address: '',
        website: '',
        description: '',
    });
    const handleFoodBankInfoChange = (e:any) => {
        const { name, value } = e.target;
        setFoodBankInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const profileImage = "";
    const [loading, setLoading] = useState(false);
    const history = useNavigate();
    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data && data.user) {
                history('/dashboard');
            }
        };
        checkUser();
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (role === "receiver" && foodBankInfo.title === "") {
            setIsPopupOpen(true);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        profile_image: profileImage,
                        role: role,
                        foodbank: foodBankInfo,
                        location: coords ? `${coords.latitude}, ${coords.longitude}` : null,
                    },
                },
            });

            if (error) {
                throw error;
            }

            alert("Check your email for the confirmation link.");
            history('/login');
        }
        catch (error: any) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

return (
    <div className="min-h-screen flex flex-col md:flex-row">
        <div className = "md:w-2/5 2-full flex flex-col justify-center items-center px-6 py-12 md:px-12 bg-gradient-to-br from-emerald-50 to-green-100">
            <div className = "w-full max-w-md space-y-8">
                <a href = "/" className = "flex items-center justify-center space-x-3">
                    <img src={logo} alt="Logo" className="w-16 md:w-20 rounded-xl" alt="Logo" />
                    <h1 className = "text-4xl md:text-5xl font-bold text-green-900">
                        FreshBay
                    </h1>
                </a>

                <form onSubmit={handleSignup} className="mt-8 space-y-6">
                    <h2 className = "text-center text-2xl font-bold text-green-900">
                        Create Your Account
                    </h2>

                    {error && (
                        <div className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className = "block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className = "space-y-4">
                        <div className = "grid grid-cols-2 gap-4">
                            <div>
                                <Label className = "text-sm font-medium text-gray-700">
                                    First Name
                                </Label>
                                <input
                                    type="text"
                                    placeholder = "John"
                                    className = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 transition duration-200 ease-in-out"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label className = "text-sm font-medium text-gray-700">
                                    Last Name
                                </Label>
                                <input
                                    type="text"
                                    placeholder = "Doe"
                                    className = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 transition duration-200 ease-in-out"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label className = "text-sm font-medium text-gray-700">
                                    Role
                                </Label>
                                <Select onValueChange={setRole}>
                                    <SelectTrigger className = "">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Roles</SelectLabel>
                                            <SelectItem value="receiver">User</SelectItem>
                                            <SelectItem value="donor">Donor</SelectItem>
                                            <SelectItem value="donor">Reciever</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className = "text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <input
                                    type="password"
                                    className = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 transition duration-200 ease-in-out"
                                    value={email}
                                    placeholder = "********"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className = "space-y-2 text-center text-sm">
                                <p className = "text-gray-600">
                                    Already have an account? 
                                    <a href="/login" className = "font-medium text-green-600 hover:text-green-500 transition-colors">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                            <Button 
                                type="submit"
                                className = {`w-full bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2.5 text-center transition duration-200 ease-in-out ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={loading}
                                onClick={() => {
                                    if (role === "receiver" && foodBankInfo.title === "") {
                                        setIsPopupOpen(true);
                                    }
                                }
                        }}
                    >
                        {loading ? (
                            <span className = "flex items-center justify-center">
                                <svg 
                                    className = "animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill = "none"
                                    viewBox = "0 0 24 24"
                                >
                                    <circle 
                                        className = "opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path 
                                        className = "opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A8.001 8.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574z"
                                    ></path>
                                </svg>
                                Creating Account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                        </Button>
                    </form>
                </div>
            </div>
            
            <div className = "hidden md:block md:w-3/5 bg-gradient-to-br from-green-50 to-green-100 p-8">
            {[...Array(35)].map((_, i) => (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className = "bg-white/10 rounded-lg"
                />
                ))}
            </div>

            <motion.div
                animate={{
                    y: [-10, 10],
                    opacity: [0.5, 1, 0.8],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    yoyo: true,
                }}
                className = "absolute top-20 left-20 p-4 bg-white/10 blackdrop-blur-md rounded-xl"
            >