import mongoose, { Document, Schema } from "mongoose";

export interface image {
  contentType: string;
  fileName: string;
  file: string;
}
export interface imageModel extends image, Document {}

const Image: Schema = new Schema(
  {
    contentType: { type: String, required: true },
    fileName: { type: String, required: true, trim: true },
    file: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<imageModel>("Image", Image);
