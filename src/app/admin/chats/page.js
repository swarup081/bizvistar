"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { getAdminChats } from "@/app/actions/adminActions";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

export default function AdminChatsPage() {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getAdminChats(page, 20);
      if (res.success) {
        setChats(res.chats);
        setTotal(res.total);
      }
      setLoading(false);
    }
    load();
  }, [page]);

  if (loading && page === 1) return <AdminSkeleton />;

  return (
    <div className="font-sans not-italic">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#111] not-italic">Ask Vista Chats</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor AI conversations and feedback</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase text-xs">User / Email</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase text-xs">Topic / Initial Context</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase text-xs">Messages</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase text-xs">Feedback</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase text-xs">Started At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {chats.map((chat) => (
                <tr key={chat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{chat.user_email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-gray-600 max-w-xs truncate" title={chat.initial_context || chat.topic || 'General'}>
                      {chat.initial_context || chat.topic || 'General Conversation'}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>{chat.message_count || 0}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {chat.chat_feedback && chat.chat_feedback.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {chat.chat_feedback[0].rating > 0 ? (
                          <ThumbsUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ThumbsDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500 truncate max-w-[100px]" title={chat.chat_feedback[0].comment}>
                          {chat.chat_feedback[0].comment || 'No comment'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">None</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(chat.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {chats.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                    No chats found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page * 20 >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
