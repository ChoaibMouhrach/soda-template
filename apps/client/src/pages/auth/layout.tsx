interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
};
