import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

export const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-brand-600 p-2 rounded-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
        <h1 className="text-xl font-bold text-white">UP Uday News</h1>
                <p className="text-xs text-brand-300 -mt-1">360°</p>
              </div>
            </div>
            <p className="text-brand-300 text-sm leading-relaxed max-w-md">
        UP Uday News delivers comprehensive news coverage from around the
              world. Stay informed with our team of dedicated journalists and
              contributors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  Carriers
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  Politics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  Sports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-brand-300 hover:text-white transition-colors"
                >
                  Business
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-800 mt-8 pt-8 text-center">
          <p className="text-brand-300 text-sm">
            © {currentYear} UP UdayNews. All rights reserved.
          </p>
          <p className="text-brand-300 text-sm">Designed And Developed By Er.Akhilesh Yadav</p>
          <p className="text-brand-300 text-sm">Contact Dev Team by akhileshyadavkokta95@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};
