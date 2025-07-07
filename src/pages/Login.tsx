import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Reset Step States
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { toast } = useToast();
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
    const response = await fetch("https://onlinewriting.onrender.com/api/open/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error(data.message || "Invalid credentials");
    }

    // ✅ Save in sessionStorage instead of localStorage
    const { token, userId, fullName, userName } = data.body;
localStorage.setItem("token", token);
localStorage.setItem("fullName", fullName);
localStorage.setItem("userId", userId.toString());
localStorage.setItem("userName", userName);


    toast({
      title: `Welcome ${userName} 👋`,
      description: "Login successful",
    });

    onLogin(); // Proceed to dashboard or main app
  } catch (error: any) {
    toast({
      title: "Login Failed",
      description: error.message || "Something went wrong",
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
      const response = await fetch("https://onlinewriting.onrender.com/api/open/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "OTP Sent",
          description: data.message || "Check your email for the OTP",
        });
        setShowResetDialog(true);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Something went wrong. Try again later.",
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
      const response = await fetch("https://onlinewriting.onrender.com/api/open/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otp,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description: "You can now log in with your new password",
        });

        // Redirect to login state
        setShowResetDialog(false);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        toast({
          title: "Reset Failed",
          description: data.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@scripthive.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Forgot Password Trigger + Dialogs */}
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
                    />
                    <Button onClick={handleSendOTP} disabled={isSendingOTP}>
                      {isSendingOTP ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Step 2: Reset Password */}
              {showResetDialog && (
                <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Enter OTP & New Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Label>OTP Code</Label>
                      <Input
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button onClick={handleResetPassword} disabled={isResettingPassword}>
                        {isResettingPassword ? "Resetting..." : "Reset Password"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-scripthive-gray-dark">
          <p className="text-sm">© 2024 ScriptHive. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
