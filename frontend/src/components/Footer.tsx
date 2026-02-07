import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-default-200 bg-background/80 backdrop-blur-xl">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 w-[420px] h-[420px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-0 w-[420px] h-[420px] bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">
              LilawatTechBlog
            </h3>
            <p className="text-sm text-default-600 leading-relaxed max-w-xs">
              Practical, production-level blogs on software engineering, system
              design, and real-world debugging.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-default-700">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-default-600">
              <li className="hover:text-foreground transition cursor-pointer">
                Home
              </li>
              <li className="hover:text-foreground transition cursor-pointer">
                Categories
              </li>
              <li className="hover:text-foreground transition cursor-pointer">
                Tags
              </li>
              <li className="hover:text-foreground transition cursor-pointer">
                Drafts
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-default-700">
              Topics
            </h4>
            <ul className="space-y-2 text-sm text-default-600">
              <li className="hover:text-foreground transition">Spring Boot</li>
              <li className="hover:text-foreground transition">
                React & Frontend
              </li>
              <li className="hover:text-foreground transition">
                System Design
              </li>
              <li className="hover:text-foreground transition">
                Backend Architecture
              </li>
            </ul>
          </div>

          {/* Author */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-default-700">
              Author
            </h4>
            <p className="text-sm text-default-600">
              Written by{" "}
              <span className="font-semibold text-foreground">
                Mukesh Lilawat
              </span>
            </p>
            <p className="text-xs text-default-500">
              Software Engineer · Full-Stack Developer
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-default-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-default-500">
          <p>
            © {new Date().getFullYear()} LilawatTechBlog. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Built with ❤️ using React & Spring Boot
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
