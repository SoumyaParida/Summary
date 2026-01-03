"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { summarizeRecipe } from "@/utils/AiModal";
import "./Landing.css";

import moment from 'moment'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext'
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext'

import { db } from '@/utils/db'
import { AIOutput, UserSubscription } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'

import { eq, desc, and } from 'drizzle-orm';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function formatMessageToReactElements(text: string): (string | JSX.Element)[] {
  const parts = text
    .split(/(\*\*.*?\*\*|\*.*?\*|\n)/g) // Split by bold (**text**), italic (*text*), and newline
    .filter(Boolean); // Remove empty strings

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Bold text
      return (
        <b key={index}>{part.slice(2, -2)}</b> // Remove the ** and wrap in <b>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      // Italic text
      return (
        <i key={index}>{part.slice(1, -1)}</i> // Remove the * and wrap in <i>
      );
    }
    if (part === "\n") {
      // Newline
      return <br key={index} />;
    }
    return part; // Regular text
  });
}

interface HISTORY {
  id: number;
  formData: string | null;
  aiResponse: string | null;
  templateSlug: string | null;
  createdBy: string | null;
  createdAt: string | null;
};

const Dashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUrl = searchParams.get("url") || "";

  const [url, setUrl] = useState(initialUrl);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [aiOutput,setAiOutput]=useState<string>('');
  const {user}=useUser();
  const {totalUsage,setTotalUsage}=useContext(TotalUsageContext)
  const {userSubscription,setUserSubscription}=useContext(UserSubscriptionContext);
  const {updateCreditUsage,setUpdateCreditUsage}=useContext(UpdateCreditUsageContext)

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (isValidYouTubeUrl(url)) {
      // set query
      const params = new URLSearchParams();
      params.set("url", url);
      router.push(`?${params.toString()}`);

      // Run summarize function if URL is present
      GenerateAIContent(url);
    }
    GetData();
  }, [url]);

  const isValidYouTubeUrl = (url: string) => {
    try {
      const { hostname, pathname, searchParams } = new URL(url);
      return (
        ((hostname === "www.youtube.com" || hostname === "youtube.com") &&
          pathname === "/watch" &&
          searchParams.has("v")) ||
        (hostname === "youtu.be" && pathname.length > 1)
      );
    } catch {
      return false;
    }
  };

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

  const SaveInDb=async(url:string,slug:string,aiResp:string)=>{
        const result=await db.insert(AIOutput).values({
            formData:url,
            templateSlug:slug,
            aiResponse:aiResp,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD/MM/yyyy HH:mm:ss'),
        });

        //console.log(result);
    }

  const GenerateAIContent=async(videoUrl: string)=>{
        //console.log("totalUsage", totalUsage)
        if(totalUsage>=10000&&!userSubscription)
            {
                console.log("Please Upgrade");
                router.push('/dashboard/billing')
                return ;
            }
        else if (totalUsage>=100000)
            {
                console.log("Please Upgrade");
                router.push('/dashboard/billing')
                return ;
            }
        try {
            setLoading(true);
            const generatedSummary = await summarizeRecipe(videoUrl);
            setSummary(generatedSummary);
            await SaveInDb(videoUrl, "youtube-ai", generatedSummary);
          } catch (error) {
            console.error(error);
            const text = "Sorry, We couldn't get the text from this video. Please try another video."
            setSummary(text);
          } finally {
            setLoading(false);
          }
    }


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

            //console.log("subscription.length", subscription.length)
              
            if (subscription.length === 0) {
              let total:number=0;
              const maxValue = 10000;
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
                    const templateSlug = "youtube-ai";

                    // Aggregate word counts by templateSlug
                    if (wordCountMap.has(templateSlug)) {
                      wordCountMap.set(templateSlug, wordCountMap.get(templateSlug)! + wordCount);
                    } else {
                      wordCountMap.set(templateSlug, wordCount);
                    }

                    total += wordCount;
                  }
                });
                setTotalUsage(total);
            }
          } catch (error) {
            console.error("Error calculating total usage:", error);
          }
        };
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //handleSummarize(url);
    GenerateAIContent(url);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
  };

  const handleClear = () => {
    setUrl(""); // Clear the URL input
  };

  return (
    <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 pb-10 bg-white">                
      <main className="mt-4 flex min-h-screen flex-col sm:p-8 bg-white">
        <section className="flex flex-col items-center py-8 px-4">
          <h1 className="text-7xl font-bold text-center text-gray-800 dark:text-gray-200">
            YouTube Video Summary
          </h1>

          <div className="mt-5 max-w-3xl text-center mx-auto">
                          <p className="text-lg text-gray-600 dark:text-neutral-400">
                          <b>AI-powered, We turn your favorite YouTube videos into beautifully summarized,
                            well-texted guides in any language!</b></p>
                  </div>

         
          <div className="overflow-y-auto w-full rounded-md dark:bg-neutral-800">
        </div>
        </section>
       
        <form className="w-full max-w-md mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <Input
              type="url"
              placeholder="Enter YouTube URL"
              value={url}
              onChange={handleInputChange}
              ref={inputRef}
              className="summary-content flex-grow"
            />
            <button
              type="button"
              onClick={handleClear}
              className="text-red-500 underline text-sm"
            >
              <b>Clear</b>
            </button>
          </div>
          <Button type="submit" disabled={loading} className="w-full button-content">
            Summarize
          </Button>
        </form>
       
        {loading && <Loader2 className="w-12 h-12 mx-auto mt-8 animate-spin" />}
        {summary && !loading && (
          <div className="summary-container">
            <h2 className="summary-title"><b>Summary</b></h2>
                <p className="summary-content">{formatMessageToReactElements(summary)}</p>
          </div>
        )}
        <p></p>
        <p></p>
        <br></br>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            **YT Summary can make mistakes. Check important info.
          </p>
        </div>
        
      </main>  
    </div>
  );
};

export default Dashboard;
