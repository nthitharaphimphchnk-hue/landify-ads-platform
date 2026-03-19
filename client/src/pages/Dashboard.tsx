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

  const statCards = [
    { label: "Total Designs", value: "24", icon: ImageIcon, accent: "Library" },
    { label: "This Month", value: "8", icon: LayoutTemplate, accent: "Monthly" },
    { label: "Downloads", value: "156", icon: Plus, accent: "Exported" },
    { label: "Drafts Saved", value: drafts.length.toString(), icon: Clock, accent: "Synced" },
  ];

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
              <h1 className="panel-headline mb-2 text-3xl font-bold font-poppins">Welcome back, Alex!</h1>
              <p className="panel-subtext">Here's what you've been creating</p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              {statCards.map((stat, idx) => (
                <div key={idx} className="glass-panel glass-panel-hover p-6">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <span className="panel-subtext text-sm">{stat.label}</span>
                      <div className="mt-1 text-[11px] font-orbitron tracking-[0.18em] text-primary/70">
                        {stat.accent}
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 shadow-[0_0_18px_rgba(255,45,45,0.2)]">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="panel-headline text-4xl font-bold font-poppins">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Saved Drafts Section */}
            {drafts.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="panel-headline flex items-center gap-2 text-xl font-bold font-poppins">
                    <Clock className="w-5 h-5 text-primary" />
                    Saved Drafts
                  </h2>
                  <div className="flex items-center gap-3">
                    {selectedDrafts.size > 0 && (
                      <>
                        <span className="text-sm panel-subtext">
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
                    <span className="text-sm panel-subtext">{drafts.length} drafts</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className={`glass-panel glass-panel-hover relative cursor-pointer p-4 ${
                        selectedDrafts.has(draft.id)
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                      onClick={() => handleToggleSelect(draft.id)}
                    >
                      {selectedDrafts.has(draft.id) && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {draft.imageData && (
                        <div className="preview-frame mb-3 h-32 overflow-hidden rounded-[18px]">
                          <img
                            src={draft.imageData}
                            alt={draft.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <h3 className="panel-headline truncate font-semibold font-poppins">{draft.title}</h3>
                        <p className="text-xs panel-subtext">
                          {draft.headline} • {draft.size}
                        </p>
                        <p className="text-xs panel-subtext">
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
                          className="icon-3d-button px-3 py-2 text-destructive hover:text-destructive"
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
              <h2 className="panel-headline mb-4 text-xl font-bold font-poppins">Recent Designs</h2>

              <div className="space-y-3">
                {recentDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="glass-panel glass-panel-hover flex cursor-pointer items-center justify-between gap-4 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/18 bg-primary/12 shadow-[0_0_16px_rgba(255,45,45,0.18)]">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="panel-headline font-semibold">{design.title}</p>
                        <p className="text-xs panel-subtext">
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
