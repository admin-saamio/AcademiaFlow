"use client";

import React, { useState } from "react";
import { TodoItem, RevisionCheckitem, NoteItem, PriorityLevel } from "@/types/academic";
import { CheckSquare, Calendar, Plus, Trash2, CheckCircle2, BookOpenCheck, Edit3, Save } from "lucide-react";

interface ProductivitySuiteProps {
  todos: TodoItem[];
  revisions: RevisionCheckitem[];
  notes: NoteItem[];
  onUpdateTodos: (todos: TodoItem[]) => void;
  onUpdateRevisions: (revisions: RevisionCheckitem[]) => void;
  onUpdateNotes: (notes: NoteItem[]) => void;
}

export function ProductivitySuite({
  todos,
  revisions,
  notes,
  onUpdateTodos,
  onUpdateRevisions,
  onUpdateNotes,
}: ProductivitySuiteProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "notes">("tasks");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // To-Do Form State
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDeadline, setNewTodoDeadline] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<PriorityLevel>("medium");

  // Revision Form State
  const [newRevisionTitle, setNewRevisionTitle] = useState("");

  // Notes Form State
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Add To-Do Item
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const item: TodoItem = {
      id: `t-${Date.now()}`,
      title: newTodoTitle.trim(),
      deadline: newTodoDeadline || new Date().toISOString().split("T")[0],
      completed: false,
      priority: newTodoPriority,
    };

    onUpdateTodos([item, ...todos]);
    setNewTodoTitle("");
    setNewTodoDeadline("");
  };

  // Toggle To-Do Completion
  const handleToggleTodo = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    onUpdateTodos(updated);
  };

  // Delete To-Do
  const handleDeleteTodo = (id: string) => {
    onUpdateTodos(todos.filter((t) => t.id !== id));
  };

  // Add Revision Item
  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevisionTitle.trim()) return;

    const item: RevisionCheckitem = {
      id: `r-${Date.now()}`,
      title: newRevisionTitle.trim(),
      completed: false,
    };

    onUpdateRevisions([...revisions, item]);
    setNewRevisionTitle("");
  };

  // Toggle Revision Completion
  const handleToggleRevision = (id: string) => {
    const updated = revisions.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
    onUpdateRevisions(updated);
  };

  // Delete Revision
  const handleDeleteRevision = (id: string) => {
    onUpdateRevisions(revisions.filter((r) => r.id !== id));
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    if (editingNoteId) {
      const updatedNotes = notes.map(n =>
        n.id === editingNoteId ? { ...n, title: newNoteTitle, content: newNoteContent, updatedAt: new Date().toISOString() } : n
      );
      onUpdateNotes(updatedNotes);
      setEditingNoteId(null);
    } else {
      const newNote: NoteItem = {
        id: `n-${Date.now()}`,
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        updatedAt: new Date().toISOString()
      };
      onUpdateNotes([newNote, ...notes]);
    }

    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const handleEditNote = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
  };

  const handleDeleteNote = (id: string) => {
    onUpdateNotes(notes.filter(n => n.id !== id));
    if (editingNoteId === id) {
      setEditingNoteId(null);
      setNewNoteTitle("");
      setNewNoteContent("");
    }
  };

  // Revision Progress Calculation
  const completedRevisions = revisions.filter((r) => r.completed).length;
  const revisionProgressPercent =
    revisions.length > 0 ? Math.round((completedRevisions / revisions.length) * 100) : 0;

  const handleSaveLocally = () => {
    setSavedMessage("Saved Productivity Data!");
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <section className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-montserrat">
              Student Productivity Suite
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Organize deadlines, assignments, and quick notes.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveLocally}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all min-h-[44px]"
        >
          <Save className="w-4 h-4" /> Save
        </button>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-200 text-sm font-semibold animate-in fade-in">
          ✓ {savedMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "tasks" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Tasks & Revisions
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "notes" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Quick Notes
        </button>
      </div>

      {activeTab === "tasks" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
          {/* 1. INTERACTIVE TO-DO LIST */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                Task & Assignment To-Do List
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {todos.filter((t) => !t.completed).length} Pending
              </span>
            </div>

            {/* To-Do Form Input */}
            <form onSubmit={handleAddTodo} className="space-y-3 mb-4">
              <div>
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="Task title (e.g. Solve Physics Chapter 3 numericals)..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5">
                  <div className="relative">
                    <input
                      type="date"
                      value={newTodoDeadline}
                      onChange={(e) => setNewTodoDeadline(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 transition-all min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </div>
              </div>
            </form>

            {/* To-Do Items List */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {todos.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-400">
                  No tasks added yet. Add a new task above!
                </p>
              ) : (
                todos.map((todo) => {
                  const isHigh = todo.priority === "high";
                  const isMed = todo.priority === "medium";
                  return (
                    <div
                      key={todo.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        todo.completed
                          ? "bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-65"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/70 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleTodo(todo.id)}
                          className="h-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-medium truncate ${
                              todo.completed
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {todo.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {todo.deadline}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isHigh
                              ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                              : isMed
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {todo.priority}
                        </span>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 2. EXAM REVISION & STUDY CHECKLIST */}
        <div className="bg-slate-50/70 dark:bg-slate-800/40 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Exam Revision & Study Progress
              </h3>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {revisionProgressPercent}% Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${revisionProgressPercent}%` }}
              ></div>
            </div>

            {/* Add Custom Revision Goal */}
            <form onSubmit={handleAddRevision} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newRevisionTitle}
                onChange={(e) => setNewRevisionTitle(e.target.value)}
                placeholder="Add custom revision task (e.g. Formula Sheet Review)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20 transition-all min-h-[44px] min-w-[44px] justify-center"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add</span>
              </button>
            </form>

            {/* Revision Items */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {revisions.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    item.completed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/70"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleRevision(item.id)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span
                      className={`text-xs font-semibold truncate ${
                        item.completed
                          ? "line-through text-emerald-700 dark:text-emerald-300"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {item.title}
                    </span>
                  </label>

                  <button
                    onClick={() => handleDeleteRevision(item.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
          {/* Add/Edit Note Form */}
          <div className="lg:col-span-1 bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Edit3 className="w-5 h-5 text-emerald-500" />
              {editingNoteId ? "Edit Note" : "New Quick Note"}
            </h3>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Write your note here..."
                rows={6}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all min-h-[44px]"
              >
                <Save className="w-4 h-4" /> {editingNoteId ? "Update Note" : "Save Note"}
              </button>
              {editingNoteId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingNoteId(null);
                    setNewNoteTitle("");
                    setNewNoteContent("");
                  }}
                  className="w-full py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all min-h-[44px]"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
            {notes.length === 0 ? (
              <div className="sm:col-span-2 text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed">
                <Edit3 className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-500 font-medium">No notes saved yet.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{note.title}</h4>
                    <div className="flex shrink-0">
                      <button onClick={() => handleEditNote(note)} className="p-1 text-slate-400 hover:text-emerald-500 min-w-[32px] min-h-[32px] flex items-center justify-center">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)} className="p-1 text-slate-400 hover:text-red-500 min-w-[32px] min-h-[32px] flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 whitespace-pre-wrap flex-1">{note.content}</p>
                  <div className="text-[10px] text-slate-400 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                    Updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}
