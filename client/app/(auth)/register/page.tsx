"use client"

import { FaCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FormEvent, useState } from "react";
import Link from "next/link";
import api from "@/utils/axiosConfig";


export default function Register() {
    // States
    const [showPass, setShowPass] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setSuccessMsg('');
        setErrMsg('');
        setLoading(true);
        
        const form = e.currentTarget;
        const refcode = parseInt(form.refcode.value);
        const age = parseInt(form.age.value);
        const city = form.city.value;
        const username = form.username.value;
        const password = form.password.value;

        const userData = {age, city, username, password, ref_code: refcode};
        
        api.post('/users/register-user', userData)
        .then(()=>{
          console.log("successfull")
          setSuccessMsg("Successfully Regsiter")
        })
        .catch((err)=>{
          const serverMsg = err.response?.data?.message || "Something went wrong. Try again!";
          setErrMsg(serverMsg);
        })
        .finally(()=> setLoading(false))
    }


    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-[1.3rem] md:text-xl font-bold leading-9 tracking-tight">
              Create an account Its Free
            </h2>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-5">


              {/* Refrence Code */}
              <div>
                <label htmlFor="refcode" className="block text-sm font-medium leading-6">
                  Refrence Code
                </label>
                <div className="mt-2">
                  <input
                    id="refcode"
                    name="refcode"
                    type="number"
                    inputMode="numeric"
                    required
                    placeholder="Inter Your Refrence Code"
                    className="block px-4 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                </div>
              </div>


              {/* Student Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium leading-6">
                  Age
                </label>
                <div className="mt-2">
                  <input
                    id="age"
                    name="age"
                    type="number"
                    inputMode="numeric"
                    required
                    placeholder="Inter your age"
                    className="block px-4 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                </div>
              </div>


               {/* City  */}
              <div className="pb-1">
                <label htmlFor="city" className="block text-sm font-medium leading-6">
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    placeholder="Inter your city"
                    className="block px-4 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                </div>
              </div>


              {/* User Name  */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Inter a username"
                    className="block px-4 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                </div>
              </div>
              
              {/* Password  */}
              <div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6">
                    Set Password
                  </label>
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="Set a password for this account"
                    className="block px-4 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                  <div onClick={()=>setShowPass(!showPass)} style={{marginLeft:'-38px', cursor: 'pointer', fontSize: '22px', background: '', color: "black"}}>
                     {
                        showPass ? 
                        <FaRegEye/>
                        :
                        <FaRegEyeSlash />
                     }
                  </div>
                </div>
              </div>

              <div style={{marginTop: '15px'}}>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : 'Create Account'}
                </button>

                {/* Success or Error Msg  */}
                {
                    successMsg && 
                    <div style={{fontWeight: '500'}} className="flex items-center gap-2 text-green-600 mt-2">
                        <FaCheck/> <p>{successMsg}</p>
                    </div>
                }
                {
                    errMsg &&
                    <div style={{fontWeight: '500'}} className="flex items-center gap-2 text-red-600 mt-2">
                        <MdOutlineErrorOutline/> <p>{errMsg}</p>
                     </div>
                }
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Already a member?{' '}
              <Link href='/login' className="font-semibold leading-6 text-primary hover:text-orange-500">
                  Login Now!
              </Link>
            </p>
          </div>
        </div>
      </>
    )
  }