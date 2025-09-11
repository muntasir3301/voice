
import Link from 'next/link';

function Footer() {
  return (
    <div className="bg-gray-900">
      <div className="max-w-2xl mx-auto text-white py-10">
        <div className="text-center pb-20 pt-4">
          <h3 className="text-2xl mb-3">Your voice is data, your words are history.</h3>
          <p className='text-sm'>Voice data collection for academic research</p>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
          <p className="order-2 md:order-1 mt-8 md:mt-0  text-[13px]">
            &copy; <a target='_blank' href="#"> Copyright@ 2025 All rights reserved!</a>
          </p>
          <div className="order-1 md:order-2 text-[13px]">
            <span className="px-2">  <Link href={'/login'}>Login</Link> </span>
            <span className="px-2 border-l"> <Link href={'/register'}>Register</Link> </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
