function VerifyEmailPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Check Your Email 📩
        </h2>

        <p className="text-gray-600">
          We have sent a verification link to your email address.
          Please click the link to verify your account before logging in.
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailPending;