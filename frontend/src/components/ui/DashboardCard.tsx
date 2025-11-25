import { type ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: ReactNode; // Lucide icon or any JSX
}

const DashboardCard = ({ title, value, icon, }: DashboardCardProps) => {
    return (
        <div
        className={`bg-white border-l-3 border-purple-500 flex justify-between items-center p-5 rounded-xl shadow-lg text-purple-500 min-w-[220px]`}
        >
            <div>
                <p className="text-sm opacity-80">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>

            <div className="p-3 rounded-full bg-purple-500 text-white flex items-center justify-center">
                {icon}
            </div>
        </div>
    );
};

export default DashboardCard;
