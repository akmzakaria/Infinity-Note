import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  userId: string
  userEmail: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

// Ensure unique category names per user
CategorySchema.index({ name: 1, userId: 1 }, { unique: true })

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
