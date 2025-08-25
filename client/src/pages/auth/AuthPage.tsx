import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthView } from "@daveyplate/better-auth-ui";
import { ArrowLeft } from "lucide-react";
import Header from "../../components/Header";
import { authClient } from "../../lib/auth-client";

export default function AuthPage() {
  const { pathname } = useParams<{ pathname?: string }>();
  const effectivePathname = pathname || "login";
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (!isPending && session?.user) {
      navigate("/seller");
    }
  }, [session, isPending, navigate]);

  // Redirect on successful login event
  useEffect(() => {
    const handleAuthSuccess = () => navigate("/seller");

    window.addEventListener("authSuccess", handleAuthSuccess);
    return () => window.removeEventListener("authSuccess", handleAuthSuccess);
  }, [navigate]);

  return (
    <>
      <Header isAuthPage={true} />
      <main className="container flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
        <div className="w-full flex justify-start mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>
        <AuthView pathname={effectivePathname} />
      </main>
    </>
  );
}
