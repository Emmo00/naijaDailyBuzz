import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    title: { type: String, index: true, unique: true },
    sent: { type: Boolean, default: false },
    pubDate: Date,
    author: String,
    content: String,
    link: String,
    keywords: [String],
    creator: [String],
    image: String,
    source_id: String,
    category: [String],
  },
  { timestamps: true }
);

const Article = model('Article', articleSchema);

export default Article;
