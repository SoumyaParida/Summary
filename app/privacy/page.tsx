"use client";


import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Form } from "@/components/contactForm/Form";

function Privacy() {

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

        <div className="container mx-auto my-10 max-w-7xl cpx-4 sm:px-6 lg:px-60">
              
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h2>
                  <p className="text-sm text-gray-500">Last updated on Jan 08th 2025</p>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  This privacy policy sets out how <strong>"YT Recipe Summary"</strong> uses and protects any information that you give YT Recipe Summary when you visit their website and/or agree to purchase from them.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  "YT Recipe Summary" is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this privacy statement.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  "YT Recipe Summary" may change this policy from time to time by updating this page. You should check this page periodically to ensure that you are aware of any changes.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Information We May Collect</h3>
                <ul className="list-disc list-inside text-gray-700 mb-8 pl-4">
                  <li>Personally Identifiable Information: We collect your name and email address during account creation or login to manage your account and subscription.</li>
                  <li>Authentication Information: We securely store passwords to facilitate user authentication.</li>
                  <li>Financial and Payment Information: Payments are processed via a third-party service i.e. "Rozor Pay", website: "https://razorpay.com/", and we do not store or process your payment information directly.</li>
                  <li>Web History: We collect and store user activity, such as search or video summary history, to enhance the user experience.</li>
                  <li>Demographic information such as preferences, and interests, if required</li>
                  <li>Other information relevant to customer surveys and/or offers</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">What We Do With The Information We Gather</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We require this information to understand your needs and provide you with a better service, particularly for the following reasons:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 pl-4">
                  <li>Internal record keeping</li>
                  <li>Improving our products and services</li>
                  <li>
                    Sending periodic promotional emails about new products, special offers, or other information that may be of interest, using the email address you have provided.
                  </li>
                  <li>
                    Contacting you for market research purposes, which may include communication via email, phone, fax, or mail.
                  </li>
                  <li>Customizing the website according to your interests.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">Security</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have implemented suitable measures.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4">How We Use Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  A cookie is a small file that asks permission to be placed on your computer's hard drive. Once you agree, the file is added, and the cookie helps analyze web traffic or notifies you when you visit a particular site. Cookies allow web applications to respond to you as an individual by tailoring their operations to your preferences.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website to tailor it to customer needs. We only use this information for statistical analysis purposes, and the data is removed from the system afterward.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline them if preferred. This may prevent you from taking full advantage of the website.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Controlling Your Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  You may choose to restrict the collection or use of your personal information in the following ways:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 pl-4">
                  <li>
                    Look for the box that you can click to indicate that you do not want the information to be used for direct marketing purposes when filling in a form on the website.
                  </li>
                  <li>
                    If you have previously agreed to us using your personal information for direct marketing, you may change your mind at any time by contacting us via email.
                  </li>
                </ul>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  We will not sell, distribute, or lease your personal information to third parties without your permission or unless required by law. We may use your personal information to send you promotional information about third parties if you have opted for this.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  If you believe that any information we are holding on you is incorrect or incomplete, please contact us at the address provided below. We will promptly correct any incorrect information.
                </p>

                <address className="text-gray-700">
                  <strong>Contact Us: </strong>
                  Chikkathogur Main Road, Basapura,
                  Bengaluru, Karnataka, 560100
                  Email: <a href="mailto:soumya.parida3@gmail.com" className="text-blue-600 hover:text-blue-800">soumya.parida3@gmail.com</a>
                </address>
               
              
      
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

export default Privacy