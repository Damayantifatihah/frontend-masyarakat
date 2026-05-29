
"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";

interface Props {
  laporanId: number;
}

interface Comment {
  id: number;
  comment: string;
  name: string;
}

export default function CommentSection({
  laporanId,
}: Props) {
  const [comments, setComments] =
    useState<Comment[]>([]);

  const [comment, setComment] =
    useState("");

  // =========================
  // GET COMMENTS
  // =========================

  const fetchComments = async () => {
    try {
      const res = await api.get(
        `/comments/${laporanId}`
      );

      setComments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // CREATE COMMENT
  // =========================

  const handleComment =
    async () => {
      try {
        if (!comment.trim()) return;

        await api.post("/comments", {
          laporan_id: laporanId,
          comment,
        });

        setComment("");

        fetchComments();
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      {/* COMMENT LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        {comments.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#F9FAFB",
              borderRadius: "14px",
              padding: "12px 14px",
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              {item.name}
            </h4>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#4B5563",
                lineHeight: 1.7,
              }}
            >
              {item.comment}
            </p>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Tulis komentar..."
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "14px",
            border:
              "1px solid #E5E7EB",
            outline: "none",
            fontSize: "14px",
          }}
        />

        <button
          onClick={handleComment}
          style={{
            border: "none",
            padding:
              "0 20px",
            borderRadius: "14px",
            background:
              "#111827",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

