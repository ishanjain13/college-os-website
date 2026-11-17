import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  Tag, 
  Layers, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  XCircle,
  HelpCircle
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function NotesApp() {
  const { state, setNotes, setFlashcards, awardXP } = useOS();
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'flashcards' | 'review'

  // Notes Search & Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(state.notes[0]?.id || null);
  const [isEditingNote, setIsEditingNote] = useState(false);

  // New Note Form
  const [noteForm, setNoteForm] = useState({
    title: '',
    subject: 'General',
    tags: '',
    content: ''
  });

  // Flashcards Study Deck state
  const [deckFilter, setDeckFilter] = useState('All');
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filtered Notes
  const filteredNotes = state.notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.subject?.toLowerCase().includes(q) ||
      (n.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const selectedNote = state.notes.find((n) => n.id === selectedNoteId) || state.notes[0];

  const handleCreateNote = () => {
    const newNote = {
      id: `n-${Date.now()}`,
      title: 'Untitled Study Note',
      subject: 'Computer Science',
      pinned: false,
      tags: ['Study', 'Review'],
      content: '# New Topic Notes\n\nStart capturing key principles, formulas, or summaries...',
      updatedAt: new Date().toISOString()
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsEditingNote(true);
    awardXP(20, 'Created note document');
  };

  const handleSaveCurrentNote = (title, content, subject, tagsArray) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? {
              ...n,
              title,
              content,
              subject,
              tags: tagsArray,
              updatedAt: new Date().toISOString()
            }
          : n
      )
    );
    setIsEditingNote(false);
  };

  const handleDeleteNote = (id) => {
    if (confirm("Delete this note?")) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    }
  };

  const handleTogglePin = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Turn selected note into flashcard
  const handleConvertNoteToFlashcard = (note) => {
    const front = prompt("Enter Flashcard Front Question:", `What are the key concepts of ${note.title}?`);
    if (!front) return;
    const back = prompt("Enter Flashcard Back Answer / Definition:", note.content.slice(0, 150));
    if (!back) return;

    const newFc = {
      id: `fc-${Date.now()}`,
      deck: note.subject || "General",
      front,
      back,
      difficulty: "medium",
      reviewCount: 0,
      lastReviewed: new Date().toISOString().split('T')[0],
      tags: note.tags || []
    };
    setFlashcards((prev) => [newFc, ...prev]);
    awardXP(25, "Generated flashcard from notes");
    alert("Flashcard successfully added to review deck!");
  };

  // Flashcards filtered
  const activeDeckCards = state.flashcards.filter(
    (f) => deckFilter === 'All' || f.deck === deckFilter
  );
  const currentCard = activeDeckCards[reviewIndex] || null;

  const handleReviewCard = (known) => {
    if (known) {
      awardXP(15, `Mastered flashcard: ${currentCard.front.slice(0, 20)}...`);
      setFlashcards((prev) =>
        prev.map((fc) =>
          fc.id === currentCard.id
            ? { ...fc, reviewCount: (fc.reviewCount || 0) + 1, lastReviewed: new Date().toISOString().split('T')[0] }
            : fc
        )
      );
    }
    setIsFlipped(false);
    if (reviewIndex < activeDeckCards.length - 1) {
      setReviewIndex((prev) => prev + 1);
    } else {
      alert("Deck completed for this session! Outstanding retention.");
      setReviewIndex(0);
      setActiveTab('flashcards');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Knowledge Vault & Flashcards</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Markdown lecture notes, active recall decks, and spaced repetition.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'notes' ? 'bg-cyan-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'flashcards' ? 'bg-cyan-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcard Decks ({state.flashcards.length})</span>
          </button>
        </div>
      </div>

      {/* 1. NOTES APPLICATION VIEW */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 min-h-[500px]">
          {/* Notes Sidebar List */}
          <div className="glass-panel p-4 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-os-text-muted font-mono">
                Notes ({filteredNotes.length})
              </span>
              <button
                onClick={handleCreateNote}
                className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs cursor-pointer"
                title="New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-os-text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, tags, subjects..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-os-text-subtle focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Notes List */}
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[460px] scrollbar-thin">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setIsEditingNote(false);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedNoteId === note.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-os-text'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold line-clamp-1">{note.title}</h4>
                    {note.pinned && <Pin className="w-3 h-3 text-cyan-400 fill-cyan-400 shrink-0" />}
                  </div>

                  <div className="text-[10px] text-os-text-muted mt-1 line-clamp-2 font-mono">
                    {note.content.replace(/[#*`]/g, '')}
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-[9px] font-mono text-cyan-300/80">
                    <span>{note.subject}</span>
                    <span>•</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note Editor / Preview Container */}
          <div className="glass-panel p-5 col-span-2 flex flex-col justify-between">
            {selectedNote ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {selectedNote.subject}
                    </span>
                    <span className="text-xs text-os-text-muted">
                      Updated {new Date(selectedNote.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleConvertNoteToFlashcard(selectedNote)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs flex items-center gap-1 border border-indigo-500/30 cursor-pointer"
                      title="Generate Flashcard"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Make Flashcard</span>
                    </button>
                    <button
                      onClick={() => handleTogglePin(selectedNote.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white cursor-pointer"
                      title="Pin Note"
                    >
                      <Pin className={`w-4 h-4 ${selectedNote.pinned ? 'text-cyan-400 fill-cyan-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div>
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => {
                      const updatedTitle = e.target.value;
                      setNotes((prev) =>
                        prev.map((n) => (n.id === selectedNote.id ? { ...n, title: updatedTitle } : n))
                      );
                    }}
                    className="text-lg font-bold text-white bg-transparent w-full focus:outline-none mb-3"
                  />

                  <textarea
                    rows={14}
                    value={selectedNote.content}
                    onChange={(e) => {
                      const updatedContent = e.target.value;
                      setNotes((prev) =>
                        prev.map((n) => (n.id === selectedNote.id ? { ...n, content: updatedContent } : n))
                      );
                    }}
                    className="w-full bg-black/30 p-4 rounded-xl border border-white/10 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-500 resize-none scrollbar-thin"
                    placeholder="Type markdown notes..."
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-os-text-muted">
                Select a note from the left or click "+ New Note" to begin writing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. FLASHCARDS DECK & ACTIVE RECALL */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Active Recall Decks</h3>
            <button
              onClick={() => {
                if (state.flashcards.length === 0) {
                  alert("Add flashcards first from your notes!");
                  return;
                }
                setReviewIndex(0);
                setIsFlipped(false);
                setActiveTab('review');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>Start Review Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.flashcards.map((fc) => (
              <div key={fc.id} className="glass-panel p-5 space-y-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-300 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {fc.deck}
                  </span>
                  <span className="text-[10px] text-os-text-muted font-mono">
                    Mastery: {fc.reviewCount || 0} reviews
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-os-text-muted uppercase font-bold">Front (Prompt)</span>
                  <div className="text-xs font-bold text-white mt-0.5">{fc.front}</div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] font-mono text-os-text-muted uppercase font-bold">Back (Answer)</span>
                  <div className="text-xs text-slate-300 mt-0.5 font-mono">{fc.back}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ACTIVE RECALL STUDY SESSION FLIP CARD */}
      {activeTab === 'review' && currentCard && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex justify-between text-xs text-os-text-muted font-mono">
            <span>Card {reviewIndex + 1} of {activeDeckCards.length}</span>
            <button onClick={() => setActiveTab('flashcards')} className="text-cyan-400 cursor-pointer">
              Exit Session
            </button>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] glass-panel p-8 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-cyan-500/40 hover:border-cyan-400 transition-all rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900/60 shadow-2xl"
          >
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-3">
              {isFlipped ? "ANSWER (BACK)" : "QUESTION (FRONT)"} • Click to Flip
            </span>

            <div className="text-base font-bold text-white font-mono leading-relaxed">
              {isFlipped ? currentCard.back : currentCard.front}
            </div>

            <span className="text-[11px] text-os-text-muted mt-6">
              {isFlipped ? "Did you recall this correctly?" : "Tap anywhere to reveal answer"}
            </span>
          </div>

          {/* Action Buttons */}
          {isFlipped && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleReviewCard(false)}
                className="py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Missed / Re-Study</span>
              </button>
              <button
                onClick={() => handleReviewCard(true)}
                className="py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Known (+15 XP)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
