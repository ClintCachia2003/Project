import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm",
        hover && "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
