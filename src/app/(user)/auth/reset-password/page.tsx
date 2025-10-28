import ShootingStars from "@/components/ui/shooting-stars";
import { Div } from "@/components/ui/tags";
import ResetPasswordForm from "@/features/auth/reset-password/form";

const ResetPassword = () => {
  return (
    <div className="grid items-center justify-center h-screen w-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
      <div className="z-50">
        <ShootingStars />
      </div>
      <div className="flex h-screen align-middle justify-center items-center w-screen z-50">
        <div className="flex h-screen align-middle justify-center items-center p-6 w-full md:w-2/4 lg:w-2/5">
          <ResetPasswordForm/>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
