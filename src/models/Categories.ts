import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true },
});

const CategoryModel =
  mongoose.models?.Category ||
  mongoose.model<ICategory>("Category", categorySchema);
export default CategoryModel;
