import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
} from "@nextui-org/react";
import {
  Plus,
  Edit3,
  LogOut,
  BookDashed,
  User,
  Zap,
  UserCircle,
  FileText,
  NotebookPen,
  ShieldCheck,
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Home", path: "/" },
    ...(isAdmin
      ? [
          { name: "Categories", path: "/categories" },
          { name: "Tags", path: "/tags" },
        ]
      : []),
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      classNames={{
        base: "sticky top-0 z-[100] bg-background backdrop-blur-xl border-b border-default-200/60 shadow-sm",
        wrapper: "px-4 sm:px-6 lg:px-8 max-w-7xl",
      }}
    >
      {/* ── Mobile toggle ── */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* ── Brand mobile ── */}
      <NavbarContent className="sm:hidden" justify="center">
        <NavbarBrand>
          <Link to="/" className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span className="text-base font-black tracking-tight text-foreground">
              LilawatTechBlog
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* ── Brand + Nav desktop ── */}
      <NavbarContent className="hidden sm:flex" justify="start">
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

        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <NavbarItem key={item.path} isActive={active}>
              <Link
                to={item.path}
                className={`
                  relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-default-600 hover:text-foreground hover:bg-default-100"
                  }
                `}
              >
                {item.name}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gradient-to-r from-primary to-secondary rounded-full" />
                )}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* ── Right actions ── */}
      <NavbarContent justify="end" className="gap-2">
        {isAuthenticated ? (
          <>
            {/* Admin review queue badge — desktop */}
            {isAdmin && (
              <NavbarItem className="hidden md:flex">
                <Button
                  as={Link}
                  to="/admin"
                  variant="flat"
                  size="sm"
                  startContent={<ShieldCheck size={15} />}
                  className="font-semibold text-violet-600 bg-violet-100/60 hover:bg-violet-100"
                >
                  Review Queue
                </Button>
              </NavbarItem>
            )}

            {/* New Post */}
            <NavbarItem>
              <Button
                as={Link}
                to="/posts/new"
                size="sm"
                startContent={<Plus size={16} strokeWidth={2.5} />}
                className="font-black text-white bg-gradient-to-r from-primary to-secondary shadow-md shadow-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">New</span>
              </Button>
            </NavbarItem>

            {/* Avatar dropdown */}
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
                  {/* User info header */}
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

                  {/* My Profile */}
                  <DropdownItem
                    key="my-profile"
                    startContent={
                      <UserCircle size={15} className="text-default-400" />
                    }
                    className="py-2 font-medium"
                    textValue="My Profile"
                  >
                    <Link to="/profile" className="w-full block">
                      My Profile
                    </Link>
                  </DropdownItem>

                  {/* My Posts */}
                  <DropdownItem
                    key="my-posts"
                    startContent={
                      <FileText size={15} className="text-default-400" />
                    }
                    className="py-2 font-medium"
                    textValue="My Posts"
                  >
                    <Link to="/my-posts" className="w-full block">
                      My Posts
                    </Link>
                  </DropdownItem>

                  {/* My Notes */}
                  <DropdownItem
                    key="my-notes"
                    startContent={
                      <NotebookPen size={15} className="text-default-400" />
                    }
                    className="py-2 font-medium"
                    textValue="My Notes"
                  >
                    <Link to="/notes" className="w-full block">
                      My Notes
                    </Link>
                  </DropdownItem>

                  {/* Drafts */}
                  <DropdownItem
                    key="drafts"
                    startContent={
                      <Edit3 size={15} className="text-default-400" />
                    }
                    className="py-2 font-medium"
                    textValue="My Drafts"
                  >
                    <Link to="/posts/drafts" className="w-full block">
                      My Drafts
                    </Link>
                  </DropdownItem>

                  {/* Admin — Review Queue */}
                  {isAdmin && (
                    <DropdownItem
                      key="admin-review"
                      startContent={
                        <ShieldCheck size={15} className="text-violet-500" />
                      }
                      className="py-2 font-medium text-violet-600"
                      textValue="Review Queue"
                    >
                      <Link to="/admin" className="w-full block">
                        Review Queue
                      </Link>
                    </DropdownItem>
                  )}

                  <DropdownItem
                    key="div2"
                    isReadOnly
                    className="p-0 h-px bg-default-100 my-1 opacity-100"
                    textValue="-"
                  />

                  {/* Logout */}
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
            <NavbarItem className="hidden sm:flex">
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

      {/* ════════════ Mobile Menu ════════════ */}
      <NavbarMenu className="px-4 pt-4 pb-10 bg-background/98 backdrop-blur-xl">
        {/* User card mobile */}
        {isAuthenticated && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/8 to-secondary/5 border border-primary/15 flex items-center gap-3">
            <Avatar
              src={userProfile?.avatar}
              name={userProfile?.name}
              size="md"
              classNames={{
                base: "bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0",
              }}
            />
            <div>
              <p className="font-black text-sm text-foreground">
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
          </div>
        )}

        {/* Nav links */}
        <div className="space-y-1 mb-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <NavbarMenuItem key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-default-600 hover:bg-default-100 hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </div>

        {isAuthenticated ? (
          <>
            <Divider className="my-3" />
            <div className="space-y-1">
              <NavbarMenuItem>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-default-600 hover:bg-default-100 hover:text-foreground transition-all"
                >
                  <UserCircle size={17} className="text-default-400" /> My
                  Profile
                </Link>
              </NavbarMenuItem>

              {/* ✅ My Posts mobile */}
              <NavbarMenuItem>
                <Link
                  to="/my-posts"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-default-600 hover:bg-default-100 hover:text-foreground transition-all"
                >
                  <FileText size={17} className="text-default-400" /> My Posts
                </Link>
              </NavbarMenuItem>

              {/* ✅ My Notes mobile */}
              <NavbarMenuItem>
                <Link
                  to="/notes"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-default-600 hover:bg-default-100 hover:text-foreground transition-all"
                >
                  <NotebookPen size={17} className="text-default-400" /> My
                  Notes
                </Link>
              </NavbarMenuItem>

              <NavbarMenuItem>
                <Link
                  to="/posts/drafts"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-default-600 hover:bg-default-100 hover:text-foreground transition-all"
                >
                  <BookDashed size={17} className="text-default-400" /> Draft
                  Posts
                </Link>
              </NavbarMenuItem>

              {/* ✅ Admin Review Queue mobile */}
              {isAdmin && (
                <NavbarMenuItem>
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-violet-600 hover:bg-violet-50 transition-all"
                  >
                    <ShieldCheck size={17} className="text-violet-500" /> Review
                    Queue
                  </Link>
                </NavbarMenuItem>
              )}

              <NavbarMenuItem>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-danger hover:bg-danger/10 transition-all"
                >
                  <LogOut size={17} /> Log Out
                </button>
              </NavbarMenuItem>
            </div>

            <div className="mt-5">
              <Button
                as={Link}
                to="/posts/new"
                size="lg"
                startContent={<Plus size={19} />}
                className="w-full font-black text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30"
                onClick={() => setIsMenuOpen(false)}
              >
                Create New Post
              </Button>
            </div>
          </>
        ) : (
          <>
            <Divider className="my-3" />
            <div className="space-y-2 mt-2">
              <Button
                as={Link}
                to="/register"
                size="lg"
                variant="flat"
                className="w-full font-black bg-default-100 text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Account
              </Button>
              <Button
                as={Link}
                to="/login"
                size="lg"
                startContent={<User size={18} />}
                className="w-full font-black text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Button>
            </div>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

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
