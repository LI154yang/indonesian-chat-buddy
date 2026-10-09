import cafeImage from "@/assets/hero-warung.jpg";
import marketImage from "@/assets/course-market.jpg";
import directionsImage from "@/assets/course-directions.jpg";
import hotelImage from "@/assets/course-hotel.jpg";

export const courseGroups = ["全部课程", "日常交流", "旅行生活", "社交进阶"] as const;
export type CourseGroup = (typeof courseGroups)[number];

export const courseDetails: Record<string, { category: CourseGroup; image: string; label: string }> = {
  greeting: { category: "日常交流", image: cafeImage, label: "认识彼此" },
  market: { category: "旅行生活", image: marketImage, label: "逛一逛市场" },
  restaurant: { category: "旅行生活", image: cafeImage, label: "尝尝当地味道" },
  directions: { category: "旅行生活", image: directionsImage, label: "走进城市" },
  hotel: { category: "旅行生活", image: hotelImage, label: "旅途安顿下来" },
  friends: { category: "社交进阶", image: cafeImage, label: "从认识到朋友" },
};