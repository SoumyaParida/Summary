"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { AIOutput, UserSubscription } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';

import { eq, and } from 'drizzle-orm';
import React, { useContext, useEffect, useState } from 'react'
import { HISTORY } from '../history/page';
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext';
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext';
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext';

import moment from 'moment';


 function UsageTrack() {

    const {user}=useUser();
    const {totalUsage,setTotalUsage}=useContext(TotalUsageContext)
    const {userSubscription,setUserSubscription}=useContext(UserSubscriptionContext);
    const [maxWords,setMaxWords]=useState(10000)
    const {updateCreditUsage,setUpdateCreditUsage}=useContext(UpdateCreditUsageContext);
    useEffect(()=>{
        user&&GetData();
        user&&IsUserSubscribe();
    },[user]);


    useEffect(()=>{
        user&&GetData();
    },[updateCreditUsage&&user]);

    const GetData=async()=>{
         {/* @ts-ignore */}
        const result:HISTORY[]=await db.select().from(AIOutput).where(eq(AIOutput.createdBy,user?.primaryEmailAddress?.emailAddress));
        
        GetTotalUsageFromLastSubscription(result)
    }

    const IsUserSubscribe=async()=>{
         {/* @ts-ignore */}
        const result=await db.select().from(UserSubscription).where(eq(UserSubscription.email,user?.primaryEmailAddress?.emailAddress));
        //console.log(result)
        if(result.length>0)
            {
                setUserSubscription(true);
                setMaxWords(100000);
                setTotalUsage(0);
            }
    }



    const GetTotalUsage=(result:HISTORY[])=>{
        let total:number=0;
        result.forEach(element => {
            total=total+Number(element.aiResponse?.length) 
        });

        setTotalUsage(total)
        //console.log(total);
    }

    const GetTotalUsageFromLastSubscription = async (result: HISTORY[]) => {
          try {

            if (!user?.primaryEmailAddress?.emailAddress) {
              console.error("Email address is undefined");
              return null; // Handle undefined email as needed
            }

            const subscription = await db
                  .select()
                  .from(UserSubscription)
                  .where(
                    and(
                      eq(UserSubscription.email, user.primaryEmailAddress.emailAddress),
                      eq(UserSubscription.active, true)
                    )
                  );

            if (subscription.length === 0) {
              let total:number=0;
                result.forEach(element => {
                    total=total+Number(element.aiResponse?.length) 
                });

                setTotalUsage(total)
              return;
            }
            else{
                const lastSubscriptionTimestamp = subscription[0].joinDate;
                const lastSubscriptionDate = moment(lastSubscriptionTimestamp, "DD/MM/yyyy HH:mm:ss");

                // Filter HISTORY records based on the last subscription timestamp
                let total = 0;
                result.forEach((element) => {
                  const elementDate = moment(element.createdAt, "DD/MM/yyyy HH:mm:ss");
                    if (elementDate.isSameOrAfter(lastSubscriptionDate)) {
                      total += Number(element.aiResponse?.length || 0);
                    }
                });

                setTotalUsage(total);
                console.log(`Total usage from last subscription (${lastSubscriptionTimestamp}): ${total}`);
            }
          } catch (error) {
            console.error("Error calculating total usage:", error);
          }
        };


  return (
    <div className='m-5'>
        <div className='bg-primary text-white p-3 rounded-lg'>
            <h2 className='font-medium'>Credits</h2>
            <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
                <div className='h-2 bg-white rounded-full'
                style={{
                    width:totalUsage/maxWords>1?100+"%":(totalUsage/maxWords)*100+"%"
                }}
                ></div>
            </div>
            <h2 className='text-sm my-2'>{totalUsage}/{maxWords} credit used</h2>
        </div>
        {/*<Button variant={'secondary'} className='w-full my-3 text-primary'>Upgrade</Button>*/}
    </div>
  )
}

export default UsageTrack