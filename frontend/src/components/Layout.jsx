import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-6 lg:px-8">
        <Sidebar />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
