"use client";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCourseCreated: (formData: {
    name: string;
    description: string;
    category: string;
    level: string;
    includeVideo: boolean;
    noOfChapters: number;
  }) => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked ? 'true' : 'false'}
      aria-label="Include Video"
    >
      <span
        className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
}

export default function CourseFormModal({ open, onClose, onCourseCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [includeVideo, setIncludeVideo] = useState(false);
  const [noOfChapters, setNoOfChapters] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!name || !category || !level || !noOfChapters) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    try {
      await onCourseCreated({ name, description, category, level, includeVideo, noOfChapters });
    } catch (err) {
      setError((err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Create a Personalized Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name <span className="text-red-500">*</span></label>
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Java Mastery" title="Course Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Description (optional)</label>
            <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Learn Java from basics to advanced" title="Course Description" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Chapters <span className="text-red-500">*</span></label>
            <input type="number" min={1} max={20} className="w-full border rounded px-3 py-2" value={noOfChapters} onChange={e => setNoOfChapters(Number(e.target.value))} required title="Number of Chapters" />
          </div>
          <div className="flex items-center gap-3">
            <Toggle checked={includeVideo} onChange={setIncludeVideo} />
            <label className="text-sm font-medium text-gray-700">Include Video Recommendations</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level <span className="text-red-500">*</span></label>
            <select className="w-full border rounded px-3 py-2" value={level} onChange={e => setLevel(e.target.value)} required title="Difficulty Level">
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
            <input type="text" className="w-full border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g. Programming, Data Science" title="Category" />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition" disabled={loading}>
            {loading ? "Generating..." : "Generate Course"}
          </button>
        </form>
      </div>
    </div>
  );
} 