"use client";
import { MdRecordVoiceOver } from "react-icons/md";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Header() {
  const pages = [
    { name: "Home", href: "/" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get current route

  // Close the menu when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const [user, setUser] = useState<{role: string} | null>(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }
}, []);



  const handleLogout =()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }


  return (
    <header className="bg-primary py-4">
      <div className="container flex shrink-0 items-center">
        {/* Logo ========================  */}
        <Link href="/" className="flex items-center gap-4" prefetch={false}>
           <MdRecordVoiceOver className="text-orange-500 text-3xl"/>
           <h2 className="text-xl text-white">Voice Collecting</h2>
        </Link>


        {/* Desktop Menu ======================== */}
        <nav className="ml-auto hidden lg:flex lg:items-center gap-3">
          {pages?.map((ele) => (
            <div key={ele.name}>
              <Link
                href={ele.href}
                className="group text-sm inline-flex w-max items-center justify-center rounded px-4 border text-white py-1.5 font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                {ele.name}
              </Link>
            </div>
          ))} 


          {
            user && user.role == "user" ?
              <>
                <div>
                    <Link
                      href={'/review-voice'}
                      className="group text-[13px] inline-flex w-max items-center justify-center rounded px-3 text-white border py-1.5 font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                      prefetch={false}
                    >
                      Review Voice
                    </Link>
                </div>
                
                <div>
                  <Link
                    href={'/users'}
                    className="group text-[13px] inline-flex w-max items-center justify-center rounded px-3 text-white border py-1.5 font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                  >
                    Users
                  </Link>
                </div>
              </>
              :
              ""
          }

          {/* login  */}
            {
              user ? 
              <div>
                <Link
                  href={'/login'}
                  className="group text-[13px] inline-flex w-max items-center justify-center rounded px-4 bg-orange-500/60 border text-white py-1.5 font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                  prefetch={false}
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </div>
            :
            <>
            <div>
              <Link
                href={'/login'}
                className="group text-[13px] inline-flex w-max items-center justify-center rounded px-4 bg-gray- border text-white py-1.5 font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                Login
              </Link>
            </div>
          

            <div>
              <Link
                href={'/register'}
                className="group text-[13px] inline-flex w-max items-center justify-center rounded px-3 text-white border py-1.5 font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                Register
              </Link>
            </div>



            {/* <Link
                href={'/register'}
                className="group text-sm inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
              Register
            </Link> */}
            </>
            }
        </nav>

        {/* Mobile Menu ======================== */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          {/* Mobile menu Icon  */}
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden ml-auto">
              <MenuIcon/>
            </Button>
          </SheetTrigger>

          {/* Mobile Menu */}
          <SheetContent side="left">
            {/* Menu title */}
            <Link href="#" className="mr-6 lg:flex" prefetch={false}>
               <h2 className="text-xl">Voice Collecting</h2>
            </Link>

            {/* Menu links */}
            <div className="grid gap-2 py-6">
              {pages?.map((ele) => (
                <Link
                  key={ele.name}
                  href={ele.href}
                  className="flex w-full items-center py-2 font-semibold"
                  prefetch={false}
                >
                  {ele.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function MenuIcon() {
  return (
    <div  className="h-6 w-6" >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    </div>
  )
}

