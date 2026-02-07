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
import { Plus, Edit3, LogOut, BookDashed, User } from "lucide-react";

interface NavBarProps {
  isAuthenticated: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  userProfile,
  onLogout,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Tags", path: "/tags" },
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      classNames={{
        base: "sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-default-200/50 shadow-sm",
        wrapper: "px-4 sm:px-6 lg:px-8",
        item: "data-[active=true]:font-semibold",
      }}
    >
      {/* Mobile menu toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-default-600"
        />
      </NavbarContent>

      {/* Brand (mobile) */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">LT</span>
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LilawatTechBlog
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Brand + links (desktop) */}
      <NavbarContent className="hidden sm:flex gap-6 lg:gap-8" justify="start">
        <NavbarBrand>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-primary/20">
              <span className="text-white font-bold">LT</span>
            </div>
            <span className="text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              LilawatTechBlog
            </span>
          </Link>
        </NavbarBrand>

        <div className="flex items-center gap-1 ml-4">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <NavbarItem key={item.path} isActive={active}>
                <Link
                  to={item.path}
                  className={`
                    relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "text-primary bg-primary/10"
                        : "text-default-600 hover:text-foreground hover:bg-default-100"
                    }
                  `}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                  )}
                </Link>
              </NavbarItem>
            );
          })}
        </div>
      </NavbarContent>

      {/* Right section */}
      <NavbarContent justify="end" className="gap-2 sm:gap-3">
        {isAuthenticated ? (
          <>
            {/* Drafts (desktop only) */}
            <NavbarItem className="hidden md:flex">
              <Button
                as={Link}
                to="/posts/drafts"
                variant="light"
                size="sm"
                startContent={<BookDashed size={16} />}
                className="font-medium hover:bg-default-100"
              >
                Drafts
              </Button>
            </NavbarItem>

            {/* New post */}
            <NavbarItem>
              <Button
                as={Link}
                to="/posts/new"
                color="primary"
                size="sm"
                startContent={<Plus size={18} />}
                className="font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 transition-all"
              >
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">New</span>
              </Button>
            </NavbarItem>

            {/* User dropdown */}
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    size="sm"
                    src={userProfile?.avatar}
                    name={userProfile?.name}
                    className="transition-transform hover:scale-110 cursor-pointer border-2 border-default-200 hover:border-primary"
                    classNames={{
                      base: "bg-gradient-to-br from-primary/20 to-secondary/20",
                    }}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="User menu"
                  variant="flat"
                  classNames={{
                    base: "p-2",
                  }}
                >
                  <DropdownItem
                    key="profile"
                    className="h-14 gap-2"
                    textValue="Profile"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        src={userProfile?.avatar}
                        name={userProfile?.name}
                      />
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm">
                          {userProfile?.name}
                        </p>
                        <p className="text-xs text-default-500">View profile</p>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="divider"
                    className="p-0 opacity-0 cursor-default"
                    textValue="divider"
                  >
                    <Divider className="my-1" />
                  </DropdownItem>
                  <DropdownItem
                    key="drafts"
                    startContent={
                      <Edit3 size={16} className="text-default-500" />
                    }
                    className="py-2"
                    textValue="My Drafts"
                  >
                    <Link to="/posts/drafts" className="w-full">
                      My Drafts
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    startContent={<LogOut size={16} />}
                    className="text-danger py-2"
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
          <NavbarItem>
            <Button
              as={Link}
              to="/login"
              variant="bordered"
              size="sm"
              startContent={<User size={16} />}
              className="font-medium border-default-300 hover:border-primary hover:bg-primary/5 transition-all"
            >
              Log In
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* ================= Mobile Menu ================= */}
      <NavbarMenu className="px-4 pt-6 pb-8 bg-background/95 backdrop-blur-xl">
        {/* User info (mobile) */}
        {isAuthenticated && (
          <>
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-default-100/50">
              <Avatar
                src={userProfile?.avatar}
                name={userProfile?.name}
                size="md"
                classNames={{
                  base: "bg-gradient-to-br from-primary/20 to-secondary/20",
                }}
              />
              <div className="text-sm flex-1">
                <p className="font-semibold text-foreground">
                  {userProfile?.name}
                </p>
                <p className="text-xs text-default-500">Manage your posts</p>
              </div>
            </div>
            <Divider className="mb-4" />
          </>
        )}

        {/* Menu links */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <NavbarMenuItem key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center w-full rounded-xl px-4 py-3 text-sm font-medium transition-all
                    ${
                      active
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-default-700 hover:bg-default-100 active:scale-95"
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </div>

        {/* Drafts & Actions (mobile) */}
        {isAuthenticated && (
          <>
            <Divider className="my-4" />
            <div className="space-y-1">
              <NavbarMenuItem>
                <Link
                  to="/posts/drafts"
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-default-700 hover:bg-default-100 transition-all active:scale-95"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookDashed size={18} className="text-default-500" />
                  Draft Posts
                </Link>
              </NavbarMenuItem>

              <NavbarMenuItem>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-danger hover:bg-danger/10 transition-all active:scale-95"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </NavbarMenuItem>
            </div>
          </>
        )}

        {/* Mobile New Post Button */}
        {isAuthenticated && (
          <div className="mt-6">
            <Button
              as={Link}
              to="/posts/new"
              color="primary"
              size="lg"
              startContent={<Plus size={20} />}
              className="w-full font-semibold shadow-lg shadow-primary/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Create New Post
            </Button>
          </div>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
