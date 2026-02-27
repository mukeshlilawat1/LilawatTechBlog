import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { FileText, Mail, Shield, Plus, BookDashed } from "lucide-react";
import { useAuth } from "../components/AuthContext";

// ── Initials avatar helper ──
const InitialsAvatar = ({
  name,
  size = "lg",
}: {
  name: string;
  size?: "sm" | "lg";
}) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const dim = size === "lg" ? "w-24 h-24 text-3xl" : "w-10 h-10 text-sm";

  return (
    <div className={`relative flex-shrink-0 ${dim}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-[10px] opacity-50" />
      <div
        className={`relative ${dim} rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl font-black text-white`}
      >
        {initials}
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { profile, role, isAdmin } = useAuth();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-default-400">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-default-100/30">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-default-200/40 py-14 sm:py-20">
        {/* Blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-secondary/15 to-transparent blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
            {/* Avatar */}
            <InitialsAvatar name={profile.name} size="lg" />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              {/* Role badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border"
                style={{
                  background: isAdmin
                    ? "rgba(var(--nextui-primary-500)/0.12)"
                    : "rgba(var(--nextui-success-500)/0.12)",
                  borderColor: isAdmin
                    ? "rgba(var(--nextui-primary-500)/0.35)"
                    : "rgba(var(--nextui-success-500)/0.35)",
                  color: isAdmin
                    ? "var(--nextui-primary)"
                    : "var(--nextui-success)",
                }}
              >
                <Shield size={11} />
                {isAdmin ? "Admin" : "Member"}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                {profile.name}
              </h1>

              <p className="flex items-center justify-center sm:justify-start gap-2 text-default-500 text-sm font-medium">
                <Mail size={14} />
                {profile.email}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap justify-center sm:justify-end">
              {isAdmin && (
                <Button
                  as={Link}
                  to="/posts/new"
                  size="md"
                  startContent={<Plus size={16} />}
                  className="font-black text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  New Post
                </Button>
              )}
              <Button
                as={Link}
                to="/posts/drafts"
                size="md"
                variant="flat"
                startContent={<BookDashed size={16} />}
                className="font-semibold"
              >
                My Drafts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats + Details ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <FileText size={20} className="text-primary" />,
              value: profile.totalPosts,
              label: "Total Posts",
              bg: "bg-primary/10",
              border: "border-primary/20",
              color: "text-primary",
            },
            {
              icon: <BookDashed size={20} className="text-secondary" />,
              value: "—",
              label: "Drafts",
              bg: "bg-secondary/10",
              border: "border-secondary/20",
              color: "text-secondary",
            },
            {
              icon: (
                <Shield
                  size={20}
                  className={isAdmin ? "text-primary" : "text-success"}
                />
              ),
              value: isAdmin ? "Admin" : "User",
              label: "Role",
              bg: isAdmin ? "bg-primary/10" : "bg-success/10",
              border: isAdmin ? "border-primary/20" : "border-success/20",
              color: isAdmin ? "text-primary" : "text-success",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border ${stat.border} ${stat.bg} p-5 flex flex-col gap-3`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}
              >
                {stat.icon}
              </div>
              <div>
                <div
                  className={`text-2xl sm:text-3xl font-black ${stat.color}`}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-default-500 mt-0.5 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="rounded-3xl border border-default-200/60 bg-background/80 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-default-200/50 bg-default-50/50">
            <h2 className="font-black text-foreground">Account Details</h2>
          </div>
          <div className="divide-y divide-default-100">
            {[
              { label: "Full Name", value: profile.name },
              { label: "Email Address", value: profile.email },
              { label: "Role", value: isAdmin ? "Administrator" : "Member" },
              {
                label: "Total Published Posts",
                value: String(profile.totalPosts),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="text-sm font-semibold text-default-500">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin quick links */}
        {isAdmin && (
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="font-black text-foreground mb-4 flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              Admin Quick Links
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                to="/categories"
                variant="flat"
                color="primary"
                size="sm"
                className="font-bold"
              >
                Manage Categories
              </Button>
              <Button
                as={Link}
                to="/tags"
                variant="flat"
                color="secondary"
                size="sm"
                className="font-bold"
              >
                Manage Tags
              </Button>
              <Button
                as={Link}
                to="/posts/new"
                variant="flat"
                color="success"
                size="sm"
                className="font-bold"
              >
                Write New Post
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
