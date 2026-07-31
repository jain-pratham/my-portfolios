"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import {
  Shield,
  LogOut,
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  Mail,
  Phone,
  RefreshCw,
  Edit2,
  Loader2,
  Bell,
  Volume2,
  VolumeX,
  Eye,
  Check,
  Camera,
  Clock,
  AlertTriangle
} from "lucide-react";
import { apiClient } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface Lead {
  _id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: "new" | "contacted" | "proposal" | "won" | "lost";
  assignedTo?: User;
  notes?: string;
  createdAt: string;
}

interface SecurityEvent {
  _id: string;
  eventId?: string;
  cameraId: string;
  customerId: string;
  eventType: string;
  timestamp: string;
  confidence: number;
  personCount: number;
  snapshotPath: string;
  status: "unread" | "read";
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // New Lead Form State
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadStatus, setLeadStatus] = useState<"new" | "contacted" | "proposal" | "won" | "lost">("new");
  const [leadAssignedTo, setLeadAssignedTo] = useState("");
  const [leadNotes, setLeadNotes] = useState("");
  const [submittingLead, setSubmittingLead] = useState(false);

  // New Agent Form State
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPassword, setAgentPassword] = useState("");
  const [agentRole, setAgentRole] = useState<"admin" | "user">("user");
  const [submittingAgent, setSubmittingAgent] = useState(false);

  // CCTV Security States
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const [latestEvent, setLatestEvent] = useState<SecurityEvent | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [toastAlert, setToastAlert] = useState<SecurityEvent | null>(null);
  
  // Audio state ref to avoid closure issues with callback functions
  const isMutedRef = useRef(false);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Load user details & session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(userStr));
  }, [router]);

  // Synthesizes a clean double-beep alarm using browser native Web Audio API
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Tone 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.12);
      
      // Tone 2 (double beep)
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.12);
      }, 160);
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  };

  // Fetch security alerts history
  const fetchSecurityEvents = async () => {
    try {
      const res = await apiClient("/events");
      if (res.success && res.data) {
        // Map _id key safely
        const events = res.data.map((e: any) => ({ ...e, eventId: e._id }));
        setSecurityEvents(events);
        setUnreadCount(events.filter((e: SecurityEvent) => e.status === "unread").length);
        
        // Compute today's events count
        const todayStr = new Date().toDateString();
        const todayEvs = events.filter(
          (e: SecurityEvent) => new Date(e.timestamp).toDateString() === todayStr
        );
        setTodayCount(todayEvs.length);

        if (events.length > 0) {
          setLatestEvent(events[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load CCTV alerts history:", err);
    }
  };

  // Socket.IO hook
  useEffect(() => {
    if (!currentUser) return;

    // Fetch initial event history
    fetchSecurityEvents();

    const token = localStorage.getItem("token");
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    
    console.log("Connecting to Socket.IO Server:", socketUrl);
    const socket = io(socketUrl, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected. Secure room registered for user ID:", currentUser._id);
    });

    socket.on("new-security-event", (event: SecurityEvent) => {
      console.log("CCTV Security Alert received:", event);
      
      const newEvent = { ...event, eventId: event._id || event.eventId };
      
      // Prepend event
      setSecurityEvents((prev) => [newEvent, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setLatestEvent(newEvent);
      setTodayCount((prev) => prev + 1);

      // Play alert sound if not muted
      if (!isMutedRef.current) {
        playAlertSound();
      }

      // Show temporary screen toast notification
      setToastAlert(newEvent);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });

    return () => {
      socket.disconnect();
      console.log("Socket.IO connection cleaned up.");
    };
  }, [currentUser]);

  // Auto-dismiss toast alert after 6 seconds
  useEffect(() => {
    if (toastAlert) {
      const timer = setTimeout(() => {
        setToastAlert(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastAlert]);

  // Mark a single event as read
  const handleMarkRead = async (id: string) => {
    try {
      await apiClient(`/events/${id}/read`, { method: "PUT" });
      setSecurityEvents((prev) =>
        prev.map((e) => (e.eventId === id || e._id === id ? { ...e, status: "read" } : e))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  // Mark all unread events as read
  const handleMarkAllRead = async () => {
    try {
      await apiClient("/events/read-all", { method: "PUT" });
      setSecurityEvents((prev) => prev.map((e) => ({ ...e, status: "read" })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all alerts as read:", err);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Leads
      const leadsRes = await apiClient("/leads");
      setLeads(leadsRes.data);

      // Fetch Users if current logged-in user is admin
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.role === "admin") {
          const usersRes = await apiClient("/users");
          setAgents(usersRes.data);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Lead Status Updater
  const handleUpdateStatus = async (leadId: string, newStatus: "new" | "contacted" | "proposal" | "won" | "lost") => {
    try {
      await apiClient(`/leads/${leadId}`, {
        method: "PUT",
        body: { status: newStatus },
      });
      // Update local state
      setLeads(leads.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l)));
    } catch (err: any) {
      alert("Error updating lead status: " + err.message);
    }
  };

  // Lead Assignee Updater (Admin Only)
  const handleUpdateAssignee = async (leadId: string, userId: string) => {
    try {
      await apiClient(`/leads/${leadId}`, {
        method: "PUT",
        body: { assignedTo: userId || null },
      });
      fetchData(); // Reload to populate assignee details
    } catch (err: any) {
      alert("Error updating assignee: " + err.message);
    }
  };

  // Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName) return;

    setSubmittingLead(true);
    try {
      await apiClient("/leads", {
        method: "POST",
        body: {
          name: leadName,
          company: leadCompany,
          email: leadEmail,
          phone: leadPhone,
          status: leadStatus,
          assignedTo: leadAssignedTo || undefined,
          notes: leadNotes,
        },
      });

      // Reset Form & state
      setLeadName("");
      setLeadCompany("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadStatus("new");
      setLeadAssignedTo("");
      setLeadNotes("");
      setShowLeadModal(false);
      
      // Refresh list
      fetchData();
    } catch (err: any) {
      alert("Failed to create lead: " + err.message);
    } finally {
      setSubmittingLead(false);
    }
  };

  // Create Sales User / Agent (Admin Only)
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName || !agentEmail || !agentPassword) return;

    setSubmittingAgent(true);
    try {
      await apiClient("/users", {
        method: "POST",
        body: {
          name: agentName,
          email: agentEmail,
          password: agentPassword,
          role: agentRole,
        },
      });

      // Reset
      setAgentName("");
      setAgentEmail("");
      setAgentPassword("");
      setAgentRole("user");
      setShowAgentModal(false);

      // Refresh list
      fetchData();
    } catch (err: any) {
      alert("Failed to create user: " + err.message);
    } finally {
      setSubmittingAgent(false);
    }
  };

  // Delete Lead (Admin Only)
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await apiClient(`/leads/${leadId}`, {
        method: "DELETE",
      });
      setLeads(leads.filter((l) => l._id !== leadId));
    } catch (err: any) {
      alert("Failed to delete lead: " + err.message);
    }
  };

  // Delete User (Admin Only)
  const handleDeleteAgent = async (agentId: string) => {
    if (agentId === currentUser?._id) {
      alert("You cannot delete your own logged-in admin account!");
      return;
    }
    if (!confirm("Are you sure you want to delete this agent? Leads assigned to them will be unassigned.")) return;

    try {
      await apiClient(`/users/${agentId}`, {
        method: "DELETE",
      });
      setAgents(agents.filter((a) => a._id !== agentId));
      fetchData();
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    }
  };

  // Metrics Calculations
  const totalLeads = leads.length;
  const activeLeads = leads.filter((l) => l.status !== "won" && l.status !== "lost").length;
  const wonLeads = leads.filter((l) => l.status === "won").length;
  const lostLeads = leads.filter((l) => l.status === "lost").length;
  
  const conversionRate =
    wonLeads + lostLeads > 0 ? Math.round((wonLeads / (wonLeads + lostLeads)) * 100) : 0;

  // Filtered Leads Listing
  const filteredLeads = leads.filter((l) => {
    if (statusFilter === "all") return true;
    return l.status === statusFilter;
  });

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-10%] right-[5%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 p-[1px] shadow-lg shadow-indigo-500/10">
            <div className="flex items-center justify-center w-full h-full bg-zinc-950 rounded-xl">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              CoreWatch CRM
            </h1>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider block">
              AI Security Platform CRM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mute/Unmute Audio Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer relative"
            title={isMuted ? "Unmute Alarm Sound" : "Mute Alarm Sound"}
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5 text-red-400" /> : <Volume2 className="w-4.5 h-4.5 text-emerald-400" />}
          </button>

          {/* Notification Center Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer relative"
              title="CCTV Security Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-extrabold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Center Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 max-h-[480px] bg-zinc-950/95 backdrop-blur-md border border-zinc-800/90 shadow-2xl rounded-2xl p-4 flex flex-col gap-3 z-50 overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Security Alerts
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto space-y-2 flex-1 max-h-[360px] pr-1">
                  {securityEvents.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600 flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-zinc-800" />
                      <p className="text-xs">No camera events reported</p>
                    </div>
                  ) : (
                    securityEvents.slice(0, 30).map((event) => (
                      <div
                        key={event.eventId || event._id}
                        className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                          event.status === "unread"
                            ? "bg-red-950/10 border-red-900/40 hover:bg-red-950/20"
                            : "bg-zinc-900/30 border-zinc-800/80 hover:bg-zinc-900/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="relative flex h-1.5 w-1.5">
                              {event.status === "unread" && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              )}
                              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${event.status === "unread" ? "bg-red-500" : "bg-zinc-600"}`}></span>
                            </span>
                            <span className="text-xs font-bold text-white capitalize">
                              {event.eventType.replace("_", " ")}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-[11px] text-zinc-400 space-y-0.5">
                          <p>Camera: <span className="text-zinc-300 font-medium">{event.cameraId}</span></p>
                          <p>Confidence: <span className="text-zinc-300 font-medium">{Math.round(event.confidence * 100)}%</span></p>
                        </div>

                        <div className="flex items-center justify-between border-t border-zinc-900 pt-2 mt-1">
                          <button
                            onClick={() => setSelectedSnapshot(`http://localhost:5000${event.snapshotPath}`)}
                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            View Snapshot
                          </button>
                          {event.status === "unread" && (
                            <button
                              onClick={() => handleMarkRead(event.eventId || event._id)}
                              className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold text-sm">
              {currentUser.name[0].toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-zinc-300">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentUser.role === "admin" ? "bg-violet-500" : "bg-emerald-500"
                  }`}
                />
                <span className="text-[10px] text-zinc-500 font-medium capitalize">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-red-950/60 hover:bg-red-950/10 text-zinc-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6 z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total Leads</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {loading ? "..." : totalLeads}
              </h3>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Active Pipeline</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {loading ? "..." : activeLeads}
              </h3>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-indigo-400 rounded-xl">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Closed Won</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
                {loading ? "..." : wonLeads}
              </h3>
            </div>
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Win Rate</p>
              <h3 className="text-3xl font-extrabold text-violet-400 mt-1">
                {loading ? "..." : `${conversionRate}%`}
              </h3>
            </div>
            <div className="p-3 bg-violet-950/20 border border-violet-900/60 text-violet-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Real-time Toast Alert Overlay (Top Right) */}
        {toastAlert && (
          <div className="fixed top-20 right-6 z-50 max-w-sm w-full bg-zinc-950/95 border-2 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.2)] rounded-2xl p-4 animate-slide-in backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">🚨 Person Detected</span>
              </div>
              <button
                onClick={() => setToastAlert(null)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-3 text-xs text-zinc-400 space-y-1">
              <p>Camera: <span className="text-white font-bold">{toastAlert.cameraId}</span></p>
              <p>Time: <span className="text-white font-bold">{new Date(toastAlert.timestamp).toLocaleTimeString()}</span></p>
              <p>Confidence: <span className="text-white font-bold">{Math.round(toastAlert.confidence * 100)}%</span></p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setSelectedSnapshot(`http://localhost:5000${toastAlert.snapshotPath}`);
                  setToastAlert(null);
                }}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-center text-[10px] font-bold uppercase tracking-wider text-white rounded-lg transition-colors cursor-pointer"
              >
                View Snapshot
              </button>
              <button
                onClick={() => {
                  handleMarkRead(toastAlert.eventId || toastAlert._id);
                  setToastAlert(null);
                }}
                className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-300 rounded-lg transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* CCTV Security Monitoring Dashboard Hub */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-6 items-stretch justify-between relative z-10">
            {/* Left: CCTV Details & Status */}
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    CCTV Guard Monitoring Active
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-tight mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                  Live Security Console
                </h2>
                <p className="text-xs text-zinc-500 mt-1 leading-normal max-w-md">
                  CoreWatch AI Service feeds are streaming. Persons detected in protected camera zones are logged instantly with file snapshot records.
                </p>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 gap-4 my-2">
                <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Today's CCTV Alerts</p>
                  <h4 className="text-2xl font-black text-red-500 mt-1 animate-pulse">{todayCount}</h4>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-2xl">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Stream Count</p>
                  <h4 className="text-2xl font-black text-indigo-400 mt-1">1 Camera</h4>
                </div>
              </div>

              {/* Latest Alert Summary */}
              {latestEvent ? (
                <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Latest Zone Intrusion</p>
                    <p className="text-xs font-semibold text-white">Camera: {latestEvent.cameraId}</p>
                    <p className="text-[10px] text-zinc-500">
                      Time: {new Date(latestEvent.timestamp).toLocaleTimeString()} (Confidence: {Math.round(latestEvent.confidence * 100)}%)
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSnapshot(`http://localhost:5000${latestEvent.snapshotPath}`)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    View Snapshot
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl text-center text-xs text-zinc-600">
                  No intrusions detected today. Zone is secure.
                </div>
              )}
            </div>

            {/* Right: Live Monitor Screen Frame */}
            <div className="flex-1 max-w-sm w-full mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl relative min-h-[220px]">
              {latestEvent ? (
                <>
                  <div className="relative flex-1 group overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={`http://localhost:5000${latestEvent.snapshotPath}`}
                      alt="Latest Intruder Alert"
                      className="object-cover w-full h-full max-h-[190px] transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-[9px] font-black uppercase tracking-wider text-white rounded flex items-center gap-1 shadow-md">
                      <Camera className="w-2.5 h-2.5 animate-pulse" />
                      INTRUDER CAPTURE
                    </span>
                    
                    <span className="absolute bottom-3 right-3 text-[10px] text-zinc-300 font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {new Date(latestEvent.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-950 border-t border-zinc-900 flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Latest Snapshot Frame</span>
                    <button
                      onClick={() => setSelectedSnapshot(`http://localhost:5000${latestEvent.snapshotPath}`)}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest cursor-pointer"
                    >
                      Expand View
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center text-zinc-700 bg-zinc-950/20">
                  <Camera className="w-10 h-10 text-zinc-800" />
                  <div>
                    <h5 className="text-xs font-bold text-zinc-500">Video Feed Standby</h5>
                    <p className="text-[10px] text-zinc-600 mt-0.5">Awaiting active detections to capture snapshots</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Snapshot Expanded Modal Viewer */}
        {selectedSnapshot && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-3xl w-full flex flex-col gap-4 relative">
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="absolute -top-10 right-0 p-2 text-white hover:text-zinc-300 text-sm font-bold bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer"
                title="Close"
              >
                Close (✕)
              </button>
              
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-2">
                <img
                  src={selectedSnapshot}
                  alt="Security Intrusion Snapshot Enlarged"
                  className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Panel / Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-4">
          {/* Status Pipeline Filter Badges */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {["all", "new", "contacted", "proposal", "won", "lost"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* New Lead / Agent Addition Actions */}
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {currentUser.role === "admin" && (
              <button
                onClick={() => setShowAgentModal(true)}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Add Agent
              </button>
            )}
            <button
              onClick={() => setShowLeadModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-xs font-semibold text-white shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Dashboard Grid (CRM Board on Left, Agents panel on Right) */}
        <div className={`grid grid-cols-1 ${currentUser.role === "admin" ? "lg:grid-cols-3" : ""} gap-6`}>
          
          {/* CRM Leads List */}
          <div className={`${currentUser.role === "admin" ? "lg:col-span-2" : ""} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-zinc-400" />
                Lead Management Board
              </h2>
              <button
                onClick={fetchData}
                className="p-2 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors cursor-pointer"
                title="Refresh leads"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-12 text-center flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-zinc-600 animate-spin" />
                <span className="text-xs text-zinc-500">Retrieving CRM leads...</span>
              </div>
            ) : error ? (
              <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="text-sm font-semibold text-red-400">Failed to load leads</h3>
                  <p className="text-xs text-red-600/80 mt-1">{error}</p>
                </div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-800 rounded-xl text-xs font-semibold text-red-200 transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-10 h-10 text-zinc-700" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400">No leads found</h3>
                  <p className="text-xs text-zinc-600 mt-1">
                    Try changing the filters or create a new lead to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all flex flex-col justify-between gap-4"
                  >
                    
                    {/* Top Segment */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-white leading-snug">{lead.name}</h4>
                          {lead.company && (
                            <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                              <Building className="w-3 h-3 text-zinc-500" />
                              {lead.company}
                            </div>
                          )}
                        </div>
                        
                        {/* Status Badge Select Dropdown */}
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead._id, e.target.value as any)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-zinc-900 border outline-none cursor-pointer transition-colors ${
                            lead.status === "won"
                              ? "border-emerald-800/60 text-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/20"
                              : lead.status === "lost"
                              ? "border-rose-800/60 text-rose-400 bg-rose-950/10 hover:bg-rose-950/20"
                              : lead.status === "proposal"
                              ? "border-amber-800/60 text-amber-400 bg-amber-950/10 hover:bg-amber-950/20"
                              : lead.status === "contacted"
                              ? "border-indigo-800/60 text-indigo-400 bg-indigo-950/10 hover:bg-indigo-950/20"
                              : "border-zinc-700 text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="proposal">Proposal</option>
                          <option value="won">Won (Deal Hired)</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-3.5 space-y-1 text-xs text-zinc-500">
                        {lead.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-zinc-600" />
                            <a href={`mailto:${lead.email}`} className="hover:text-zinc-300 underline underline-offset-2">
                              {lead.email}
                            </a>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-zinc-600" />
                            <a href={`tel:${lead.phone}`} className="hover:text-zinc-300">
                              {lead.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Notes / Event Description */}
                      {lead.notes && (
                        <p className="mt-3 text-xs bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-900 text-zinc-400 italic font-serif leading-normal">
                          &ldquo;{lead.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Bottom segment: Assignee & Action Buttons */}
                    <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
                        {currentUser.role === "admin" ? (
                          <select
                            value={lead.assignedTo?._id || ""}
                            onChange={(e) => handleUpdateAssignee(lead._id, e.target.value)}
                            className="bg-zinc-950/60 border border-zinc-800 rounded-md px-1.5 py-0.5 text-zinc-400 outline-none text-[11px]"
                          >
                            <option value="">Unassigned</option>
                            {agents.map((agent) => (
                              <option key={agent._id} value={agent._id}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-[11px] text-zinc-500 font-medium">
                            {lead.assignedTo ? lead.assignedTo.name : "Unassigned"}
                          </span>
                        )}
                      </div>

                      {currentUser.role === "admin" && (
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="p-1.5 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-600 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Agent Panel */}
          {currentUser.role === "admin" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-zinc-400" />
                Sales Agents / Team
              </h2>

              <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                {agents.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center">No sales agent accounts found.</p>
                ) : (
                  <div className="space-y-3">
                    {agents.map((agent) => {
                      // Count leads assigned to this user
                      const agentLeads = leads.filter((l) => l.assignedTo?._id === agent._id).length;
                      const agentWon = leads.filter((l) => l.assignedTo?._id === agent._id && l.status === "won").length;

                      return (
                        <div
                          key={agent._id}
                          className="flex items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl"
                        >
                          <div>
                            <p className="text-xs font-semibold text-white">{agent.name}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{agent.email}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/20 border border-indigo-900/50 px-1 rounded">
                                {agentLeads} Leads
                              </span>
                              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/20 border border-emerald-900/50 px-1 rounded">
                                {agentWon} Won
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteAgent(agent._id)}
                            disabled={agent._id === currentUser?._id}
                            className={`p-1.5 border border-transparent rounded-lg transition-colors ${
                              agent._id === currentUser?._id
                                ? "text-zinc-700 cursor-not-allowed"
                                : "hover:bg-zinc-950 hover:border-zinc-800 text-zinc-500 hover:text-red-400 cursor-pointer"
                            }`}
                            title="Delete Agent"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- ADD LEAD MODAL --- */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-4">Add CRM Lead Details</h3>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lead Name *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Alice Smith"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Company</label>
                <input
                  type="text"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  placeholder="e.g. Retail Shop"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="alice@mail.com"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Phone</label>
                  <input
                    type="text"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+1234567"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lead Status</label>
                <select
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="proposal">Proposal</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {currentUser.role === "admin" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Assign To Agent</label>
                  <select
                    value={leadAssignedTo}
                    onChange={(e) => setLeadAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none"
                  >
                    <option value="">Select Agent (Optional)</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lead Notes</label>
                <textarea
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Additional inquiry specifics..."
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLead}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  {submittingLead ? "Adding..." : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD AGENT MODAL (ADMIN ONLY) --- */}
      {showAgentModal && currentUser.role === "admin" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-4">Add Sales Agent Account</h3>
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Agent Name *</label>
                <input
                  type="text"
                  required
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. John Agent"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  value={agentEmail}
                  onChange={(e) => setAgentEmail(e.target.value)}
                  placeholder="agent@company.com"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Password *</label>
                <input
                  type="password"
                  required
                  value={agentPassword}
                  onChange={(e) => setAgentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">System Role</label>
                <select
                  value={agentRole}
                  onChange={(e) => setAgentRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 outline-none"
                >
                  <option value="user">Sales User</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAgentModal(false)}
                  className="px-4 py-2 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAgent}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  {submittingAgent ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
