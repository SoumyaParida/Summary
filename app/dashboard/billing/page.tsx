"use client"
import { Button } from '@/components/ui/button'
import React, { useState, useEffect, useContext } from 'react';
import axio from 'axios'
import { Loader2Icon } from 'lucide-react';
import { db } from '@/utils/db';
import { AIOutput,UserSubscription } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext';
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext';
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext';
import Link from "next/link";
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
import "@/app/HomePage.css"
import Image from 'next/image'

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

function billing() {
  const [userSearchInput, setUserSearchInput] = useState<string>('');
  const [chartData, setChartData] = useState<GroupedDataEntry[]>([]);
  const { user } = useUser();
  const [pieData, setPieData] = useState<PieDataEntry[]>([]);
  const [loading,setLoading]=useState(false);
  const {userSubscription,setUserSubscription}=useContext(UserSubscriptionContext);

  const {totalUsage,setTotalUsage}=useContext(TotalUsageContext)
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
      if (!user?.primaryEmailAddress?.emailAddress) {
        return []; // Return an empty array or handle the error
      }

       {/* @ts-ignore */}
      const result:HISTORY[]=await db
                              .select()
                              .from(AIOutput)
                              .where(
                                and(
                                    eq(AIOutput.createdBy,user?.primaryEmailAddress?.emailAddress),
                                    eq(AIOutput.templateSlug, "youtube-ai")
                                  )
                                );
      
      GetTotalUsageFromLastSubscription(result)
  }

  const IsUserSubscribe=async()=>{
      const email = user?.primaryEmailAddress?.emailAddress || "";
       {/* @ts-ignore */}
      const result = await db
            .select()
            .from(UserSubscription)
            .where(
              and(
                eq(UserSubscription.email, email),
                eq(UserSubscription.active, true),
                eq(UserSubscription.templateSlug, "youtube-ai")
              )
            );
      
      //console.log(result)
      if(result.length>0)
          {
              setUserSubscription(true);
              setMaxWords(100000);
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

      const totalUsageResult:HISTORY[]=await db
                                  .select()
                                  .from(AIOutput)
                                  .where(
                                    and(
                                      eq(AIOutput.createdBy,user.primaryEmailAddress.emailAddress),
                                      eq(AIOutput.templateSlug, "youtube-ai")
                                    )
                                  );

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
              and(
                eq(UserSubscription.email, user.primaryEmailAddress.emailAddress),
                eq(UserSubscription.active, true),
                eq(UserSubscription.templateSlug, "youtube-ai")
              )
            );


            //console.log("subscription", subscription)
              
            if (subscription.length === 0) {
              let total:number=0;
              const maxValue = 10000;
                result.forEach(element => {
                    total=total+Number(element.aiResponse?.length) 
                });

                setTotalUsage(total)
                //console.log("subscription.length total", total)
                setPieData([
                      { name: 'Total Usage', value: total },
                      { name: 'Remaining', value: Math.max(0, maxValue - total) },
                    ]);
              return;
            }
            else{
                const lastSubscriptionTimestamp = subscription[0].joinDate;
                const lastSubscriptionDate = moment(lastSubscriptionTimestamp, "DD/MM/yyyy HH:mm:ss");

                //console.log("lastSubscriptionTimestamp", lastSubscriptionTimestamp);
                //console.log("lastSubscriptionDate", lastSubscriptionDate)

                // Filter HISTORY records based on the last subscription timestamp
                let total = 0;
                let wordCountMap = new Map<string, number>();

                result.forEach((element) => {
                  const elementDate = moment(element.createdAt, "DD/MM/yyyy HH:mm:ss");

                  //console.log("elementDate", elementDate)
                  //console.log("lastSubscriptionDate", lastSubscriptionDate)


                  if (elementDate.isSameOrAfter(lastSubscriptionDate)) {
                    let wordCount = element?.aiResponse?.length || 0;
                    const templateSlug = "youtube-ai";

                    // Aggregate word counts by templateSlug
                    if (wordCountMap.has(templateSlug)) {
                      wordCountMap.set(templateSlug, wordCountMap.get(templateSlug)! + wordCount);
                    } else {
                      wordCountMap.set(templateSlug, wordCount);
                    }

                    total += wordCount;
                    //console.log("inside for", total)
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
                  //setTotalUsage(0);
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
    
  const CreateSubscription=()=>{
    setLoading(true)
    axio.post('/api/create-subscription',{})
    .then(resp=>{
      //console.log(resp.data);
      OnPayment(resp.data.id)
    },(error)=>{
      setLoading(false);
    })
  }

  const loadScript = (src:any) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const OnPayment=async(subId:string)=>{
    const options={
      "key":"rzp_live_KMoHJlkp5yUkwg",
      "order_id":subId,
      "name":'YT Summary Solutions',
      description:'Monthly Subscription',
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay via UPI',
              instruments: [
                {
                  method: 'upi'
                }
              ],
            },
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
        handler:async(resp:any)=>{
          //console.log(resp);
          if(resp)
            {
              SaveSubcription(resp?.razorpay_payment_id)
            }
          setLoading(false);
        },

        modal:{
            ondismiss: async()=>{
            setLoading(false); 
          }
      }

      }

    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
     );

    if (!res) {
        alert("Razropay failed to load!!");
        return;
    }
    
 
    try{
        // @ts-ignore 
        //console.log("options", options)
        const rzp1=new window.Razorpay(options);
        rzp1.open();
    }
    catch(e)
    {
        console.log("Try Again...",e);
        setLoading(false);
    }
  }

  const SaveSubcription=async(paymentId:string)=>{
    setMaxWords(100000);
    setTotalUsage(0);
    if (user?.primaryEmailAddress?.emailAddress) {
        await db.update(UserSubscription)
              .set({ active: false })
              .where(
                  and(
                      eq(UserSubscription.email, user?.primaryEmailAddress?.emailAddress),
                      eq(UserSubscription.templateSlug, "youtube-ai"))
                  )
    } else {
      console.error("Email address is undefined. Cannot proceed with the query.");
    }

    const result=await db.insert(UserSubscription)
    .values({
      email:user?.primaryEmailAddress?.emailAddress,
      userName:user?.fullName,
      active:true,
      paymentId:paymentId,
      templateSlug:"youtube-ai",
      joinDate:moment().format('DD/MM/yyyy HH:mm:ss')
    });
    //console.log(result);
    if(result)
      {
        window.location.reload();
      }
  }

  return (
    <div>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          
      

      <h2 className='text-center font-bold text-3xl my-3'>Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center">
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
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-transform transform hover:scale-105">
           <ResponsiveContainer width="100%" aspect={1}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="100%"
                    fill="#8884d8"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                   {/* Legend */}
                    <Legend 
                      layout="horizontal"    // Layout of the legend (horizontal or vertical)
                      verticalAlign="bottom" // Aligns the legend vertically
                      align="center"         // Aligns the legend horizontally
                      wrapperStyle={{
                        paddingTop: "10px",  // Adds space between the chart and legend
                        fontSize: "14px",    // Adjusts the legend font size
                        color: "#555",       // Adjusts the legend text color
                      }}
                    />

                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p></p>
          <p></p>
          <br></br>
 
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
 
    <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">
          Free
          <span className="sr-only">Plan</span>
        </h2>

        <p className="mt-2 sm:mt-4">
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> 0₹ </strong>

          
        </p>
      </div>

      <ul className="mt-6 space-y-2">
        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-700"> 10,000 Words </span>
        </li>

        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-700"> Unlimted Download & Copy </span>
        </li>

        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-700"> 1 Month of History </span>
        </li>
      </ul>

      {/* <a
        href="#"
        className="mt-8 block rounded-full 
        border border-indigo-600 
        px-12 py-3 text-center text-sm font-medium bg-gray-500 text-white
          hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
      >
        Currently Active Plan
      </a> */}
    </div>
    <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
      <div className="text-center">


        <p className="mt-2 sm:mt-4">
          <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">299 ₹</strong>

          
        </p>
      </div>

      <ul className="mt-6 space-y-2">
        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-700"> 100,000 Words  </span>
        </li>

        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-700"> Unlimated Download & Copy  </span>
        </li>

        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-700"> 1 Year of History </span>
        </li>

       

      </ul>

      <Button
      disabled={loading}
        onClick={()=>CreateSubscription()}
        className='w-full rounded-full mt-5 p-6'
        variant='outline'
      >
        {loading&&<Loader2Icon className='animate-spin'/>}
        {userSubscription?'Active Plan':  'Get Started'}
      </Button>


    </div>
  </div>
  <div>
          
         
        </div>
</div>
    
    </div>
  )
}

export default billing