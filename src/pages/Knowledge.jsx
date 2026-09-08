import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingScreen from "../components/LoadingScreen";
import {
  getRAGHealth,
  getRAGStats,
  getKnowledgeDocuments,
  getKnowledgeDocumentDetails,
  searchKnowledge,
  buildRAGContext,
  triggerIngestion,
  resetVectorIndex,
} from "../services/ragApi";
import {
  BookOpen,
  Search,
  Filter,
  Layers,
  Database,
  Sparkles,
  RefreshCw,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Cpu,
  Trash2,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Info,
  Zap,
  Server,
  Code,
  Check,
} from "lucide-react";

const CATEGORIES = ["All", "energy", "water", "waste", "transportation", "food"];

const QUICK_QUERIES = [
  "HVAC energy optimization & solar integration",
  "Campus water recycling and rainwater harvesting",
  "Zero-waste dining and organic composting",
  "EV charging infrastructure & active transit",
  "Green building LEED standards for university campus",
];

const Knowledge = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // View state: 'search' | 'library' | 'context'
  const [activeTab, setActiveTab] = useState("search");

  // RAG system health and stats
  const [ragStats, setRagStats] = useState(null);
  const [ragHealth, setRagHealth] = useState(null);
  const [systemLoading, setSystemLoading] = useState(true);
  const [systemError, setSystemError] = useState(null);

  // Search state
  const [queryInput, setQueryInput] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [topK, setTopK] = useState(5);
  const [threshold, setThreshold] = useState(0.1);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Document Library state
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [docDetails, setDocDetails] = useState(null);

  // Context builder sandbox state
  const [contextPayload, setContextPayload] = useState(null);
  const [buildingContext, setBuildingContext] = useState(false);
  const [copiedContext, setCopiedContext] = useState(false);

  // Ingestion status toast
  const [actionMessage, setActionMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Initialize and load RAG metadata
  const fetchRAGMetadata = async () => {
    setSystemLoading(true);
    setSystemError(null);
    try {
      const [healthData, statsData] = await Promise.all([
        getRAGHealth().catch(() => null),
        getRAGStats().catch(() => null),
      ]);
      setRagHealth(healthData);
      setRagStats(statsData);

      if (!healthData?.status || !statsData?.status) {
        setSystemError("Knowledge Base service is currently unreachable. Please check backend server.");
      }
    } catch (err) {
      console.error("Error loading RAG metadata:", err);
      setSystemError("Failed to connect to RAG knowledge backend.");
    } finally {
      setSystemLoading(false);
    }
  };

  // Load knowledge documents list
  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await getKnowledgeDocuments();
      setDocuments(res.documents || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchRAGMetadata();
  }, []);

  useEffect(() => {
    if (activeTab === "library") {
      loadDocuments();
    }
  }, [activeTab]);

  // Execute Search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!queryInput.trim()) return;

    setSearching(true);
    setActionMessage(null);
    try {
      const catFilter = selectedCategory === "All" ? null : selectedCategory;
      const res = await searchKnowledge({
        query: queryInput.trim(),
        top_k: parseInt(topK),
        category: catFilter,
        threshold: parseFloat(threshold),
      });
      setSearchResults(res);
    } catch (err) {
      console.error("Search failed:", err);
      setActionMessage({ type: "error", text: "Search failed: " + err.message });
    } finally {
      setSearching(false);
    }
  };

  // Trigger search on initial query parameter from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setQueryInput(searchFromUrl);
      const catFromUrl = searchParams.get("category");
      if (catFromUrl) setSelectedCategory(catFromUrl);
      handleSearch();
    }
  }, []);

  // View document details
  const handleSelectDocument = async (docId) => {
    setSelectedDocId(docId);
    setDocDetails(null);
    try {
      const details = await getKnowledgeDocumentDetails(docId);
      setDocDetails(details);
    } catch (err) {
      console.error("Failed to get document details:", err);
    }
  };

  // Re-ingest Seed Data
  const handleIngestSeedData = async () => {
    setActionLoading(true);
    setActionMessage({ type: "info", text: "Ingesting seed sustainability documents into vector store..." });
    try {
      const res = await triggerIngestion();
      setActionMessage({ type: "success", text: res.message || "Seed ingestion completed!" });
      await fetchRAGMetadata();
      if (activeTab === "library") loadDocuments();
    } catch (err) {
      setActionMessage({ type: "error", text: "Ingestion failed: " + err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Vector Index
  const handleResetIndex = async () => {
    if (!window.confirm("Are you sure you want to clear the vector index? All stored document vectors will be deleted.")) return;
    setActionLoading(true);
    try {
      await resetVectorIndex();
      setActionMessage({ type: "success", text: "Vector index cleared." });
      setSearchResults(null);
      setDocuments([]);
      await fetchRAGMetadata();
    } catch (err) {
      setActionMessage({ type: "error", text: "Reset failed: " + err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Build RAG Context JSON
  const handleBuildGroundingContext = async (queryText) => {
    setBuildingContext(true);
    try {
      const res = await buildRAGContext({ query: queryText || queryInput || "Campus sustainability guidelines", top_k: 3 });
      setContextPayload(res);
      setActiveTab("context");
    } catch (err) {
      setActionMessage({ type: "error", text: "Failed to build RAG context: " + err.message });
    } finally {
      setBuildingContext(false);
    }
  };

  if (authLoading || systemLoading) {
    return <LoadingScreen label="Loading Sustainability Knowledge Base..." />;
  }

  return (
    <div className="min-h-screen bg-eco-bg flex flex-col font-sans">
      <Navbar toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      <div className="flex-1 flex w-full max-w-[1550px] mx-auto px-4 sm:px-8 py-6">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />


        <main className="flex-1 min-w-0 md:pl-6 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Subtle overlay elements */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sustainability Knowledge Base</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Sustainability Knowledge Base
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Explore verified university sustainability standards, LEED guidelines, energy efficiency playbooks, and waste management policies.
                </p>
              </div>

              {/* RAG Engine Status Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 text-xs space-y-2 w-full lg:w-72 shrink-0">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-slate-300 flex items-center">
                    <Cpu className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    Knowledge Engine
                  </span>
                  <span className="font-bold text-emerald-400 truncate max-w-[140px]">
                    Semantic Search Active
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Indexed Knowledge:</span>
                  <span className="font-semibold text-white">{ragStats?.total_chunks || 0} Topics</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Total Documents:</span>
                  <span className="font-semibold text-white">{ragStats?.total_documents || 0} Docs</span>
                </div>

                <div className="flex justify-between text-slate-300 pt-1 border-t border-white/10">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                    Active Retrieval
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Search verified sustainability guidelines and standards.</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleIngestSeedData}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? "animate-spin" : ""}`} />
                  <span>Re-ingest Seed Data</span>
                </button>

                <button
                  onClick={handleResetIndex}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 border border-slate-700 text-slate-300 hover:text-white font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reset Index</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Feedback Banner */}
          {actionMessage && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
                actionMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : actionMessage.type === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-sky-50 border-sky-200 text-sky-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{actionMessage.text}</span>
              </div>
              <button
                onClick={() => setActionMessage(null)}
                className="text-slate-400 hover:text-slate-600 font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tab Navigation Switcher */}
          <div className="flex border-b border-slate-200 space-x-8 text-sm font-medium">
            <button
              onClick={() => setActiveTab("search")}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === "search"
                  ? "border-emerald-600 text-emerald-700 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Knowledge Search</span>
            </button>

            <button
              onClick={() => setActiveTab("library")}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === "library"
                  ? "border-emerald-600 text-emerald-700 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Document Library ({ragStats?.total_documents || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("context")}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === "context"
                  ? "border-emerald-600 text-emerald-700 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Evidence Context Builder</span>
            </button>
          </div>

          {/* TAB 1: SEMANTIC VECTOR SEARCH */}
          {activeTab === "search" && (
            <div className="space-y-6">
              
              {/* Search Form */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      placeholder="Ask a sustainability question or enter keywords (e.g. HVAC optimization, food waste composting...)"
                      className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={searching || !queryInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
                    >
                      {searching ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                      <span>Search</span>
                    </button>
                  </div>

                  {/* Filter Controls Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
                    
                    {/* Category Filter Pills */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1">Category:</span>
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                            selectedCategory === cat
                              ? "bg-emerald-600 text-white shadow-xs font-bold"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Top K & Relevance Threshold controls */}
                    <div className="flex items-center space-x-4 text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-medium">Top Results:</span>
                        <select
                          value={topK}
                          onChange={(e) => setTopK(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-emerald-500"
                        >
                          <option value="3">3</option>
                          <option value="5">5</option>
                          <option value="8">8</option>
                          <option value="10">10</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-medium">Min Score:</span>
                        <select
                          value={threshold}
                          onChange={(e) => setThreshold(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-emerald-500"
                        >
                          <option value="0.0">0.0 (All)</option>
                          <option value="0.1">0.1 (Broad)</option>
                          <option value="0.2">0.2 (Relevant)</option>
                          <option value="0.3">0.3 (Strict)</option>
                        </select>
                      </div>
                    </div>

                  </div>
                </form>

                {/* Quick Prompts */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Quick Exploration Queries:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_QUERIES.map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQueryInput(qp);
                          handleSearch();
                        }}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                      >
                        <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{qp}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* SEARCH RESULTS SECTION */}
              {searchResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-bold text-slate-900">
                        Search Results for "{searchResults.query}"
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                        {searchResults.result_count || 0} Matches
                      </span>
                    </div>

                    <button
                      onClick={() => handleBuildGroundingContext(searchResults.query)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <Code className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Export RAG Context Payload</span>
                    </button>
                  </div>

                  {searchResults.results?.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
                      <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                      <p className="font-semibold text-slate-800 text-sm">No relevant sustainability chunks found</p>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Try lowering the minimum similarity threshold or re-wording your query keywords.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.results.map((res) => (
                        <div
                          key={res.chunk_id}
                          className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3 transition-all hover:border-emerald-300"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-black rounded-lg">
                                #{res.rank}
                              </span>
                              <h3 className="text-base font-bold text-slate-900">{res.title}</h3>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                                {res.category} / {res.topic}
                              </span>

                              <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
                                <span>Score: {(res.score * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Extracted Chunk Content */}
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                            {res.text}
                          </div>

                          {/* Source Metadata & Links */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 text-slate-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center text-slate-700 font-medium">
                                <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                Source: {res.source}
                              </span>

                              {res.url && res.url !== "#" && (
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:underline flex items-center font-semibold"
                                >
                                  <span>View Source Standard</span>
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-400">
                              <span>Doc ID: {res.document_id}</span>
                              <span>•</span>
                              <span>Chunk: {res.chunk_id}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: DOCUMENT LIBRARY */}
          {activeTab === "library" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Ingested Document Catalog</h2>
                  <p className="text-xs text-slate-500">
                    Full document repository indexed in the local knowledge base for sustainability reference.
                  </p>
                </div>

                <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg">
                  {documents.length} Seed Documents
                </span>
              </div>

              {loadingDocs ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                  <span>Loading document library...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => handleSelectDocument(doc.id)}
                      className={`p-5 rounded-2xl border bg-white shadow-xs cursor-pointer transition-all hover:shadow-md space-y-3 ${
                        selectedDocId === doc.id ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                          {doc.category}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400">
                          {doc.chunk_count} Chunks
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                        {doc.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-sans line-clamp-2">
                        Topic: <span className="text-slate-700 capitalize font-medium">{doc.topic}</span>
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <span className="truncate max-w-[160px]">{doc.source?.name || "Standard Doc"}</span>
                        <span className="text-emerald-600 font-semibold flex items-center">
                          View Details <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Document Details Modal / Expanded Drawer */}
              {docDetails && (
                <div className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {docDetails.document.category} / {docDetails.document.topic}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900">{docDetails.document.title}</h2>
                    </div>

                    <button
                      onClick={() => setDocDetails(null)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600"
                    >
                      Close Details
                    </button>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong>Source:</strong> {docDetails.document.source?.name} ({docDetails.document.source?.url})</p>
                    <p><strong>Total Vector Chunks Generated:</strong> {docDetails.chunk_count}</p>
                  </div>

                  {/* Chunks preview */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Generated Vector Chunks:
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {docDetails.chunks.map((chk, i) => (
                        <div key={chk.chunk_id || i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>Chunk Index #{chk.chunk_index}</span>
                            <span>{chk.chunk_id}</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed font-sans">{chk.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: RAG GROUNDING SANDBOX */}
          {activeTab === "context" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Evidence Context Builder</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Build formatted context payloads ready for evidence-based decision support.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleBuildGroundingContext()}
                  disabled={buildingContext}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-4 h-4 ${buildingContext ? "animate-spin" : ""}`} />
                  <span>Build Context from Query</span>
                </button>
              </div>

              {contextPayload && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      RAG Context Payload for Query: "{contextPayload.query}"
                    </span>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(contextPayload, null, 2));
                        setCopiedContext(true);
                        setTimeout(() => setCopiedContext(false), 2000);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      {copiedContext ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code className="w-3.5 h-3.5" />}
                      <span>{copiedContext ? "Copied JSON!" : "Copy JSON"}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
                    {JSON.stringify(contextPayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Knowledge;
