import mongoose from 'mongoose'

export interface IPost {
  _id: string
  title: string
  content: string
  authorEmail: string
  createdAt: Date
  updatedAt: Date
  publishedAt: Date
  isPublished: boolean
  isCurrentlyLive: boolean
  manuallyLiveAt?: Date
}

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    authorEmail: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isCurrentlyLive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Post || mongoose.model('Post', PostSchema)
