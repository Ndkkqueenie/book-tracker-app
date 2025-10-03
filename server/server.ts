import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/booktracker";

mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Example schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

const Book = mongoose.model("Book", bookSchema);

// Routes
app.get("/api/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post("/api/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

app.put("/api/books/:id", async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

app.delete("/api/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
