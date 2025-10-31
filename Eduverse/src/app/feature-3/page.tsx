"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Sparkles, Info, Brain, Hand, CheckCircle2, Lightbulb, Target, TrendingUp, Camera, Video, BookOpen, Zap } from "lucide-react";

// Gemini API Key (replace with your own if needed)
const GOOGLE_API_KEY = "AIzaSyBimEuo5VS8Ac5Ylzwbz1ooQUY-VIJYsAE";

// Types
interface QuizQuestion {
  question: string;
  type: "mcq" | "short";
  options?: string[];
  hint: string;
  answer?: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

interface QuizReport {
  summary: string;
  score?: number;
  feedback?: string;
}

// Utility to dynamically load a script if not already present
function loadScript(src: string, globalName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>)[globalName]) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}

// Hand gesture detection hook
function useThumbsDownGesture(
  onThumbsDown: () => void,
  cameraActive: boolean,
  errorHandler: (msg: string) => void,
  mediaPipeLoaded: boolean
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<unknown>(null);
  const cameraRef = useRef<unknown>(null);
  const lastGestureRef = useRef<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!cameraActive || !mediaPipeLoaded) return;

    const initializeHands = async () => {
      if (!videoRef.current || !canvasRef.current || !isMounted) return;
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");
        if (!canvasCtx) return;

        const detectGesture = (landmarks: Array<{ y: number }>): string | null => {
          const thumbTip = landmarks[4];
          const thumbIP = landmarks[3];
          const wrist = landmarks[0];
          const isThumbDown = thumbTip.y > thumbIP.y && thumbTip.y > wrist.y;
          return isThumbDown ? "thumbsDown" : null;
        };

        const onResultsHands = (results: { image: CanvasImageSource; multiHandLandmarks?: Array<Array<{ y: number }>> }): void => {
          if (!isMounted) return;
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (let index = 0; index < results.multiHandLandmarks.length; index++) {
              const landmarks = results.multiHandLandmarks[index];
              const win = window as unknown as Record<string, unknown>;
              if (typeof win.drawConnectors === "function" && typeof win.HAND_CONNECTIONS !== "undefined") {
                (win.drawConnectors as (ctx: CanvasRenderingContext2D, l: Array<{ y: number }>, c: unknown, o: { color: string }) => void)(canvasCtx, landmarks, win.HAND_CONNECTIONS, { color: "#00FF00" });
              }
              if (typeof win.drawLandmarks === "function") {
                (win.drawLandmarks as (ctx: CanvasRenderingContext2D, l: Array<{ y: number }>, o: { color: string; fillColor: string; radius: number }) => void)(canvasCtx, landmarks, {
                  color: "#00FF00",
                  fillColor: "#FF0000",
                  radius: 5,
                });
              }
              const gesture = detectGesture(landmarks);
              if (gesture && gesture !== lastGestureRef.current) {
                lastGestureRef.current = gesture;
                onThumbsDown();
              }
              if (!gesture && lastGestureRef.current) {
                lastGestureRef.current = "";
              }
            }
          } else {
            if (lastGestureRef.current) lastGestureRef.current = "";
          }
          canvasCtx.restore();
        };

        const win = window as unknown as Record<string, unknown>;
        const HandsClass = typeof win.Hands === "function" ? (win.Hands as new (args: unknown) => { setOptions: (opts: unknown) => void; onResults: (cb: (results: unknown) => void) => void; send: (input: unknown) => Promise<void>; close: () => void }) : undefined;
        if (!HandsClass) {
          errorHandler("Hands not found on window. Make sure @mediapipe/hands is loaded.");
          return;
        }
        const hands = new HandsClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        hands.onResults((results: unknown) => {
          // Type guard for results
          if (
            typeof results === 'object' && results !== null &&
            'image' in results &&
            'multiHandLandmarks' in results
          ) {
            const typedResults = results as { image: CanvasImageSource; multiHandLandmarks?: Array<Array<{ y: number }>> };
            onResultsHands(typedResults);
          }
        });
        const CameraClass = typeof win.Camera === "function" ? (win.Camera as new (video: HTMLVideoElement, options: { onFrame: () => Promise<void>; width: number; height: number }) => { start: () => Promise<void>; stop: () => void }) : undefined;
        if (!CameraClass) {
          errorHandler("Camera class not found on window. Make sure @mediapipe/camera_utils is loaded.");
          return;
        }
        const camera = new CameraClass(video, {
          onFrame: async () => {
            if (!isMounted) return;
            try {
              await hands.send({ image: video });
            } catch (error) {
              const errMsg = error instanceof Error ? error.message : String(error);
              errorHandler("Error sending frame to hands: " + errMsg);
            }
          },
          width: 480,
          height: 360,
        });
        await camera.start();
        handsRef.current = hands;
        cameraRef.current = camera;
        setIsInitialized(true);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        errorHandler("Error initializing hands: " + errMsg);
      }
    };
    initializeHands();
    return () => {
      isMounted = false;
      if (cameraRef.current && typeof (cameraRef.current as { stop?: () => void }).stop === "function") {
        try {
          (cameraRef.current as { stop: () => void }).stop();
        } catch {}
      }
      if (handsRef.current && typeof (handsRef.current as { onResults?: () => void; close?: () => void }).close === "function") {
        try {
          (handsRef.current as { onResults?: () => void; close: () => void }).onResults = () => {};
          (handsRef.current as { close: () => void }).close();
        } catch {
        } finally {
          handsRef.current = null;
        }
      }
    };
  }, [cameraActive, onThumbsDown, errorHandler, mediaPipeLoaded]);

  return { videoRef, canvasRef, isInitialized };
}

// Helper function for retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === maxRetries - 1;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check if it's a retryable error (overloaded, rate limit, etc.)
      const isRetryable = errorMessage.includes("overloaded") || 
                          errorMessage.includes("429") ||
                          errorMessage.includes("Resource exhausted");
      
      if (isLastRetry || !isRetryable) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
}

// Gemini API helpers
async function fetchQuiz(topic: string): Promise<QuizData> {
  const prompt = `Generate 5 quiz questions on the topic "${topic}". 

IMPORTANT: Return ONLY a valid JSON array, nothing else. No markdown, no code blocks, no explanations.

For each question, provide:
- question: The question text
- type: Either "mcq" or "short"
- options: If MCQ, exactly 4 options as an array of strings
- answer: The correct answer
- hint: A helpful hint

JSON format:
[
  {
    "question": "What is 2+2?",
    "type": "mcq",
    "options": ["2", "3", "4", "5"],
    "answer": "4",
    "hint": "Think about basic addition"
  }
]

Return ONLY the JSON array, no other text.`;

  return retryWithBackoff(async () => {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GOOGLE_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    let text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to extract JSON from the response
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Raw API response:", text);
      throw new Error("No JSON array found in API response");
    }
    
    text = text.slice(jsonStart, jsonEnd + 1);
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const questions = JSON.parse(text);
      
      // Validate the questions
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid questions format");
      }
      
      return { questions };
    } catch (error) {
      console.error("Failed to parse:", text);
      console.error("Parse error:", error);
      throw new Error("Failed to parse quiz questions from Gemini API. Please try again.");
    }
  });
}

async function fetchReport(
  questions: QuizQuestion[],
  answers: string[],
  hintsInfo: { question: string; hintTaken: boolean }[],
  score: number
): Promise<QuizReport> {
  const prompt = `Given the following quiz questions, the user's answers, the correct answers, and which questions had hints shown, generate a short, crisp, highly personalized report (max 3-4 sentences for the summary).\nInclude:\n- A short summary (max 3-4 sentences, highly personalized, not generic)\n- The user's score out of 5 (show this first)\n- Feedback for improvement\n- A table listing for each question: the question, the user's answer, the correct answer, whether a hint was used, and a suggestion for the user for that question\n- Make the report visually engaging and professional, using clear sections and formatting.\n\nQuestions: ${JSON.stringify(
    questions
  )}\nAnswers: ${JSON.stringify(answers)}\nHintsTaken: ${JSON.stringify(
    hintsInfo
  )}\nScore: ${score}`;
  
  return retryWithBackoff(async () => {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GOOGLE_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "No report generated.";
    return { summary: text, score };
  });
}

// Helper to extract 'Areas for Improvement' and remove markdown tables from summary
function extractAreasAndCleanSummary(summary: string) {
  let areas = "";
  let cleaned = summary;
  // Extract 'Areas for Improvement' section if present
  const areasMatch = summary.match(
    /\*\*Areas for Improvement:?\*\*[\s\S]*?(?=(\n\n|$))/i
  );
  if (areasMatch) {
    areas = areasMatch[0];
    cleaned = summary.replace(areas, "");
  }
  // Remove markdown tables from summary
  cleaned = cleaned.replace(/\|(.|\n)*?\|(.|\n)*?\|/g, "");
  return { areas, cleaned };
}

// About Content Component
const AboutContent: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* How It Works Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">1. Choose Your Topic</h3>
              <p className="text-sm text-gray-600">
                Enter any subject you want to learn about - from Math to History, Science to Literature
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">2. AI Generates Quiz</h3>
              <p className="text-sm text-gray-600">
                Gemini AI creates personalized questions tailored to your topic in seconds
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Hand className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">3. Gesture-Based Hints</h3>
              <p className="text-sm text-gray-600">
                Show a thumbs down gesture to your camera for instant hints when you're stuck
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">4. Get Detailed Report</h3>
              <p className="text-sm text-gray-600">
                Receive AI-powered feedback with score, insights, and areas for improvement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-gray-900">AI-Powered Questions</h3>
            </div>
            <p className="text-sm text-gray-600">
              Dynamic quiz generation using Gemini 2.5 Flash for any topic
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-900">Hand Gesture Detection</h3>
            </div>
            <p className="text-sm text-gray-600">
              MediaPipe-powered gesture recognition for hands-free hints
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Mixed Question Types</h3>
            </div>
            <p className="text-sm text-gray-600">
              Multiple choice and short answer questions for comprehensive testing
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Detailed Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI-generated reports with personalized feedback and improvement tips
            </p>
          </div>
        </div>
      </div>

      {/* Perfect For Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfect For</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
            <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Students</h4>
            <p className="text-sm text-gray-600">Exam prep and self-assessment</p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Educators</h4>
            <p className="text-sm text-gray-600">Quick assessment creation</p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Self-Learners</h4>
            <p className="text-sm text-gray-600">Test your knowledge</p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Quick Reviews</h4>
            <p className="text-sm text-gray-600">Fast topic reinforcement</p>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Be specific with your topic for more focused questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use the thumbs down gesture naturally - the camera will detect it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Review the detailed report to understand your learning gaps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Export your report as PDF to track your progress over time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"about" | "quiz">("about");
  const [step, setStep] = useState<"start" | "quiz" | "report">("start");
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [report, setReport] = useState<QuizReport | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [hintsTaken, setHintsTaken] = useState<boolean[]>([]);
  const [mediaPipeLoaded, setMediaPipeLoaded] = useState(false);

  useEffect(() => {
    async function ensureMediaPipe() {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
          "Hands"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
          "Camera"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
          "drawConnectors"
        );
        setMediaPipeLoaded(true);
      } catch {
        // Optionally, set an error state here
      }
    }
    ensureMediaPipe();
  }, []);

  const {
    videoRef,
    canvasRef,
    isInitialized,
  } = useThumbsDownGesture(
    () => {
      setShowHint(true);
      setHintsTaken((prev) => {
        const updated = [...prev];
        // Ensure array is correct length
        if (quiz && updated.length !== quiz.questions.length) {
          return Array(quiz.questions.length)
            .fill(false)
            .map((v, i) => (i === current ? true : v));
        }
        updated[current] = true;
        return updated;
      });
    },
    cameraActive,
    () => {},
    mediaPipeLoaded
  );

  // Start quiz
  const startQuiz = async () => {
    setLoading(true);
    setError("");
    setShowHint(false);
    setQuiz(null);
    setAnswers([]);
    setCurrent(0);
    setReport(null);
    setHintsTaken([]);
    try {
      const data = await fetchQuiz(topic);
      setQuiz(data);
      setHintsTaken(Array(data.questions.length).fill(false));
      setStep("quiz");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch quiz.");
    } finally {
      setLoading(false);
    }
  };

  // Submit quiz
  const submitQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      if (!quiz) throw new Error("No quiz data.");
      // Prepare hint usage info for the report
      const hintsInfo = quiz.questions.map((q, idx) => ({
        question: q.question,
        hintTaken: hintsTaken[idx],
      }));
      // Calculate score locally
      let score = 0;
      quiz.questions.forEach((q, idx) => {
        const userAns = (answers[idx] || "").trim().toLowerCase();
        const correctAns = (q.answer || "").trim().toLowerCase();
        if (userAns && correctAns && userAns === correctAns) score++;
      });
      const rep = await fetchReport(quiz.questions, answers, hintsInfo, score);
      rep.score = score;
      setReport(rep);
      setStep("report");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer change
  const handleAnswer = (ans: string) => {
    const newAnswers = [...answers];
    newAnswers[current] = ans;
    setAnswers(newAnswers);
    setShowHint(false);
  };

  // Next question
  const nextQuestion = () => {
    setShowHint(false);
    setCurrent((c) => c + 1);
  };

  // Restart
  const restart = () => {
    setStep("start");
    setTopic("");
    setQuiz(null);
    setAnswers([]);
    setCurrent(0);
    setShowHint(false);
    setReport(null);
    setError("");
    setCameraActive(true);
  };

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    const reportCard = document.getElementById("quiz-report-card");
    if (!reportCard) return;

    // Store original styles
    const originalBg = reportCard.style.background;
    const originalColor = reportCard.style.color;

    // Force supported colors
    reportCard.style.background = "#fff";
    reportCard.style.color = "#111";

    const canvas = await html2canvas(reportCard);

    // Restore original styles
    reportCard.style.background = originalBg;
    reportCard.style.color = originalColor;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save("quiz-report.pdf");
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // UI
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Quiz Master</h1>
              <p className="text-base text-gray-500">
                Interactive quizzes with AI-powered evaluation and gesture-based hints
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab("quiz");
                if (step === "report") {
                  setStep("start");
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-0">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === "about"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Info className="w-4 h-4" />
              About
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center justify-center gap-2 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === "quiz"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Brain className="w-4 h-4" />
              Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* About Tab */}
        {activeTab === "about" && <AboutContent />}

        {/* Quiz Tab */}
        {activeTab === "quiz" && (
          <div className="space-y-8">
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-6">
                {/* Camera Section */}
                {!mediaPipeLoaded && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
                    <div className="text-purple-600 text-sm font-medium">
                      Loading camera and hand detection...
                    </div>
                  </div>
                )}
                {mediaPipeLoaded && (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <Camera className="w-4 h-4" />
                      <span>Show thumbs down for hints</span>
                    </div>
                    <div className="relative w-[320px] h-[240px] rounded-lg overflow-hidden border-2 border-gray-200 bg-black shadow-lg">
                      <video
                        ref={videoRef}
                        playsInline
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: "scaleX(-1)",
                          zIndex: 1,
                          display: "block",
                        }}
                      />
                      <canvas
                        ref={canvasRef}
                        width={320}
                        height={240}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          pointerEvents: "none",
                          transform: "scaleX(-1)",
                          zIndex: 2,
                        }}
                      />
                      {!isInitialized && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Quiz Start Screen */}
                {step === "start" && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <Input
                      type="text"
                      className="!text-black bg-white border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
                      placeholder="Enter a topic (e.g. Algebra, World War II, Photosynthesis)"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={loading}
                    />

                    <Button
                      onClick={startQuiz}
                      disabled={!topic.trim() || loading || !mediaPipeLoaded}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                    >
                      {loading ? "Generating Quiz..." : "Start Quiz"}
                    </Button>
                    {!isInitialized && (
                      <div className="text-gray-500 text-sm">Waiting for camera...</div>
                    )}
                  </div>
                )}

                {/* Quiz Screen */}
                {step === "quiz" && quiz && (
                  <div className="flex flex-col gap-6 w-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-base font-semibold text-purple-600">
                          Question {current + 1} of {quiz.questions.length}
                        </div>
                      </div>
                      <div className="text-gray-900 text-lg font-medium mb-4">
                        {quiz.questions[current].question}
                      </div>
                      
                      {quiz.questions[current].type === "mcq" &&
                        quiz.questions[current].options && (
                          <div className="flex flex-col gap-2">
                            {quiz.questions[current].options.map((opt, idx) => (
                              <Button
                                key={idx}
                                variant={answers[current] === opt ? "default" : "outline"}
                                className={`text-left justify-start h-auto py-3 px-4 ${
                                  answers[current] === opt
                                    ? "bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
                                    : "hover:bg-gray-50 hover:border-purple-300"
                                }`}
                                onClick={() => handleAnswer(opt)}
                                disabled={loading}
                              >
                                {opt}
                              </Button>
                            ))}
                          </div>
                        )}
                      
                      {quiz.questions[current].type === "short" && (
                        <Input
                          type="text"
                          style={{ color: "#111", background: "#fff" }}
                          className="mt-2 border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
                          placeholder="Type your answer..."
                          value={answers[current] || ""}
                          onChange={(e) => handleAnswer(e.target.value)}
                          disabled={loading}
                        />
                      )}
                      
                      {showHint && (
                        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 rounded-lg flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">Hint:</span>{" "}
                            {quiz.questions[current].hint}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 text-sm font-medium flex items-center gap-2"
                        onClick={() => setShowHint(true)}
                        disabled={showHint}
                      >
                        <Lightbulb className="w-4 h-4" />
                        Show Hint
                      </Button>
                      {current < quiz.questions.length - 1 ? (
                        <Button
                          onClick={nextQuestion}
                          disabled={!answers[current] || loading}
                          className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          Next Question
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={submitQuiz}
                          disabled={
                            answers.length < quiz.questions.length ||
                            answers.some((a) => !a) ||
                            loading
                          }
                        >
                          {loading ? "Submitting..." : "Submit Quiz"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Report Screen */}
                {step === "report" && report && (() => {
                  const { areas, cleaned } = extractAreasAndCleanSummary(report.summary);
                  return (
                    <div className="flex flex-col gap-8 items-center w-full">
                      <div className="text-2xl font-bold text-green-700 mb-2">
                        Quiz Report
                      </div>
                      <Card id="quiz-report-card" className="w-full bg-white border border-gray-200 rounded-lg p-8 flex flex-col gap-8 shadow-sm">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          Summary
                        </div>
                        <div className="prose max-w-none text-gray-700 bg-gray-50 rounded-lg p-4">
                          <ReactMarkdown>{cleaned}</ReactMarkdown>
                        </div>
                        <div className="text-lg font-bold text-gray-900 mb-2 mt-6">
                          Detailed Breakdown
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="min-w-full bg-white text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                                  #
                                </th>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                                  Question
                                </th>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                                  Your Answer
                                </th>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                                  Correct Answer
                                </th>
                                <th className="px-4 py-3 text-left text-gray-700 font-semibold">
                                  Hint
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {quiz?.questions.map((q, idx) => (
                                <tr
                                  key={idx}
                                  className={
                                    hintsTaken[idx]
                                      ? "bg-yellow-50"
                                      : idx % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-50"
                                  }
                                >
                                  <td className="px-4 py-3 font-semibold text-gray-700 align-top">
                                    {idx + 1}
                                  </td>
                                  <td className="px-4 py-3 text-gray-800 max-w-xs whitespace-pre-wrap align-top">
                                    {q.question}
                                  </td>
                                  <td className="px-4 py-3 text-blue-600 font-semibold align-top">
                                    {answers[idx]}
                                  </td>
                                  <td className="px-4 py-3 text-green-600 font-semibold align-top">
                                    {q.answer || (
                                      <span className="italic text-gray-400">
                                        N/A
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 align-top">
                                    {hintsTaken[idx] ? (
                                      <span className="text-yellow-600 font-semibold">
                                        Hint Used
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">No Hint</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Hints Used Summary */}
                        <div className="mt-4 text-gray-800 text-sm">
                          <div className="text-base font-bold mb-2">Questions where hints were used:</div>
                          {quiz?.questions.some((q, idx) => hintsTaken[idx]) ? (
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {quiz?.questions.map((q, idx) =>
                                hintsTaken[idx] ? (
                                  <li key={idx}>
                                    <span className="font-semibold">Q{idx + 1}:</span> {q.question}
                                  </li>
                                ) : null
                              )}
                            </ul>
                          ) : (
                            <span className="text-gray-500">No hints were used.</span>
                          )}
                        </div>
                        {areas && (
                          <div className="mt-6">
                            <div className="text-lg font-bold text-gray-900 mb-2">
                              Areas for Improvement
                            </div>
                            <div className="prose max-w-none text-gray-700 bg-gray-50 rounded-lg p-4">
                              <ReactMarkdown>{areas}</ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </Card>
                      <div className="flex gap-4 mt-6">
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-all duration-200"
                          onClick={restart}
                        >
                          Take Another Quiz
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-all duration-200"
                          onClick={handlePrint}
                        >
                          Print / Save as PDF
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

<style jsx global>{`
  @media print {
    body * {
      visibility: hidden !important;
    }
    #quiz-report-card, #quiz-report-card * {
      visibility: visible !important;
    }
    #quiz-report-card {
      position: absolute !important;
      left: 0; top: 0; width: 100vw !important; background: #fff !important;
      box-shadow: none !important;
      color: #111 !important;
    }
  }
`}</style>
