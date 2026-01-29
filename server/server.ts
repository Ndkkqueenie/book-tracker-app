import express, { Request, Response } from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// 1. Environment Variable Safety
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ FATAL: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

// 2. Optimized Mongoose Connection
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true, // Useful for development, consider disabling for heavy production loads
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // Exit process with failure so Docker can restart the container
    process.exit(1);
  }
};

connectDB();

// 3. Typed Schema & Interface
interface IBook {
  title: string;
  author: string;
}

const bookSchema = new mongoose.Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
});

const Book = mongoose.model<IBook>("Book", bookSchema);

// 4. Async Wrapper for Error Handling
// In Express 4, must catch async errors or use a wrapper/middleware to avoid crashes
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 5. Hardened Routes
app.get("/api/books", asyncHandler(async (req: Request, res: Response) => {
  const books = await Book.find().lean(); // .lean() improves performance for read-only
  res.json(books);
}));

app.post("/api/books", asyncHandler(async (req: Request, res: Response) => {
  const book = new Book(req.body);
  const savedBook = await book.save();
  res.status(201).json(savedBook);
}));

app.delete("/api/books/:id", asyncHandler(async (req: Request, res: Response) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);
  if (!deletedBook) return res.status(404).json({ error: "Book not found" });
  res.json({ message: "Book deleted" });
}));

// 6. Graceful Shutdown
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing HTTP server...");
  server.close(async () => {
    await mongoose.connection.close();
    console.log("HTTP server and MongoDB connection closed.");
    process.exit(0);
  });
});
