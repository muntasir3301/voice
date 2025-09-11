"use client"

import { FaCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"


export default function Register() {
    // States
    const [showPass, setShowPass] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    // const [allBatch, setAllBatch] = useState<allBatchType[]>([]);
    // const [batch, setBatch] = useState("");
    // const [tShirtSize, setTshirtSize] = useState("");
    // const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    // const router = useRouter();

    // Use Context

    useEffect(()=>{
    },[])


    const handleSubmit = async(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const stuId = (form.elements.namedItem("stuId") as HTMLInputElement)?.value;
        const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value;

        if(stuId.length!=4){
          alert("Student Id must be last 4 digit!");
          return;
        }
        if(phone.length!=11){
          alert("Phone number must be 11 digit!");
          return;
        }
 

        // Always Clear Messages
        setSuccessMsg('');
        setErrMsg('');
        setUploading(true);

        

        // const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
        // const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
        // const password = (e.target as HTMLFormElement).password.value;
        // const options = { maxSizeMB: 2, maxWidthOrHeight: 1024 };
        
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
              {/* Name  */}
              <div className="pb-1">
                <label htmlFor="email" className="block text-sm font-medium leading-6">
                  Your Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Inter your name"
                    className="block px-4 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                </div>
              </div>

              {/* Select t-Shirt Size  */}
              {/* <Select onValueChange={(value) => setTshirtSize(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="T-shirt Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                    <SelectItem value="XXXL">XXXL</SelectItem>
                    <SelectItem value="XXXXL">XXXXL</SelectItem>
                  </SelectGroup>
                  </SelectContent>
              </Select> */}

              {/* Student Id */}
              <div>
                <label htmlFor="stuId" className="block text-sm font-medium leading-6">
                  Student Id (Last 4 Digit)
                </label>
                <div className="mt-2">
                  <input
                    id="stuId"
                    name="stuId"
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="Inter your 4 digit student id"
                    className="block px-4 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                </div>
              </div>

              {/* Phone Number  */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6">
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="string"
                    inputMode="numeric"
                    required
                    autoComplete="on"
                    placeholder="Inter your phone number"
                    className="block px-4 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                  />
                </div>
              </div>

              {/* Email address  */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6">
                  Email address (Valid)
                </label>
                <span className="text-sm text-gray-500">We will send an email verification link</span>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Inter a valid email address"
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
                  className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {uploading ? (
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
  