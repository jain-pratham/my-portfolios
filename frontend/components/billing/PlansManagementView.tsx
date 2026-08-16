import React, { useState, useEffect, useCallback } from "react";
import { 
  Tag, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  TrendingUp, 
  Users, 
  Network,
  Eye,
  AlertTriangle,
  Sparkles,
  Shield,
  Flame,
  DollarSign,
  VideoOff,
  MessageSquare,
  Layers,
  Database
} from "lucide-react";

interface Plan {
  _id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxCameras: number;
  trialDays: number;
  status: "active" | "inactive";
  sortOrder: number;
  isPopular: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  totalSubscribers: number;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "demo";
  token?: string;
}

interface PlansManagementViewProps {
  apiUrl: string;
  user: IUser | null;
}

const AVAILABLE_AI_FEATURES = [
  { key: "intrusion_detection", label: "Intrusion Detection", desc: "Real-time human intrusion alerts in restricted security zones" },
  { key: "fire_smoke", label: "Fire & Smoke Alert", desc: "Safety-oriented detection of active flames and smoke plumes" },
  { key: "cash_counter", label: "Cash Counter Monitoring", desc: "Commercial safety logs and cashier transaction area auditing" },
  { key: "camera_offline", label: "Camera Status Monitor", desc: "Automated notifications when camera video stream goes offline" },
  { key: "whatsapp_alerts", label: "WhatsApp Alerts dispatch", desc: "Real-time video clip webhook dispatcher to WhatsApp accounts" }
];

export default function PlansManagementView({ apiUrl, user }: PlansManagementViewProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPlans: 0,
    activePlans: 0,
    inactivePlans: 0,
    totalSubscribers: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("sortOrder");
  const [sortOrder, setSortOrder] = useState("asc");

  // Dialog & Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  // Feedback feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMonthlyPrice, setFormMonthlyPrice] = useState(0);
  const [formYearlyPrice, setFormYearlyPrice] = useState(0);
  const [formMaxCameras, setFormMaxCameras] = useState(5);
  const [formTrialDays, setFormTrialDays] = useState(14);
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [isFreePlan, setIsFreePlan] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }

      // Fetch plans
      const plansRes = await fetch(
        `${apiUrl}/api/plans?search=${encodeURIComponent(search)}&status=${statusFilter}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        { headers }
      );
      const plansJson = await plansRes.json();
      if (plansJson.success) {
        setPlans(plansJson.data.plans);
      } else {
        setError(plansJson.message || "Failed to retrieve plans.");
      }

      // Fetch stats
      const statsRes = await fetch(`${apiUrl}/api/plans/stats`, { headers });
      const statsJson = await statsRes.json();
      if (statsJson.success) {
        setStats(statsJson.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend server. Make sure the API backend is running.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, search, statusFilter, sortBy, sortOrder, user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setFormName("");
    setFormDescription("");
    setFormMonthlyPrice(0);
    setFormYearlyPrice(0);
    setFormMaxCameras(5);
    setFormTrialDays(14);
    setFormStatus("active");
    setFormSortOrder(0);
    setFormIsPopular(false);
    setFormFeatures([]);
    setIsFreePlan(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormName(plan.name);
    setFormDescription(plan.description);
    setFormMonthlyPrice(plan.monthlyPrice);
    setFormYearlyPrice(plan.yearlyPrice);
    setFormMaxCameras(plan.maxCameras);
    setFormTrialDays(plan.trialDays);
    setFormStatus(plan.status);
    setFormSortOrder(plan.sortOrder);
    setFormIsPopular(plan.isPopular);
    setFormFeatures(plan.features || []);
    setIsFreePlan(plan.monthlyPrice === 0 && plan.yearlyPrice === 0);
    setIsFormOpen(true);
  };

  const handleToggleStatus = async (plan: Plan) => {
    try {
      const res = await fetch(`${apiUrl}/api/plans/${plan._id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      } else {
        showToast(data.message || "Failed to toggle status", "error");
      }
    } catch (err) {
      showToast("Error updating plan status", "error");
    }
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;
    try {
      const res = await fetch(`${apiUrl}/api/plans/${selectedPlan._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Plan deleted successfully");
        setIsDeleteOpen(false);
        fetchData();
      } else {
        showToast(data.message || "Failed to delete plan", "error");
      }
    } catch (err) {
      showToast("Error deleting plan", "error");
    }
  };

  const handleFeatureToggle = (featureKey: string) => {
    if (formFeatures.includes(featureKey)) {
      setFormFeatures(formFeatures.filter((f) => f !== featureKey));
    } else {
      setFormFeatures([...formFeatures, featureKey]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const bodyData = {
      name: formName,
      description: formDescription,
      monthlyPrice: isFreePlan ? 0 : Number(formMonthlyPrice),
      yearlyPrice: isFreePlan ? 0 : Number(formYearlyPrice),
      maxCameras: Number(formMaxCameras),
      trialDays: isFreePlan ? Number(formTrialDays) : 0,
      status: formStatus,
      sortOrder: Number(formSortOrder),
      isPopular: formIsPopular,
      features: formFeatures,
    };

    try {
      const url = selectedPlan ? `${apiUrl}/api/plans/${selectedPlan._id}` : `${apiUrl}/api/plans`;
      const method = selectedPlan ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (data.success) {
        showToast(selectedPlan ? "Plan updated successfully" : "Plan created successfully");
        setIsFormOpen(false);
        fetchData();
      } else {
        showToast(data.message || "Error submitting form", "error");
      }
    } catch (err) {
      showToast("Network error submitting form", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getFeatureIcon = (key: string) => {
    switch (key) {
      case "intrusion_detection":
        return <Shield className="h-3.5 w-3.5" />;
      case "fire_smoke":
        return <Flame className="h-3.5 w-3.5" />;
      case "cash_counter":
        return <DollarSign className="h-3.5 w-3.5" />;
      case "camera_offline":
        return <VideoOff className="h-3.5 w-3.5" />;
      case "whatsapp_alerts":
        return <MessageSquare className="h-3.5 w-3.5" />;
      default:
        return <Check className="h-3.5 w-3.5" />;
    }
  };

  const getFeatureLabel = (key: string) => {
    const feat = AVAILABLE_AI_FEATURES.find((f) => f.key === key);
    return feat ? feat.label : key;
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl transition-all duration-300 ${
          toast.type === "success" 
            ? "border-emerald-500/30 bg-emerald-950/80 text-emerald-300" 
            : "border-destructive/30 bg-red-950/80 text-red-300"
        }`}>
          <div className={`h-2 w-2 rounded-full ${toast.type === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Plans */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase font-mono">Total Plans</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tag className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{stats.totalPlans}</span>
            <span className="text-xs text-muted-foreground">tiers</span>
          </div>
        </div>

        {/* Active Plans */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase font-mono">Active Plans</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Check className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{stats.activePlans}</span>
            <span className="text-xs text-muted-foreground">live</span>
          </div>
        </div>

        {/* Inactive Plans */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase font-mono">Inactive Plans</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <X className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{stats.inactivePlans}</span>
            <span className="text-xs text-muted-foreground">hidden</span>
          </div>
        </div>

        {/* Total Subscribers */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold uppercase font-mono">Active Subscribers</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{stats.totalSubscribers}</span>
            <span className="text-xs text-muted-foreground">clients</span>
          </div>
        </div>
      </div>

      {/* Control Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4 border-b border-border">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="sortOrder">Sort Order</option>
            <option value="monthlyPrice">Monthly Price</option>
            <option value="yearlyPrice">Yearly Price</option>
            <option value="name">Plan Name</option>
            <option value="maxCameras">Max Cameras</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="flex h-10 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm text-foreground font-mono hover:text-primary hover:border-primary"
          >
            {sortOrder.toUpperCase()}
          </button>
        </div>

        {/* Create Plan Button */}
        <button
          onClick={handleOpenCreate}
          className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/10"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          {error}
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
          <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-base font-bold text-foreground">No plans found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Adjust search parameters or create a new plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan._id}
              className={`relative flex flex-col rounded-2xl border transition-all duration-300 bg-card ${
                plan.isPopular 
                  ? "border-primary shadow-lg shadow-primary/5" 
                  : "border-border hover:border-primary/40 shadow-sm"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              {/* Card Header */}
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    plan.status === "active" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-muted text-muted-foreground border border-border"
                  }`}>
                    {plan.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground min-h-[36px] line-clamp-2">{plan.description}</p>
                <div className="mt-4 flex items-baseline text-foreground">
                  {plan.monthlyPrice === 0 && plan.yearlyPrice === 0 ? (
                    <span className="text-2xl font-black text-primary">Free Trial</span>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-foreground">${plan.monthlyPrice}</span>
                      <span className="ml-1 text-xs text-muted-foreground font-normal">/mo</span>
                      <span className="ml-3 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono border border-border">
                        ${plan.yearlyPrice}/yr
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 py-4 flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <span>Camera Limit: <strong className="text-foreground">{plan.maxCameras} camera nodes</strong></span>
                  </div>
                  {plan.trialDays > 0 && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Eye className="h-4 w-4 text-primary shrink-0" />
                      <span>Trial Period: <strong className="text-foreground">{plan.trialDays} days</strong></span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border" />

                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase font-mono mb-2">Enabled AI Capabilities</div>
                  <ul className="space-y-2">
                    {plan.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/80">
                        <span className="text-primary mt-0.5 bg-primary/10 p-0.5 rounded shrink-0">
                          {getFeatureIcon(feature)}
                        </span>
                        <span className="line-clamp-2">{getFeatureLabel(feature)}</span>
                      </li>
                    ))}
                    {(!plan.features || plan.features.length === 0) && (
                      <li className="text-xs text-muted-foreground italic">No AI features enabled</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 mt-auto">
                <div className="flex gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => handleToggleStatus(plan)}
                    className={`flex-1 flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      plan.status === "active"
                        ? "border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10"
                        : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10"
                    }`}
                  >
                    {plan.status === "active" ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                    {plan.status === "active" ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground/75 hover:text-primary hover:border-primary transition-colors"
                    title="Edit Plan"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsDeleteOpen(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE & EDIT FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                {selectedPlan ? `Edit Subscription Plan: ${selectedPlan.name}` : "Create Subscription Plan"}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase font-mono mb-2">Billing Structure</label>
                <div className="flex gap-2 p-1 bg-muted border border-border rounded-lg w-fit">
                  <button 
                    type="button" 
                    onClick={() => setIsFreePlan(false)} 
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${!isFreePlan ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Paid Plan
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsFreePlan(true)} 
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${isFreePlan ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Free Trial
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Plan Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formName} 
                    onChange={(e) => setFormName(e.target.value)} 
                    placeholder="e.g. Standard AI"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" 
                  />
                </div>
                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formIsPopular} 
                      onChange={(e) => setFormIsPopular(e.target.checked)} 
                      className="h-4.5 w-4.5 rounded border-border accent-primary cursor-pointer" 
                    />
                    <span className="text-sm text-foreground/80 font-medium">Highlight as "Popular" badge</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Description</label>
                <textarea 
                  required 
                  rows={2} 
                  value={formDescription} 
                  onChange={(e) => setFormDescription(e.target.value)} 
                  placeholder="Explain what is included in this tier..."
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none resize-none" 
                />
              </div>

              {!isFreePlan && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Monthly Price ($)</label>
                    <input 
                      type="number" 
                      required 
                      min={0} 
                      value={formMonthlyPrice} 
                      onChange={(e) => setFormMonthlyPrice(Number(e.target.value))} 
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Yearly Price ($)</label>
                    <input 
                      type="number" 
                      required 
                      min={0} 
                      value={formYearlyPrice} 
                      onChange={(e) => setFormYearlyPrice(Number(e.target.value))} 
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" 
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Max Cameras</label>
                  <input 
                    type="number" 
                    required 
                    min={1} 
                    value={formMaxCameras} 
                    onChange={(e) => setFormMaxCameras(Number(e.target.value))} 
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" 
                  />
                </div>
              </div>

              <div className={`grid grid-cols-1 gap-4 ${isFreePlan ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                {isFreePlan && (
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Trial Period (Days)</label>
                    <input 
                      type="number" 
                      required 
                      min={0} 
                      value={formTrialDays} 
                      onChange={(e) => setFormTrialDays(Number(e.target.value))} 
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" 
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Sort Order</label>
                  <input 
                    type="number" 
                    required 
                    value={formSortOrder} 
                    onChange={(e) => setFormSortOrder(Number(e.target.value))} 
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Status</label>
                  <select 
                    value={formStatus} 
                    onChange={(e) => setFormStatus(e.target.value as "active" | "inactive")} 
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Checkbox Feature Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground uppercase font-mono">Enable AI Capabilities</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 p-4 border border-border bg-muted/30 rounded-xl max-h-[220px] overflow-y-auto">
                  {AVAILABLE_AI_FEATURES.map((feature) => (
                    <div 
                      key={feature.key} 
                      onClick={() => handleFeatureToggle(feature.key)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                        formFeatures.includes(feature.key)
                          ? "border-primary/40 bg-primary/5 text-foreground"
                          : "border-border hover:border-border/60 hover:bg-muted bg-background text-muted-foreground"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={formFeatures.includes(feature.key)}
                        onChange={() => {}} // Controlled via parent click container
                        className="h-4 w-4 mt-0.5 rounded border-border accent-primary cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <span className={`text-xs font-bold ${formFeatures.includes(feature.key) ? "text-foreground" : "text-foreground/80"}`}>
                          {feature.label}
                        </span>
                        <p className="text-[10px] leading-tight text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)} 
                  className="h-10 rounded-lg border border-border px-4 text-xs font-semibold text-foreground/80 hover:bg-muted"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-xs font-bold text-primary-foreground hover:opacity-95 disabled:opacity-50 transition-opacity"
                >
                  {submitting ? "Saving..." : selectedPlan ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {isDeleteOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Delete Subscription Plan?</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to delete <strong>"{selectedPlan.name}"</strong>? New client registrations for this tier will be blocked.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsDeleteOpen(false)} 
                className="h-10 rounded-lg border border-border px-4 text-xs font-semibold text-foreground/80 hover:bg-muted"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDeletePlan} 
                className="h-10 rounded-lg bg-red-500 px-6 text-xs font-bold text-white hover:opacity-90"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
