import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../api/queryClient";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Logout: Clearing user info and redirecting...");
    localStorage.removeItem("userInfo");
    queryClient.clear();
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Logging you out...</h2>
        <p className="text-muted-foreground">Please wait a moment.</p>
      </div>
    </div>
  );
};

export default Logout;
