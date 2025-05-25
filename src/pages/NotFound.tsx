
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-military-navy bg-opacity-5">
      <div className="text-center space-y-4 max-w-md p-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-military-navy bg-opacity-10 mb-4">
          <Shield className="h-10 w-10 text-military-navy" />
        </div>
        <h1 className="text-4xl font-bold text-military-navy">404</h1>
        <h2 className="text-2xl font-bold text-military-navy">Page Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The page you are looking for doesn't exist or you don't have authorization to access it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-military-navy hover:bg-military-highlight"
          >
            Go to Dashboard
          </Button>
          <Button 
            onClick={() => navigate('/login')} 
            variant="outline"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
