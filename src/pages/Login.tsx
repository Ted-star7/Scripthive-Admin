import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Login = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginDetails, setLoginDetails] = useState<{
    token: string;
    userId: number;
    fullName: string;
    userName: string;
    email: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Password reset state
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyToClipboard = (
    text: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://onlinewriting.onrender.com/api/open/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Invalid credentials");
      }

      const sessionData = {
        message: data.message,
        status: data.status,
        body: {
          token: data.body.token,
          userId: data.body.userId,
          fullName: data.body.fullName,
          userName: data.body.userName,
          active: data.body.active,
          email: email, // added to match User type
        },
      };

      login(sessionData.body);

      setLoginDetails({
        token: sessionData.body.token,
        userId: sessionData.body.userId,
        fullName: sessionData.body.fullName,
        userName: sessionData.body.userName,
        email: sessionData.body.email,
      });

      localStorage.setItem("session", JSON.stringify(sessionData));

      toast({
        title: `Welcome ${sessionData.body.userName} 👋`,
        description: sessionData.message,
      });

      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!forgotEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    setIsSendingOTP(true);
    try {
      const response = await fetch(
        "https://onlinewriting.onrender.com/api/open/users/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "OTP Sent",
          description: data.message || "Check your email for the OTP",
        });
        setShowResetDialog(true);
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      toast({
        title: "Missing fields",
        description: "OTP and new password are required",
        variant: "destructive",
      });
      return;
    }

    setIsResettingPassword(true);
    try {
      const response = await fetch(
        "https://onlinewriting.onrender.com/api/open/users/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotEmail,
            otp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description: "You can now log in with your new password",
        });
        setShowResetDialog(false);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const proceedToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-scripthive-gray-light hive-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-24 h-24">
              <img
                src="/Logo.png"
                alt="ScriptHive Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <CardTitle className="text-3xl font-bold text-scripthive-black">
              ScriptHive
            </CardTitle>
            <CardDescription className="text-scripthive-gray-dark text-base">
              Welcome back to your admin portal
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!loginDetails ? (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@scripthive.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={handleShowPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-scripthive-gold hover:text-scripthive-gold-dark font-medium transition-colors">
                        Forgot Password?
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Reset Your Password</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Label htmlFor="forgotEmail">Email</Label>
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="you@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          autoComplete="email"
                        />
                        <Button onClick={handleSendOTP} disabled={isSendingOTP}>
                          {isSendingOTP ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800">
                    Login Successful!
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    Here are your authentication details:
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>User ID</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={loginDetails.userId.toString()}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={(e) =>
                          copyToClipboard(loginDetails.userId.toString(), e)
                        }
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Username</Label>
                    <Input value={loginDetails.userName} readOnly />
                  </div>

                  <div>
                    <Label>Full Name</Label>
                    <Input value={loginDetails.fullName} readOnly />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input value={loginDetails.email} readOnly />
                  </div>

                  <div>
                    <Label>Access Token</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={loginDetails.token}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={(e) =>
                          copyToClipboard(loginDetails.token, e)
                        }
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This token is used for authenticated requests
                    </p>
                  </div>
                </div>

                <Button className="w-full mt-4" onClick={proceedToDashboard}>
                  Proceed to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-scripthive-gray-dark">
          <p className="text-sm">
            © {new Date().getFullYear()} ScriptHive. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
