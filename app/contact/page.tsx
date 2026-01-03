"use client";


import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Form } from "@/components/contactForm/Form";

function Contact() {

return (
   <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <header>
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={300}
                height={150}
                priority
                className="hover:opacity-90"
              />
            </Link>

            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-lg font-medium text-gray-500 hover:text-white-600 py-2 px-2 rounded-md bg-gradient-to-tl from-blue-600 to-violet-600 text-white"
              >
                Dashboard
              </Link>
            </div>
          </nav>
        </header>

       
     
      
        <h1 className="text-6xl text-center my-10">
          Contact Us
        </h1>

        <div className="container mx-auto my-10 max-w-7xl cpx-4 sm:px-6 lg:px-60">
          <Form />
        </div>
      
    
      
      </div>

       );
}

export default Contact