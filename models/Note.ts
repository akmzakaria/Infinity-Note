import mongoose, { Schema, Document } from 'mongoose'

export interface INote extends Document {
  title: string
  content: string
  category: string
  userId: string
  userEmail: string
  createdAt: Date
  updatedAt: Date
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'All',
    },
    userId: {
      type: String,
      required: true,
      index: true, // Add index for better query performance
    },
    userEmail: {
      type: String,
      required: true,
      index: true, // Add index for better query performance
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema)
