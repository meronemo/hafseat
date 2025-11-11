"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { ratingAction } from "@/app/actions/feedback"

export function Rating() {
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  const handleRating = (star: number) => {
    setRating(star)
    ratingAction(star)
  }

  return (
    <>
      {rating === null ? (
        <div className="transition-all flex items-center gap-3 px-5 py-3 bg-card border rounded-full">
          <p className="text-sm font-medium whitespace-nowrap">HAFSeat이 어땠나요?</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                className="transition-all hover:scale-110 focus:scale-110"
              >
                <Star
                  className={`w-6 h-6 outline-none transition-all ${
                    (hoveredStar !== null ? star <= hoveredStar : false)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="transition-all flex flex-col items-center gap-2 p-4 bg-card border rounded-full">
          <div className="text-center">
            <p className="text-xs font-semibold">소중한 평가 감사합니다.</p>
            <p className="text-xs text-muted-foreground mt-1">
              더 나은 HAFSeat를 위해 의견이 있다면 적극적으로 보내주시기를 부탁드립니다.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
