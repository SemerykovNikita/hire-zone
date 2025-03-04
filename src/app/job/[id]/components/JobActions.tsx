import { Heart, Send } from "lucide-react";

interface JobActionsProps {
  onApply: () => void;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
  isLoggedIn: boolean;
}

export function JobActions({
  onApply,
  onFavoriteToggle,
  isFavorite,
  isLoggedIn,
}: JobActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onApply}
        className="flex-1 flex items-center justify-center space-x-2 bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Send className="h-5 w-5" />
        <span>Submit Application</span>
      </button>

      <button
        onClick={onFavoriteToggle}
        disabled={!isLoggedIn}
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
          isFavorite
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        } ${!isLoggedIn && "opacity-50 cursor-not-allowed"}`}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        <span>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
      </button>
    </div>
  );
}
