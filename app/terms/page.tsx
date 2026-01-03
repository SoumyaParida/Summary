"use client";


import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Form } from "@/components/contactForm/Form";

function Terms() {

return (
   <div>
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

        <div className="container mx-auto my-10 max-w-7xl px-4 sm:px-6 lg:px-60">
          <h2 className="text-2xl font-bold mb-6">Terms & Conditions</h2>
          <p className="text-gray-600 mb-10">Last updated on Jan 08th 2025</p>

          <p className="mb-6">
              For the purpose of these Terms and Conditions, the terms <strong>"we", "us", "our"</strong> used anywhere on this page shall mean 
              "YT Recipe Summary", whose registered/operational office is "Chikkathogur Main Road, Basapura, 
              Bengaluru, Karnataka, 560100". The terms <strong>"you", “your”, "user", “visitor”</strong> shall mean any natural or 
              legal person who is visiting our website and/or agreed to purchase from us.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">General Use</h3>
          <p className="mb-6">
              Your use of the website and/or purchase from us is governed by the following Terms and Conditions:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-3">
              <li>
                  The content of the pages of this website is subject to change without notice.
              </li>
              <li>
                  Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, 
                  or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge 
                  that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such 
                  inaccuracies or errors to the fullest extent permitted by law.
              </li>
              <li>
                  Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall 
                  not be liable. It shall be your own responsibility to ensure that any products, services, or information available through 
                  our website and/or product pages meet your specific requirements.
              </li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-4">Ownership and Copyright</h3>
          <p className="mb-6">
              Our website contains material that is owned by or licensed to us. This material includes, but is not limited to, the design, 
              layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which 
              forms part of these terms and conditions.
          </p>
          <p className="mb-6">
              All trademarks reproduced on our website which are not the property of, or licensed to, the operator are acknowledged on the 
              website.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-4">Restrictions and Liability</h3>
          <ul className="list-disc list-inside mb-6 space-y-3">
              <li>
                  Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
              </li>
              <li>
                  From time to time, our website may also include links to other websites. These links are provided for your convenience to 
                  provide further information.
              </li>
              <li>
                  You may not create a link to our website from another website or document without "YT Recipe Summary"’s prior written consent.
              </li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-4">Governing Law and Disputes</h3>
          <p className="mb-6">
              Any dispute arising out of the use of our website and/or purchase with us and/or any engagement with us is subject to the laws of 
              India.
          </p>
          <p className="mb-6">
              We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of 
              authorization for any Transaction, on account of the Cardholder having exceeded the preset limit mutually agreed by us with our 
              acquiring bank from time to time.
          </p>
        </div>




        {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 YT Recipe Summary. All rights reserved.</p>
          <div className="mt-6">
            <Link href="/contact" className="text-gray-400 hover:text-gray-100">Contact Us </Link>|
            <Link href="/privacy" className="text-gray-400 hover:text-gray-100"> Privacy Policy </Link>|
            <Link href="/terms" className="text-gray-400 hover:text-gray-100"> Terms of Service</Link>
          </div>
        </div>
      </footer>
      
      </div>
       );
}

export default Terms