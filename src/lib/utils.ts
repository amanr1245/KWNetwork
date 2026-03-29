import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const d = new Date(dateString);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const weekday = weekdays[d.getDay()];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const rawHours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = rawHours >= 12 ? "PM" : "AM";
  const hours = rawHours % 12 || 12;

  return `${weekday}, ${month} ${day}, ${hours}:${minutes} ${ampm}`;
}
