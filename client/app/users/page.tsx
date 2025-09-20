"use client";
import api from "@/utils/axiosConfig";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton";

export type UserType ={
  id: number;
  sentence_id: number;
  username: string;
  role: string;
  total: number;
  accept: number;
  ref_code: number;
  text: string;
}

type AllUserType ={
  user_id: number;
  username: string;
  profile:{
    user_id: number;
    age: number;
    city: string;
    total: number;
    accept: number;
  }
}

export default function Users() {
  const [user, setUser] = useState<UserType>();
  const [allUser, setAllUsers] = useState<AllUserType[]>();
  const [totalAccept, setTotalAccept] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!user) return;

    api.get(`/users/${user.ref_code}`)
    .then((res)=>{
      const total = res.data.reduce((acc: number, ele: {profile: {accept: number}})=> acc + ele.profile.accept, 0);
      
      setTotalAccept(total);
      setAllUsers(res.data);
    })
    .catch((err)=> console.log(err))
    .finally(()=> setLoading(false))

  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);


  

  return (
   <>
    <section className="container pt-12 pb-16">
      <h2 className="text-2xl border-l-[3px] pl-3 mb-4 border-primary">All the users under
        {
          !loading &&  <><span className="text-orange-700 ml-2">{user?.username}</span> <span className="text-sm">({user?.ref_code})</span></>
        }
      </h2>
      {/* Statics  base on the user role */}
      <Table className="border">
        <TableHeader className="bg-primary/40">
          <TableRow>
            <TableHead className="w-[1%] text-center text-black">NO.</TableHead>
            <TableHead className="w-[1%] text-center text-black">UserId</TableHead>
            <TableHead className="w-[4%] text-center text-black">Username</TableHead>
            <TableHead className="w-[2%] text-center text-black">City</TableHead>
            <TableHead className="w-[2%] text-center text-black">Age</TableHead>
            <TableHead className="w-[1%] text-center text-black">Tottal</TableHead>
            <TableHead className="w-[1%] text-center text-black">Accepted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
      {
        loading ? 
        Array.from({ length: 10 }).map((ele, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="w-full h-5"/>
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-5"/>
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-5"/>
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-5"/>
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-5"/>
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-5"/>
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-5"/>
              </TableCell>
            </TableRow>
          ))
          :
        allUser ?  allUser.map((data, i) => (
          <TableRow key={i} className={`${i%2==1 && "bg-primary/10"}`}>
            <TableCell className="text-center">{i+1}</TableCell>
            <TableCell className="text-center">{data.profile.user_id}</TableCell>
            <TableCell className="text-center">{data.username}</TableCell>
            <TableCell className="text-center">{data.profile.city}</TableCell>
            <TableCell className="text-center">{data.profile.age}</TableCell>
            <TableCell className="text-center">{data.profile.total}</TableCell>
            <TableCell className="text-center">{data.profile.accept}</TableCell>
          </TableRow>
        ))
        :
        <h2 className="text-xl w-60 pl-5 py-6">No users found</h2>
      }
        
        </TableBody>
        <TableFooter className="bg-gray-50">
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="text-center text-black">Total: {totalAccept}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
     </section>
   </>
  );
}
