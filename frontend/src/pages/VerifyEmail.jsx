import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(
          `https://smartspend-production-2753.up.railway.app/api/auth/verify-email/${token}`
        );

        setSuccess(true);
        toast.success("Email verified successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } catch (error) {
        toast.error(
          error.response?.data?.message || "Invalid or expired link"
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">

        {success ? (
          <>
            <h2 className="text-3xl font-bold text-green-600 mb-3">
              Email Verified ✅
            </h2>

            <p className="text-gray-600">
              Your account has been verified.
              <br />
              Redirecting to login...
            </p>
          </>
        ) : (
          <h2 className="text-xl font-semibold">
            Verifying your email...
          </h2>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;