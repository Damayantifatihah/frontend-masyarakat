"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import api from "@/lib/axios";

interface Props {
  laporanId: number;
}

interface Comment {
  id: number;
  comment: string;
  name: string;
}

function avatarColor(name: string) {
  const colors = [
    ["#FDE68A", "#F59E0B"],
    ["#BFDBFE", "#3B82F6"],
    ["#BBF7D0", "#10B981"],
    ["#FBCFE8", "#EC4899"],
    ["#DDD6FE", "#8B5CF6"],
    ["#FED7AA", "#F97316"],
  ];
  const idx = (name?.charCodeAt(0) ?? 0) % colors.length;
  return colors[idx];
}

export default function CommentSection({ laporanId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${laporanId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Gagal memuat komentar:", error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      setLoading(true);
      await api.post("/comments", { laporan_id: laporanId, comment });
      setComment("");
      await fetchComments();
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleComment();
  };

  useEffect(() => {
    fetchComments();
  }, [laporanId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
        <MessageCircle size={12} strokeWidth={2} color="#9CA3AF" />
        <span style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.03em" }}>
          {comments.length > 0 ? `${comments.length} Komentar` : "Komentar"}
        </span>
      </div>

      {/* Comment list */}
      {comments.map((item) => {
        const [bg, text] = avatarColor(item.name);
        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            {/* Mini avatar */}
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${bg}, ${text})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
                marginTop: "1px",
              }}
            >
              {item.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* Bubble */}
            <div
              style={{
                background: "#fff",
                borderRadius: "0px 10px 10px 10px",
                padding: "7px 10px",
                flex: 1,
                border: "1px solid #F0F0F0",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#374151",
                  display: "block",
                  marginBottom: "2px",
                }}
              >
                {item.name}
              </span>
              <span style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.5 }}>
                {item.comment}
              </span>
            </div>
          </div>
        );
      })}

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginTop: comments.length > 0 ? "2px" : "0",
        }}
      >
        <input
          type="text"
          placeholder="Tulis komentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            outline: "none",
            fontSize: "12px",
            color: "#111827",
            background: "#fff",
          }}
        />
        <button
          onClick={handleComment}
          disabled={loading || !comment.trim()}
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            border: "none",
            background: loading || !comment.trim() ? "#E5E7EB" : "#C84B31",
            color: loading || !comment.trim() ? "#9CA3AF" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading || !comment.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <Send size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}