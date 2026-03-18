/**
 * AdCraft AI - Dashboard
 * Design: Dark Premium Tech
 * Layout: Sidebar + Main Content
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { useDraftManager, Draft } from "@/hooks/useDraftManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Wand2,
  LayoutTemplate,
  ImageIcon,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Clock,
  Download,
  CheckCircle2,
} from "lucide-react";
import BatchDownloadModal from "@/components/BatchDownloadModal";

export default function Dashboard() {
  const { t } = useLanguage();
  const { success: showSuccess, info: showInfo } = useToast();
  const [, navigate] = useLocation();
  const { getAllDrafts, deleteDraft, loadDraft } = useDraftManager();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());
  const [isBatchDownloadOpen, setIsBatchDownloadOpen] = useState(false);

  useEffect(() => {
    setDrafts(getAllDrafts());
  }, [getAllDrafts]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "generate", label: "Generate Image", icon: Wand2 },
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "designs", label: "My Designs", icon: ImageIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const recentDesigns = [
    { id: 1, title: "Flash Sale", category: "Promotion", date: "Today" },
    { id: 2, title: "Summer Collection", category: "Product", date: "Yesterday" },
    { id: 3, title: "Limited Offer", category: "Promotion", date: "2 days ago" },
    { id: 4, title: "New Arrivals", category: "Product", date: "3 days ago" },
    { id: 5, title: "Mega Sale", category: "Promotion", date: "4 days ago" },
    { id: 6, title: "Affiliate Campaign", category: "Affiliate", date: "5 days ago" },
  ];

  const handleDeleteDraft = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      deleteDraft(id);
      setDrafts(getAllDrafts());
      showSuccess("Draft deleted successfully");
    }
  };

  const handleEditDraft = (draftId: string) => {
    loadDraft(draftId);
    showInfo("Loading draft...");
    setTimeout(() => {
      navigate("/generate");
    }, 500);
  };

  const handleToggleSelect = (draftId: string) => {
    const newSelected = new Set(selectedDrafts);
    if (newSelected.has(draftId)) {
      newSelected.delete(draftId);
    } else {
      newSelected.add(draftId);
    }
    setSelectedDrafts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDrafts.size === drafts.length) {
      setSelectedDrafts(new Set());
    } else {
      setSelectedDrafts(new Set(drafts.map((d) => d.id)));
    }
  };

  const createCanvasFromData = (draft: Draft): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (ctx && draft.imageData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = draft.imageData;
    }
    return canvas;
  };

  const selectedDraftObjects = drafts
    .filter((d) => selectedDrafts.has(d.id))
    .map((d) => ({
      id: d.id,
      name: d.title,
      canvas: createCanvasFromData(d),
    }));

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <Header title="Dashboard" subtitle="Welcome back" showSearch />

      {/* Main Content */}
      <main className="flex-1">
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: "Dashboard", active: true }]} />

            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-poppins mb-2">Welcome back, Alex!</h1>
              <p className="text-muted-foreground">Here's what you've been creating</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Designs", value: "24", icon: ImageIcon },
                { label: "This Month", value: "8", icon: LayoutTemplate },
                { label: "Downloads", value: "156", icon: Plus },
                { label: "Drafts Saved", value: drafts.length.toString(), icon: Clock },
              ].map((stat, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground text-sm">{stat.label}</span>
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-poppins">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Saved Drafts Section */}
            {drafts.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold font-poppins flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Saved Drafts
                  </h2>
                  <div className="flex items-center gap-3">
                    {selectedDrafts.size > 0 && (
                      <>
                        <span className="text-sm text-muted-foreground">
                          {selectedDrafts.size} selected
                        </span>
                        <Button
                          onClick={() => setIsBatchDownloadOpen(true)}
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 red-glow-hover"
                        >
                          <Download className="w-4 h-4" />
                          Download ZIP
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={handleSelectAll}
                      variant="outline"
                      size="sm"
                      className={selectedDrafts.size === drafts.length ? "border-primary" : ""}
                    >
                      {selectedDrafts.size === drafts.length ? "Deselect All" : "Select All"}
                    </Button>
                    <span className="text-sm text-muted-foreground">{drafts.length} drafts</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className={`relative bg-card border rounded-lg p-4 transition cursor-pointer ${
                        selectedDrafts.has(draft.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleToggleSelect(draft.id)}
                    >
                      {selectedDrafts.has(draft.id) && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {draft.imageData && (
                        <div className="mb-3 rounded-lg overflow-hidden bg-secondary h-32">
                          <img
                            src={draft.imageData}
                            alt={draft.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="font-semibold font-poppins truncate">{draft.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {draft.headline} • {draft.size}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Saved {formatDate(draft.updatedAt)}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleEditDraft(draft.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 hover:border-primary/50"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="px-3 py-2 bg-destructive/20 border border-destructive/30 rounded text-destructive hover:bg-destructive/30 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Designs */}
            <div>
              <h2 className="text-xl font-bold font-poppins mb-4">Recent Designs</h2>

              <div className="space-y-2">
                {recentDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{design.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {design.category} • {design.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Batch Download Modal */}
      <BatchDownloadModal
        open={isBatchDownloadOpen}
        onOpenChange={setIsBatchDownloadOpen}
        selectedDesigns={selectedDraftObjects}
      />
    </div>
  );
}
