import React from "react";
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { currentUser } from '@clerk/nextjs/server'
import { desc, eq, and } from 'drizzle-orm'
import Image from 'next/image'
import CopyButton from './_components/CopyButton'
import UsageTrack from '../_components/UsageTrack';

export interface HISTORY{
    id:Number,
    formData:string,
    aiResponse:string,
    templateSlug:string,
    createdBy:string,
    createdAt:string
}

async function History() {
    
    const user=await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
        return []; // Return an empty array or handle the error
      }
    
    {/* @ts-ignore */}
    const HistoryList:HISTORY[]=await db
                .select()
                .from(AIOutput)
                .where(
                    and(
                        eq(AIOutput?.createdBy,user?.primaryEmailAddress?.emailAddress),
                        eq(AIOutput.templateSlug, "youtube-ai"))
                    )
                .orderBy(desc(AIOutput.id));

  return (
    <div className='m-5 p-5 border rounded-lg bg-white'>
        <h2 className='font-bold text-3xl'>History</h2>
        <p className='text-gray-500'>Search your previously generate AI content</p>
        <div className='grid grid-cols-7 font-bold bg-secondary mt-5 py-3 px-3'>
            <h2 className='col-span-2'>URL</h2>
            <h2 className='col-span-2'>SUMMARY</h2>
            <h2>DATE</h2>
            <h2>WORDS</h2>
            <h2>COPY</h2>
        </div>
        {HistoryList.map((item:HISTORY,index:number)=>(
            <>
            <div className='grid grid-cols-7 my-5 py-3 px-3'>
            <h2 className='col-span-2 flex gap-2 items-center'>{item.formData}</h2>
            <h2 className='col-span-2 line-clamp-3 mr-3'>{item?.aiResponse}</h2>
            <h2>{item.createdAt}</h2>
            <h2>{item?.aiResponse.length}</h2>
            <h2>
              <CopyButton aiResponse={item.aiResponse} formData={item.formData} />
            </h2>
        </div>
        <hr/>
            </>
        ))}
    </div>
  )
}

export default History