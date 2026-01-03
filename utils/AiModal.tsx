import { YoutubeTranscript } from "youtube-transcript";

const apiKey = "AIzaSyDQ7irYD3GBDZqvAUXzRp426NrfCrXDyqY";

// Extract video ID from URL
function getVideoId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/
  );
  if (!match) throw new Error("Invalid YouTube URL");
  return match[1];
}

// Clean transcript to reduce tokens
function cleanTranscript(text: string): string {
  return text
    .replace(/\[(music|applause|laughter).*?\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const summarizeRecipe = async (videoUrl: string): Promise<string> => {
  try {
    console.log("YouTube URL:", videoUrl);

    // 1️⃣ Extract video ID
    const videoId = getVideoId(videoUrl);

    // 2️⃣ Fetch transcript
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId);

    const transcriptText = cleanTranscript(
      transcriptArr.map(t => t.text).join(" ")
    );

    if (!transcriptText) {
      throw new Error("Transcript is empty or unavailable");
    }

    // 3️⃣ Prompt
    const prompt = `
        Summarize the following YouTube transcript.

        Detect video type internally: news, vlog, education, podcast, tech, review, or other.

        Transcript:
        ${transcriptText}

        Rules:
        - No external information
        - No repetition
        - Neutral tone
        - Simple language
        - Follow word limit exactly

        Word limits:
        news 80 | vlog 60 | education 90 | podcast 100 | tech 80 | review 70 | other 70
        `;

    // 4️⃣ Call Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!summary) {
      throw new Error("No summary returned by Gemini");
    }

    return summary.trim();
  } catch (error) {
    console.error("Error summarizing video:", error);
    throw error;
  }
};
  
  
 