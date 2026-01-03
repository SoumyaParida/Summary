"use client";
import React, { useState, useEffect } from 'react';
import { TotalUsageContext } from '../(context)/TotalUsageContext';
import { UserSubscriptionContext } from '../(context)/UserSubscriptionContext';
import { UpdateCreditUsageContext } from '../(context)/UpdateCreditUsageContext';
import { UserApiKeyContext } from '../(context)/UserApiKeyContext';

import Link from "next/link";
import Image from "next/image";
import { UserButton } from '@clerk/nextjs'

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [totalUsage, setTotalUsage] = useState<Number>(0);
  const [userSubscription, setUserSubscription] = useState<boolean>(false);
  const [updateCreditUsage, setUpdateCreditUsage] = useState<any>();
  const [userApiKey, setUserApiKey] = useState<any>();
  
  return (
    <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
      <UserSubscriptionContext.Provider value={{ userSubscription, setUserSubscription }}>
        <UserApiKeyContext.Provider value={{ userApiKey, setUserApiKey }}>
          <UpdateCreditUsageContext.Provider value={{ updateCreditUsage, setUpdateCreditUsage }}>
    <div className="flex flex-col min-h-screen bg-white">
      <header>
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="logo"
              width={300}
              height={150}
              priority
              className="hover:opacity-90"
            />
          </Link>

          <div className="flex space-x-6">
                <Link href="/dashboard" className="float-left text-lg font-medium text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500">Home</Link>
                <Link href="/dashboard/history" className="float-left text-lg font-medium text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500">History</Link>
                <Link href="/dashboard/billing" className="float-left text-lg font-medium text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500">Billing</Link>
                <Link href="/contact" className="float-left text-lg font-medium text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500">Contact Us</Link>
               <UserButton/>
              </div>
          
          
          
        </nav>
      </header>

      {children}

                    </div>
            
    </UpdateCreditUsageContext.Provider>
        </UserApiKeyContext.Provider>
      </UserSubscriptionContext.Provider>
    </TotalUsageContext.Provider>
  );
}

export default Layout;
