import { Profile } from "./profile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen container mx-auto border-x">
      <div className="p-4 border-b flex items-center">
        <span>Soda</span>
        <Profile />
      </div>
      <div className="px-4 p-6 flex flex-col gap-6">{children}</div>
    </div>
  );
};
