import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import {
  BookDashed,
  Edit3,
  FileText,
  Home,
  LogOut,
  Menu,
  Moon,
  NotebookPen,
  Plus,
  ShieldCheck,
  Sun,
  User,
  UserCircle,
  X,
  Zap,
  ChevronRight,
  Info,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Github,
  Twitter,
  Mail,
} from "lucide-react";

interface NavBarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  isAdmin,
  userProfile,
  onLogout,
}) => {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  const [isDark, setIsDark] = React.useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  React.useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    ...(isAdmin
      ? [
          {
            name: "Categories",
            path: "/categories",
            icon: <FileText size={18} />,
          },
          { name: "Tags", path: "/tags", icon: <BookDashed size={18} /> },
        ]
      : []),
  ];

  const moreLinks = [
    {
      name: "About",
      path: "/about",
      icon: <Info size={16} />,
      desc: "Who we are",
    },
    {
      name: "Help Centre",
      path: "/help",
      icon: <HelpCircle size={16} />,
      desc: "FAQs & guides",
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <MessageSquare size={16} />,
      desc: "Get in touch",
    },
  ];

  const userMenuLinks = [
    { name: "My Profile", path: "/profile", icon: <UserCircle size={17} /> },
    { name: "My Posts", path: "/my-posts", icon: <FileText size={17} /> },
    { name: "My Notes", path: "/notes", icon: <NotebookPen size={17} /> },
    { name: "My Drafts", path: "/posts/drafts", icon: <Edit3 size={17} /> },
    ...(isAdmin
      ? [
          {
            name: "Review Queue",
            path: "/admin",
            icon: <ShieldCheck size={17} />,
            isAdmin: true,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP NAVBAR
      ══════════════════════════════════════ */}
      <Navbar
        isBordered
        maxWidth="xl"
        classNames={{
          base: "hidden sm:flex sticky top-0 z-[100] bg-background/90 backdrop-blur-xl border-b border-default-200/60 shadow-sm",
          wrapper: "px-4 sm:px-6 lg:px-8 max-w-7xl",
        }}
      >
        <NavbarContent justify="start">
          <NavbarBrand>
            <Link to="/" className="flex items-center gap-3 mr-6">
              <LogoMark size="md" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-black tracking-[0.25em] uppercase text-primary">
                  Lilawat
                </span>
                <span className="text-[17px] font-black tracking-tight text-foreground">
                  TechBlog
                </span>
              </div>
            </Link>
          </NavbarBrand>

          <div className="w-px h-5 bg-default-300 mr-2" />

          {navLinks.map((item) => {
            const active = location.pathname === item.path;
            return (
              <NavbarItem key={item.path} isActive={active}>
                <Link
                  to={item.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-default-600 hover:text-foreground hover:bg-default-100"
                  }`}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gradient-to-r from-primary to-secondary rounded-full" />
                  )}
                </Link>
              </NavbarItem>
            );
          })}

          {/* More dropdown */}
          <NavbarItem>
            <Dropdown
              isOpen={moreOpen}
              onOpenChange={setMoreOpen}
              placement="bottom-start"
            >
              <DropdownTrigger>
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    moreOpen
                      ? "text-primary bg-primary/10"
                      : "text-default-600 hover:text-foreground hover:bg-default-100"
                  }`}
                >
                  More
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="More links"
                variant="flat"
                classNames={{ base: "p-2 min-w-[200px]" }}
              >
                {moreLinks.map((link) => (
                  <DropdownItem
                    key={link.path}
                    startContent={
                      <span className="text-default-400">{link.icon}</span>
                    }
                    description={link.desc}
                    className="py-2"
                    textValue={link.name}
                  >
                    <Link
                      to={link.path}
                      className="w-full block font-semibold text-sm"
                    >
                      {link.name}
                    </Link>
                  </DropdownItem>
                ))}

                <DropdownItem
                  key="div"
                  isReadOnly
                  className="p-0 h-px bg-default-100 my-1 opacity-100"
                  textValue="-"
                />

                {/* Social links */}
                <DropdownItem
                  key="socials"
                  isReadOnly
                  className="opacity-100 cursor-default"
                  textValue="Socials"
                >
                  <div className="flex items-center gap-2 py-1">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-default-500 hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-default-100"
                    >
                      <Github size={13} /> GitHub
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-default-500 hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-default-100"
                    >
                      <Twitter size={13} /> Twitter
                    </a>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="gap-2">
          <NavbarItem>
            <ThemeToggleBtn isDark={isDark} toggleTheme={toggleTheme} />
          </NavbarItem>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <NavbarItem className="hidden md:flex">
                  <Button
                    as={Link}
                    to="/admin"
                    variant="flat"
                    size="sm"
                    startContent={<ShieldCheck size={15} />}
                    className="font-semibold text-violet-600 bg-violet-100/60 hover:bg-violet-100 dark:bg-violet-900/30"
                  >
                    Review Queue
                  </Button>
                </NavbarItem>
              )}

              <NavbarItem>
                <Button
                  as={Link}
                  to="/posts/new"
                  size="sm"
                  startContent={<Plus size={16} strokeWidth={2.5} />}
                  className="font-black text-white bg-gradient-to-r from-primary to-secondary shadow-md shadow-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  New Post
                </Button>
              </NavbarItem>

              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      size="sm"
                      src={userProfile?.avatar}
                      name={userProfile?.name}
                      className="cursor-pointer hover:scale-110 transition-transform"
                      classNames={{
                        base: "bg-gradient-to-br from-primary/20 to-secondary/20",
                      }}
                    />
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="User menu"
                    variant="flat"
                    classNames={{ base: "p-2 min-w-[220px]" }}
                  >
                    <DropdownItem
                      key="user-info"
                      isReadOnly
                      className="opacity-100 cursor-default mb-1"
                      textValue="User Info"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <Avatar
                          size="sm"
                          src={userProfile?.avatar}
                          name={userProfile?.name}
                          classNames={{
                            base: "bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0",
                          }}
                        />
                        <div>
                          <p className="font-black text-sm text-foreground">
                            {userProfile?.name || "User"}
                          </p>
                          {isAdmin ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                              <Zap size={9} /> Admin
                            </span>
                          ) : (
                            <span className="text-[10px] text-default-400 font-semibold">
                              Member
                            </span>
                          )}
                        </div>
                      </div>
                    </DropdownItem>

                    <DropdownItem
                      key="div1"
                      isReadOnly
                      className="p-0 h-px bg-default-100 my-1 opacity-100"
                      textValue="-"
                    />

                    {userMenuLinks.map((link) => (
                      <DropdownItem
                        key={link.path}
                        startContent={
                          <span
                            className={
                              link.isAdmin
                                ? "text-violet-500"
                                : "text-default-400"
                            }
                          >
                            {link.icon}
                          </span>
                        }
                        className={`py-2 font-medium ${link.isAdmin ? "text-violet-600" : ""}`}
                        textValue={link.name}
                      >
                        <Link to={link.path} className="w-full block">
                          {link.name}
                        </Link>
                      </DropdownItem>
                    ))}

                    <DropdownItem
                      key="div-more"
                      isReadOnly
                      className="p-0 h-px bg-default-100 my-1 opacity-100"
                      textValue="-"
                    />

                    {/* About/Help in user menu too */}
                    <DropdownItem
                      key="help"
                      startContent={
                        <HelpCircle size={15} className="text-default-400" />
                      }
                      className="py-2 font-medium"
                      textValue="Help Centre"
                    >
                      <Link to="/help" className="w-full block">
                        Help Centre
                      </Link>
                    </DropdownItem>

                    <DropdownItem
                      key="theme"
                      startContent={
                        isDark ? (
                          <Sun size={15} className="text-amber-400" />
                        ) : (
                          <Moon size={15} className="text-slate-500" />
                        )
                      }
                      className="py-2 font-medium"
                      onPress={toggleTheme}
                      textValue="Toggle Theme"
                    >
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </DropdownItem>

                    <DropdownItem
                      key="div2"
                      isReadOnly
                      className="p-0 h-px bg-default-100 my-1 opacity-100"
                      textValue="-"
                    />

                    <DropdownItem
                      key="logout"
                      startContent={<LogOut size={15} />}
                      className="text-danger py-2 font-semibold"
                      color="danger"
                      onPress={onLogout}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Button
                  as={Link}
                  to="/register"
                  variant="flat"
                  size="sm"
                  className="font-semibold text-default-600 bg-default-100 hover:bg-default-200"
                >
                  Sign Up
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  to="/login"
                  size="sm"
                  startContent={<User size={15} />}
                  className="font-black text-white bg-gradient-to-r from-primary to-secondary shadow-md shadow-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Log In
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>

      {/* ══════════════════════════════════════
          MOBILE TOP BAR
      ══════════════════════════════════════ */}
      <div className="sm:hidden sticky top-0 z-[100] bg-background/95 backdrop-blur-xl border-b border-default-200/60 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark size="sm" />
            <span className="text-[15px] font-black tracking-tight text-foreground">
              LilawatTechBlog
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggleBtn isDark={isDark} toggleTheme={toggleTheme} />
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-default-100 hover:bg-default-200 active:bg-default-300 transition-colors"
              aria-label="Toggle menu"
            >
              {isDrawerOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════ */}
      <>
        <div
          className={`sm:hidden fixed inset-0 top-14 z-[89] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isDrawerOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        />

        <div
          className={`sm:hidden fixed inset-x-0 top-14 z-[90] transition-all duration-300 ease-in-out ${
            isDrawerOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-3 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-background/98 backdrop-blur-2xl border-b border-default-200/60 shadow-2xl rounded-b-3xl mx-3 overflow-hidden">
            <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
              {/* User card */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-primary/8 to-secondary/5 border border-primary/15">
                  <Avatar
                    src={userProfile?.avatar}
                    name={userProfile?.name}
                    size="md"
                    classNames={{
                      base: "bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-foreground truncate">
                      {userProfile?.name || "User"}
                    </p>
                    {isAdmin ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-primary">
                        <Zap size={10} /> Admin
                      </span>
                    ) : (
                      <p className="text-xs text-default-400">Member</p>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-default-300 flex-shrink-0"
                  />
                </div>
              )}

              {/* Nav links */}
              <div className="space-y-1">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-default-400 px-2 pb-1">
                  Navigation
                </p>
                {navLinks.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsDrawerOpen(false)}
                      className={`flex items-center justify-between w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-default-600 hover:bg-default-100 hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={
                            active ? "text-primary" : "text-default-400"
                          }
                        >
                          {item.icon}
                        </span>
                        {item.name}
                      </span>
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* User account links */}
              {isAuthenticated && (
                <>
                  <Divider />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-default-400 px-2 pb-1">
                      My Account
                    </p>
                    {userMenuLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsDrawerOpen(false)}
                        className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                          link.isAdmin
                            ? "text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                            : "text-default-600 hover:bg-default-100 hover:text-foreground"
                        }`}
                      >
                        <span
                          className={
                            link.isAdmin
                              ? "text-violet-500"
                              : "text-default-400"
                          }
                        >
                          {link.icon}
                        </span>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <Divider />

              {/* More / Info links */}
              <div className="space-y-1">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-default-400 px-2 pb-1">
                  More
                </p>
                {moreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-default-600 hover:bg-default-100 hover:text-foreground transition-all duration-200"
                  >
                    <span className="text-default-400">{link.icon}</span>
                    {link.name}
                    <span className="ml-auto text-xs text-default-400 font-normal">
                      {link.desc}
                    </span>
                  </Link>
                ))}

                {/* Social links row */}
                <div className="flex items-center gap-2 px-4 py-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-default-500 hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg bg-default-100 hover:bg-default-200"
                  >
                    <Github size={13} /> GitHub
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-default-500 hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg bg-default-100 hover:bg-default-200"
                  >
                    <Twitter size={13} /> Twitter
                  </a>
                  <a
                    href="mailto:contact@lilawattech.com"
                    className="flex items-center gap-1.5 text-xs font-semibold text-default-500 hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg bg-default-100 hover:bg-default-200"
                  >
                    <Mail size={13} /> Email
                  </a>
                </div>
              </div>

              <Divider />

              {/* Bottom CTAs */}
              <div className="space-y-2 pb-1">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/posts/new"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-black text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Plus size={18} strokeWidth={2.5} /> Create New Post
                    </Link>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onLogout();
                      }}
                      className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-danger bg-danger/8 hover:bg-danger/15 border border-danger/20 transition-all duration-200"
                    >
                      <LogOut size={17} /> Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-center w-full rounded-xl py-3 text-sm font-black text-foreground bg-default-100 hover:bg-default-200 transition-all duration-200"
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-black text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25 transition-all duration-200"
                    >
                      <User size={17} /> Log In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM NAV
      ══════════════════════════════════════ */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-[80] bg-background/95 backdrop-blur-xl border-t border-default-200/60">
        <div className="flex items-center justify-around px-2 h-16 pb-safe">
          <BottomNavItem
            to="/"
            icon={<Home size={22} />}
            label="Home"
            active={location.pathname === "/"}
          />

          {isAuthenticated ? (
            <Link
              to="/posts/new"
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/40 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-200">
                <Plus size={26} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-primary mt-0.5">
                New
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/40 active:scale-95 transition-all duration-200">
                <User size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-primary mt-0.5">
                Login
              </span>
            </Link>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all"
            >
              <div
                className={`transition-all duration-200 ${isDrawerOpen ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full" : ""}`}
              >
                <Avatar
                  src={userProfile?.avatar}
                  name={userProfile?.name}
                  classNames={{
                    base: "bg-gradient-to-br from-primary/20 to-secondary/20 w-7 h-7",
                  }}
                />
              </div>
              <span
                className={`text-[10px] font-bold transition-colors ${isDrawerOpen ? "text-primary" : "text-default-400"}`}
              >
                Menu
              </span>
            </button>
          ) : (
            <BottomNavItem
              to="/register"
              icon={<UserCircle size={22} />}
              label="Sign Up"
              active={location.pathname === "/register"}
            />
          )}
        </div>
      </div>

      <div className="sm:hidden h-16" />
    </>
  );
};

/* ── Bottom Nav Item ── */
const BottomNavItem = ({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px] relative ${
      active ? "text-primary" : "text-default-400 hover:text-default-600"
    }`}
  >
    <span
      className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}
    >
      {icon}
    </span>
    <span
      className={`text-[10px] font-bold ${active ? "text-primary" : "text-default-400"}`}
    >
      {label}
    </span>
    {active && (
      <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
    )}
  </Link>
);

/* ── Theme Toggle ── */
const ThemeToggleBtn = ({
  isDark,
  toggleTheme,
}: {
  isDark: boolean;
  toggleTheme: () => void;
}) => (
  <button
    onClick={toggleTheme}
    aria-label="Toggle theme"
    className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-default-200 bg-default-100/60 hover:bg-default-200 hover:scale-110 active:scale-95 transition-all duration-300"
  >
    <span
      className={`absolute transition-all duration-500 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}`}
    >
      <Sun size={16} className="text-amber-400" />
    </span>
    <span
      className={`absolute transition-all duration-500 ${!isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
    >
      <Moon size={16} className="text-slate-600 dark:text-slate-300" />
    </span>
  </button>
);

/* ── Logo Mark ── */
const LogoMark = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const textSize = size === "sm" ? "text-sm" : "text-base";
  return (
    <div className={`relative ${dim} flex-shrink-0`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl blur-[5px] opacity-40" />
      <div
        className={`relative ${dim} rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-secondary shadow-md`}
      >
        <span className={`text-white font-black ${textSize}`}>LT</span>
      </div>
    </div>
  );
};

export default NavBar;
