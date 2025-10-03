import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2, BookOpen } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";

import React, { ComponentPropsWithRef } from "react";
const MotionH1 = React.forwardRef<HTMLHeadingElement, ComponentPropsWithRef<"h1"> & HTMLMotionProps<"h1">>(
  (props, ref) => <motion.h1 ref={ref} {...props} />
);
const MotionDiv = React.forwardRef<HTMLHeadingElement, ComponentPropsWithRef<"div"> & HTMLMotionProps<"div">>(
  (props, ref) => <motion.div ref={ref} {...props} />
);

interface Book {
  _id: string;
  title: string;
  author: string;
}

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data: Book[] = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Failed to load books:", err);
      }
    };
    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    if (!title || !author) return;

    try {
      if (editingId) {
        const res = await fetch(`/api/books/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author }),
        });
        const updatedBook: Book = await res.json();
        setBooks((prev) =>
          prev.map((b) => (b._id === editingId ? updatedBook : b))
        );
        setEditingId(null);
      } else {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author }),
        });
        const newBook: Book = await res.json();
        setBooks((prev) => [...prev, newBook]);
      }
    } catch (err) {
      console.error("Error saving book:", err);
    }

    setTitle("");
    setAuthor("");
  };

  const handleEdit = (book: Book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setEditingId(book._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 p-6 flex flex-col items-center">
      <MotionH1
        className="text-4xl font-bold mb-6 text-indigo-700 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        >
        <BookOpen className="w-8 h-8" /> Book Tracker
      </MotionH1>

      <Card className="w-full max-w-md shadow-lg mb-6">
        <CardContent className="p-4 flex flex-col gap-3">
          <Input
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Button onClick={handleAddBook} className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            {editingId ? "Update Book" : "Add Book"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 w-full max-w-md">
        {books.length === 0 ? (
          <p className="text-gray-600 italic text-center">
            No books yet. Start by adding one!
          </p>
        ) : (
          books.map((book) => (
            <MotionDiv
              key={book._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-white shadow-md rounded-2xl p-4"
            >
              <div>
                <h2 className="text-lg font-semibold text-indigo-600">
                  {book.title}
                </h2>
                <p className="text-gray-500">{book.author}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(book)}
                >
                  <Edit className="w-5 h-5 text-blue-500" />
                </Button>
                <Button
                  onClick={() => handleDelete(book._id)}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </MotionDiv>
          ))
        )}
      </div>
    </div>
  );
}
