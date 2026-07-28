import { Link } from "react-router-dom";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              SmartSpend
            </h2>

            <p className="mt-5 leading-7">
              SmartSpend is a personal finance platform that helps
              users track expenses, manage budgets, achieve savings
              goals and make smarter financial decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>

              <li>
                <Link to="/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Features
            </h3>

            <ul className="space-y-3">
              <li>Expense Tracking</li>
              <li>Budget Planning</li>
              <li>Savings Goals</li>
              <li>Analytics</li>
              <li>PDF Export</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <FiMail />
                <span>smartspend.finance@gmail.com</span>
              </div>

              <div className="flex gap-4 pt-4">

                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition"
                >
                  <FiGithub size={20} />
                </a>

                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition"
                >
                  <FiLinkedin size={20} />
                </a>

              </div>

            </div>
          </div>

        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          © {new Date().getFullYear()} SmartSpend. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;