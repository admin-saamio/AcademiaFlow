"use client";

import React, { useState } from "react";
import { TodoItem, RevisionCheckitem, PriorityLevel } from "@/types/academic";
import { CheckSquare, Calendar, Plus, Trash2, CheckCircle2, Clock, AlertCircle, BookOpenCheck } from "lucide-react";

interface ProductivitySuiteProps {
  todos: TodoItem[];
  revisions: RevisionCheckitem[];
  onUpdateTodos: (todos: TodoItem[]) => void;
  onUpdateRevisions: (revisions: RevisionCheckitem[]) => void;
}

export function ProductivitySuite({
  todos,
  revisions,
  onUpdateTodos,
  onUpdateRevisions,
}: ProductivitySuiteProps) {
  // To-Do Form State
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDeadline, setNewTodoDeadline] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<PriorityLevel>("medium");

  // Revision Form State
  const [newRevisionTitle, setNewRevisionTitle] = useState("");

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

  // Revision Progress Calculation
  const completedRevisions = revisions.filter((r) => r.completed).length;
  const revisionProgressPercent =
    revisions.length > 0 ? Math.round((completedRevisions / revisions.length) * 100) : 0;

  return (
    <section className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <BookOpenCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-montserrat">
            Student Productivity Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Organize daily deadlines, homework assignments, and exam revision targets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 transition-all"
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
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Add
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
    </section>
  );
}
