"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Gemini API Key (replace with your own if needed)
const GOOGLE_API_KEY = "AIzaSyBiAMiZ0GSqTtaMIeBXzuv38-JHJJ8sy8w";

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

// Gemini API helpers
async function fetchQuiz(topic: string): Promise<QuizData> {
  const prompt = `Generate 5 quiz questions on the topic "${topic}". For each question, provide:
- The question text
- The type ("mcq" or "short")
- If MCQ, 4 options (A, B, C, D)
- The correct answer (as a field, but do NOT reveal to the user in the quiz)
- A helpful hint for the question
Return as a JSON array with this structure:
[
  { "question": "...", "type": "mcq" | "short", "options": ["A", "B", "C", "D"], "hint": "...", "answer": "..." },
  ...
]
Do NOT include answers in the output to the user, but include them in the JSON.`;
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
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
  const result = await response.json();
  let text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Try to extract JSON from the response
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    text = text.slice(jsonStart, jsonEnd + 1);
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questions = JSON.parse(text);
    return { questions };
  } catch {
    throw new Error("Failed to parse quiz questions from Gemini API.");
  }
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
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
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
  const result = await response.json();
  const text =
    result.candidates?.[0]?.content?.parts?.[0]?.text || "No report generated.";
  return { summary: text, score };
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

const QuizPage: React.FC = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-200 via-blue-100 to-[#f8fafc]">
      <Card className="w-full max-w-2xl p-8 relative">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2 text-center">
          AI Quiz Generator
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Personalized quizzes powered by Gemini AI. Show a{" "}
          <span className="font-semibold">thumbs down</span> for a hint!
        </p>
        {!mediaPipeLoaded && (
          <div className="flex flex-col items-center justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
            <div className="text-indigo-500 text-sm">
              Loading camera and hand detection...
            </div>
          </div>
        )}
        {mediaPipeLoaded && (
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-[320px] h-[240px] rounded-lg overflow-hidden border-2 border-indigo-300 bg-black">
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        )}
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {step === "start" && (
          <div className="flex flex-col items-center gap-4">
            <Input
              type="text"
              className="!text-black bg-white border border-indigo-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-500"
              placeholder="Enter a topic (e.g. Algebra, World War II, Photosynthesis)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={startQuiz}
              disabled={!topic.trim() || loading || !mediaPipeLoaded}
              className="w-full max-w-md"
            >
              {loading ? "Generating Quiz..." : "Start Quiz"}
            </Button>
            {!isInitialized && (
              <div className="text-gray-500 text-sm">Waiting for camera...</div>
            )}
          </div>
        )}
        {step === "quiz" && quiz && (
          <div className="flex flex-col gap-6">
            <div className="mb-2">
              <div className="text-lg font-semibold text-indigo-700 mb-1">
                Question {current + 1} of {quiz.questions.length}
              </div>
              <div className="text-gray-800 text-base mb-2">
                {quiz.questions[current].question}
              </div>
              {quiz.questions[current].type === "mcq" &&
                quiz.questions[current].options && (
                  <div className="flex flex-col gap-2">
                    {quiz.questions[current].options.map((opt, idx) => (
                      <Button
                        key={idx}
                        variant={answers[current] === opt ? "default" : "outline"}
                        className="text-left"
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
                  className="mt-2 border-2 border-indigo-400 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-500"
                  placeholder="Type your answer..."
                  value={answers[current] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  disabled={loading}
                />
              )}
              {showHint && (
                <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                  <span className="font-semibold">Hint:</span>{" "}
                  {quiz.questions[current].hint}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-indigo-600 text-sm font-medium"
                onClick={() => setShowHint(true)}
                disabled={showHint}
              >
                Show Hint
              </Button>
              {current < quiz.questions.length - 1 ? (
                <Button
                  onClick={nextQuestion}
                  disabled={!answers[current] || loading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
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
        {step === "report" &&
          report &&
          (() => {
            const { areas, cleaned } = extractAreasAndCleanSummary(
              report.summary
            );
            return (
              <div className="flex flex-col gap-8 items-center w-full">
                <div className="text-3xl font-bold text-green-700 mb-2 tracking-tight drop-shadow">
                  Quiz Report
                </div>
                <Card id="quiz-report-card" className="w-full max-w-5xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 rounded-3xl p-8 flex flex-col gap-8 shadow-2xl transition-all duration-300 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
                  <div className="text-xl font-bold text-indigo-800 mb-2 mt-2">
                    Summary
                  </div>
                  <div className="prose prose-indigo max-w-none text-gray-800 bg-white/60 rounded-xl p-4 shadow-inner">
                    <ReactMarkdown>{cleaned}</ReactMarkdown>
                  </div>
                  <div className="text-xl font-bold text-indigo-800 mb-2 mt-4">
                    Detailed Breakdown
                  </div>
                  <div className="overflow-x-auto rounded-xl shadow-inner">
                    <table className="min-w-full border border-indigo-200 rounded-xl bg-white text-base">
                      <thead className="sticky top-0 z-10 bg-indigo-100/90 backdrop-blur">
                        <tr>
                          <th className="px-4 py-3 text-left text-indigo-700 font-semibold">
                            #
                          </th>
                          <th className="px-4 py-3 text-left text-indigo-700 font-semibold">
                            Question
                          </th>
                          <th className="px-4 py-3 text-left text-indigo-700 font-semibold">
                            Your Answer
                          </th>
                          <th className="px-4 py-3 text-left text-indigo-700 font-semibold">
                            Correct Answer
                          </th>
                          <th className="px-4 py-3 text-left text-indigo-700 font-semibold">
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
                                ? "bg-yellow-50/80"
                                : idx % 2 === 0
                                ? "bg-white"
                                : "bg-indigo-50/60"
                            }
                          >
                            <td className="px-4 py-3 font-semibold text-indigo-700 align-top">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3 text-gray-800 max-w-xs whitespace-pre-wrap align-top">
                              {q.question}
                            </td>
                            <td className="px-4 py-3 text-blue-700 font-semibold align-top">
                              {answers[idx]}
                            </td>
                            <td className="px-4 py-3 text-green-700 font-semibold align-top">
                              {q.answer || (
                                <span className="italic text-gray-400">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 align-top">
                              {hintsTaken[idx] ? (
                                <span className="text-yellow-700 font-bold">
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
                  {/* Hints Used Summary - improved */}
                  <div className="mt-4 text-indigo-800 text-base font-semibold">
                    <div className="text-lg font-bold mb-2">Questions where hints were used:</div>
                    {quiz?.questions.some((q, idx) => hintsTaken[idx]) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {quiz?.questions.map((q, idx) =>
                          hintsTaken[idx] ? (
                            <li key={idx}>
                              <span className="font-bold">Q{idx + 1}:</span> {q.question}
                            </li>
                          ) : null
                        )}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No hints were used.</span>
                    )}
                  </div>
                  {areas && (
                    <div className="mt-8">
                      <div className="text-xl font-bold text-indigo-800 mb-2">
                        Areas for Improvement
                      </div>
                      <div className="prose prose-indigo max-w-none text-gray-700 bg-white/60 rounded-xl p-4 shadow-inner animate-fade-in">
                        <ReactMarkdown>{areas}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </Card>
                <div className="flex gap-4 mt-4">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-all duration-200 text-lg"
                    onClick={restart}
                  >
                    Restart
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-all duration-200 text-lg"
                    onClick={handlePrint}
                  >
                    Print / Save as PDF
                  </Button>
                </div>
              </div>
            );
          })()}
      </Card>
      <div className="text-xs text-gray-400 mt-4">
        Camera and hand detection powered by MediaPipe. Quiz and report powered
        by Gemini AI.
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
