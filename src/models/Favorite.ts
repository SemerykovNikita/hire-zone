import mongoose, { Document } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Schema.Types.ObjectId;
  jobVacancy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new mongoose.Schema<IFavorite>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobVacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobVacancy",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FavoriteModel =
  mongoose.models?.Favorite ||
  mongoose.model<IFavorite>("Favorite", favoriteSchema);

export default FavoriteModel;
