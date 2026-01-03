"use client";

import React, { useState, useEffect, useContext } from 'react';
import { db } from '@/utils/db';
import { AIOutput,UserSubscription } from '@/utils/schema';
import { eq, desc, and } from 'drizzle-orm';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useUser } from '@clerk/nextjs';
import "@/app/HomePage.css"
import { Button } from '@/components/ui/button'
import Image from 'next/image'

import moment from 'moment';


interface HISTORY {
  id: number;
  formData: string | null;
  aiResponse: string | null;
  templateSlug: string | null;
  createdBy: string | null;
  createdAt: string | null;
};

interface GroupedDataEntry {
  templateSlug: string;
  wordCount: number;
}

interface PieDataEntry {
  name: string;
  value: number;
}

const solutions = [
    {
      title: 'Tutor AI',
      link: '/dashboard/content/tutor-ai',
      description:'Tutor AI is an intelligent tool designed to assist students in their academic journey.',
      icon:'/flipchart.png',
    },
    {
      title: 'Contract Summariser',
      description: 'It is an advanced tool designed to simplify lengthy and complex contracts.',
      link: '/dashboard/content/contract-summariser',
      icon: '/agreement.png',
    },
    {
      title: 'Recipe Summariser',
      description: 'It is an AI tool designed to quickly extract and summarize key details from YouTube recipe videos.',
      link: '/dashboard/content/youtube-summariser',
      icon:'/youtube-content.png',
    },
    {
      title: 'Audio to Text',
      description: 'Converts spoken language from audio files into accurate text transcripts.',
      link: '/dashboard/content/audio-to-text-ai',
      icon:'/audio-message.png',
    },
  ];


function credits() {

  const [userSearchInput, setUserSearchInput] = useState<string>('');
  const [chartData, setChartData] = useState<GroupedDataEntry[]>([]);
  const { user } = useUser();
  const [pieData, setPieData] = useState<PieDataEntry[]>([]);
  const [total,setTotalUsage]=useState(0)

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
              console.error("Email address is undefined");
              return null; // Handle undefined email as needed
            }

      const totalUsageResult:HISTORY[]=await db.select().from(AIOutput).where(eq(AIOutput.createdBy,user.primaryEmailAddress.emailAddress));

      GetTotalUsageFromLastSubscription(totalUsageResult);

      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const GetTotalUsageFromLastSubscription = async (result: HISTORY[]) => {
          try {
            // Fetch the last active subscription
            if (!user?.primaryEmailAddress?.emailAddress) {
              console.error("Email address is undefined");
              return null; // Handle undefined email as needed
            }
            const subscription = await db
              .select()
              .from(UserSubscription)
              .where(
                and(eq(UserSubscription.email, user.primaryEmailAddress.emailAddress),
                    eq(UserSubscription.active, true)
                )
              )

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
                let wordCountMap = new Map<string, number>();

                result.forEach((element) => {
                  const elementDate = moment(element.createdAt, "DD/MM/yyyy HH:mm:ss");

                  if (elementDate.isSameOrAfter(lastSubscriptionDate)) {
                    let wordCount = element?.aiResponse?.length || 0;
                    const templateSlug = element?.templateSlug || "Unknown";

                    // Aggregate word counts by templateSlug
                    if (wordCountMap.has(templateSlug)) {
                      wordCountMap.set(templateSlug, wordCountMap.get(templateSlug)! + wordCount);
                    } else {
                      wordCountMap.set(templateSlug, wordCount);
                    }

                    total += wordCount;
                  }
                });

                // Convert the Map into an array for chart data
                const acc = Array.from(wordCountMap, ([templateSlug, wordCount]) => ({
                  templateSlug,
                  wordCount,
                }));

                setChartData(acc);

                setTotalUsage(total);
                let maxValue = 0
                if(subscription.length === 0)
                  {
                    //console.log("Please Upgrade");
                    maxValue = 10000;
                  }
                else
                  {
                    maxValue = 100000;
                  }

                  //console.log("Page totalUsage", total)
                  //console.log("Page maxValue", maxValue)

                  setPieData([
                      { name: 'Total Usage', value: total },
                      { name: 'Remaining', value: Math.max(0, maxValue - total) },
                    ]);

                //console.log(`Total usage from last subscription (${lastSubscriptionTimestamp}): ${total}`);
            }
          } catch (error) {
            console.error("Error calculating total usage:", error);
          }
        };

  const COLORS = ['#3498db', '#e74c3c'];

  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
    <main className="mt-4 flex min-h-screen flex-col sm:p-8 bg-white">
        <section className="flex flex-col items-center py-8 px-4">
          <h1 className="text-7xl font-bold text-center text-gray-800 dark:text-gray-200">
            Credits
          </h1>

          <div className="mt-5 max-w-3xl text-center mx-auto">
                          <p className="text-lg text-gray-600 dark:text-neutral-400">
                          <b>AI-powered, YouTube Video Summary turn your favorite YouTube recipes into beautifully summarized,
                            well-texted guides in any language!</b></p>
          </div>
          <p></p>
          <p></p>
          <br></br>
        </section> 
        
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          **YT Summary can make mistakes. Check important info.
        </p>
      </div>
      </main>    
    </div>
  );
};

export default credits