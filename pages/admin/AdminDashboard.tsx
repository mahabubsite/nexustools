import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, doc, setDoc, updateDoc, query, orderBy, deleteDoc, addDoc, serverTimestamp, getDoc, limit, onSnapshot } from 'firebase/firestore';
import { TOOLS } from '../../data/tools';
import { 
  LayoutDashboard, Users, Wrench, CreditCard, Search, Check, X, Settings, 
  RefreshCw, LogOut, Download, Edit2, Trash2, FileText, Save, Globe, DollarSign,
  MessageSquare, Plus, ExternalLink, Image as ImageIcon, Twitter, Github, Linkedin, Facebook,
  Flag, Eye, MailOpen, Mail, BarChart3, TrendingUp
} from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { User, PaymentRequest, SiteConfig, ToolMetadata, BlogPost, ContactMessage, SocialLink, ToolCategory, UserReport } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

// CSV Download Utility
const downloadCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'users' | 'payments' | 'settings' | 'blog' | 'messages' | 'reports'>('dashboard');
  
  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [tools, setTools] = useState<ToolMetadata[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalViews, setTotalViews] = useState(0);
  
  // Config State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
      footerText: '© 2024 Nexus Tools Inc. All rights reserved.',
      contactEmail: 'support@nexustools.com',
      socials: [],
      pages: { about: '', privacy: '', terms: '', roadmap: '' },
      pricing: { goldenMonthly: '4.99', goldenYearly: '49.99' }
  });

  // Modal States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  
  const [selectedTool, setSelectedTool] = useState<ToolMetadata | null>(null);
  const [isEditToolOpen, setIsEditToolOpen] = useState(false);
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);

  // New Modal State for Messages
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewMessageOpen, setIsViewMessageOpen] = useState(false);

  // Chart Data State
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [planDistributionData, setPlanDistributionData] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
    fetchConfig();

    // Live Views Listener with Error Handling
    const unsubViews = onSnapshot(
        doc(db, 'stats', 'general'), 
        (snapshot) => {
            if (snapshot.exists()) {
                setTotalViews(snapshot.data().totalViews || 0);
            }
        },
        (error) => {
            console.warn("View stats listener error:", error);
        }
    );

    return () => unsubViews();
  }, [isAdmin]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
        // Users
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() } as User));
        setUsers(usersData);
        prepareChartData(usersData);

        // Payments
        const paymentsSnap = await getDocs(query(collection(db, 'manual_payments'), orderBy('createdAt', 'desc')));
        setPayments(paymentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRequest)));

        // Tools (Merge static with dynamic config)
        const toolStatusSnap = await getDocs(collection(db, 'tools_status'));
        const toolOverrides = new Map<string, any>();
        toolStatusSnap.docs.forEach(doc => {
            toolOverrides.set(doc.id, doc.data());
        });
        
        let mergedTools = TOOLS.map(tool => ({
            ...tool,
            ...(toolOverrides.get(tool.id) || { enabled: true }) // Default to enabled if no config
        }));

        // Add dynamically created tools (that don't exist in code but exist in DB)
        toolStatusSnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.isNew) {
                mergedTools.push({ id: doc.id, slug: doc.id, ...data } as ToolMetadata);
            }
        });
        setTools(mergedTools);

        // Blog Posts
        const postsSnap = await getDocs(query(collection(db, 'posts'), orderBy('date', 'desc')));
        setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)));

        // Messages
        const msgsSnap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc')));
        setMessages(msgsSnap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage)));

        // Reports
        const reportsSnap = await getDocs(query(collection(db, 'reports'), orderBy('createdAt', 'desc')));
        setReports(reportsSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserReport)));

    } catch (e: any) {
        // Suppress permission errors
        if (e?.code !== 'permission-denied' && !e?.message?.includes('Missing or insufficient permissions')) {
            console.error("Fetch Error", e);
        }
    } finally {
        setDataLoading(false);
    }
  };

  const prepareChartData = (users: User[]) => {
      // 1. User Growth (Group by Join Date)
      const growthMap: Record<string, number> = {};
      users.forEach(u => {
          if (u.memberSince) {
              const date = new Date(u.memberSince).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              growthMap[date] = (growthMap[date] || 0) + 1;
          }
      });
      // Sort by date (simple approximation for demo)
      const growthData = Object.keys(growthMap).map(date => ({ name: date, users: growthMap[date] })).slice(-7); // Last 7 days present
      setUserGrowthData(growthData);

      // 2. Plan Distribution
      const planMap: Record<string, number> = { free: 0, golden: 0, custom: 0 };
      users.forEach(u => {
          if (u.plan) planMap[u.plan] = (planMap[u.plan] || 0) + 1;
      });
      setPlanDistributionData([
          { name: 'Free', value: planMap.free, color: '#94a3b8' },
          { name: 'Golden', value: planMap.golden, color: '#eab308' },
          { name: 'Custom', value: planMap.custom, color: '#2563EB' }
      ]);
  };

  const fetchConfig = async () => {
      try {
          const docRef = doc(db, 'config', 'general');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
              const data = snap.data();
              // Safely merge with default config to ensure all fields exist
              setSiteConfig(prev => ({ 
                  ...prev, 
                  ...data,
                  // Explicitly ensure socials is an array if it comes from DB
                  socials: Array.isArray(data.socials) ? data.socials : prev.socials
              }));
          }
      } catch (e) { console.error(e); }
  };

  // --- Logic Handlers ---

  const handleToolToggle = async (tool: ToolMetadata) => {
      const newStatus = !tool.enabled;
      try {
          await setDoc(doc(db, 'tools_status', tool.id), { enabled: newStatus }, { merge: true });
          setTools(prev => prev.map(t => t.id === tool.id ? { ...t, enabled: newStatus } : t));
      } catch(e) { alert('Failed to update tool'); }
  };

  const handleSaveTool = async () => {
      if(!selectedTool) return;
      try {
          // If adding new, we mark it. For existing, we update metadata.
          const dataToSave = {
              name: selectedTool.name,
              description: selectedTool.description,
              category: selectedTool.category,
              popular: selectedTool.popular || false,
              enabled: selectedTool.enabled !== false,
              isNew: selectedTool.isNew || false,
              slug: selectedTool.slug
          };
          await setDoc(doc(db, 'tools_status', selectedTool.id), dataToSave, { merge: true });
          fetchData(); // Refresh list
          setIsEditToolOpen(false);
          setIsAddToolOpen(false);
      } catch(e) { alert('Failed to save tool'); }
  };

  const handleSavePost = async () => {
      if(!selectedPost) return;
      try {
          if (selectedPost.id) {
              await updateDoc(doc(db, 'posts', selectedPost.id), { ...selectedPost });
          } else {
              await addDoc(collection(db, 'posts'), { ...selectedPost, date: new Date().toISOString() });
          }
          fetchData();
          setIsEditPostOpen(false);
      } catch(e) { alert('Failed to save post'); }
  };

  const handleDeletePost = async (id: string) => {
      if(!confirm('Delete this post?')) return;
      await deleteDoc(doc(db, 'posts', id));
      setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
      const newSocials = [...siteConfig.socials];
      newSocials[index] = { ...newSocials[index], [field]: value };
      setSiteConfig({ ...siteConfig, socials: newSocials });
  };

  const addSocial = () => {
      setSiteConfig({ ...siteConfig, socials: [...siteConfig.socials, { platform: 'twitter', url: '' }] });
  };

  const removeSocial = (index: number) => {
      const newSocials = siteConfig.socials.filter((_, i) => i !== index);
      setSiteConfig({ ...siteConfig, socials: newSocials });
  };

  const handleSaveConfig = async () => {
      try {
          await setDoc(doc(db, 'config', 'general'), siteConfig, { merge: true });
          alert('Configuration saved successfully!');
      } catch (e) {
          alert('Failed to save configuration');
      }
  };

  const handlePaymentAction = async (paymentId: string, status: 'approved' | 'rejected', userId: string, plan: string) => {
      try {
          await updateDoc(doc(db, "manual_payments", paymentId), { status });
          if (status === 'approved') {
              // Activate User Plan
              await updateDoc(doc(db, "users", userId), { 
                  plan: plan as any, 
                  planExpiry: new Date(Date.now() + 30*24*60*60*1000).toISOString() 
              });
              fetchData();
          } else {
              setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status } : p));
          }
      } catch (e) {
          alert("Action failed");
      }
  };

  const handleUpdateUser = async () => {
      if(!selectedUser || !selectedUser.uid) return;
      try {
          await updateDoc(doc(db, 'users', selectedUser.uid), {
              plan: selectedUser.plan,
              name: selectedUser.name,
              isBanned: selectedUser.isBanned || false
          });
          fetchData();
          setIsEditUserOpen(false);
          alert('User updated');
      } catch(e) {
          alert('Update failed');
      }
  };

  const handleDeleteUser = async (userId: string) => {
      if(!confirm('Are you sure? This cannot be undone.')) return;
      try {
          await deleteDoc(doc(db, 'users', userId));
          setUsers(prev => prev.filter(u => u.uid !== userId));
          setIsEditUserOpen(false);
      } catch(e) {
          alert('Failed to delete user');
      }
  };

  const handleToggleMessageRead = async (message: ContactMessage) => {
      if (!message.id) return;
      try {
          const newStatus = !message.read;
          await updateDoc(doc(db, 'messages', message.id), { read: newStatus });
          setMessages(prev => prev.map(m => m.id === message.id ? { ...m, read: newStatus } : m));
          if (selectedMessage && selectedMessage.id === message.id) {
              setSelectedMessage({ ...message, read: newStatus });
          }
      } catch(e) {
          alert("Failed to update message status");
      }
  };

  const generatePDFReport = () => {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text('Nexus Tools - Full Site Report', 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Summary Stats
      const stats = [
          ['Total Users', users.length.toString()],
          ['Total Payments', payments.length.toString()],
          ['Revenue', `$${payments.filter(p=>p.status==='approved').reduce((a,b)=>a+Number(b.amount),0).toFixed(2)}`],
          ['Tools Active', tools.filter(t=>t.enabled !== false).length.toString()],
          ['Messages', messages.length.toString()]
      ];
      
      autoTable(doc, {
          startY: 40,
          head: [['Metric', 'Value']],
          body: stats,
      });

      // Users Table
      doc.text('Recent Users', 14, (doc as any).lastAutoTable.finalY + 10);
      autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 15,
          head: [['Name', 'Email', 'Plan', 'Joined']],
          body: users.slice(0, 20).map(u => [u.name, u.email, u.plan, new Date(u.memberSince).toLocaleDateString()]),
      });

      // Payments Table
      doc.text('Recent Payments', 14, (doc as any).lastAutoTable.finalY + 10);
      autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 15,
          head: [['User', 'Amount', 'Status', 'Date']],
          body: payments.slice(0, 20).map(p => [p.email, `$${p.amount}`, p.status, p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : '-']),
      });

      doc.save('nexus-tools-report.pdf');
  };

  // --- Filtering ---
  const filteredUsers = users.filter(u => (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPayments = payments.filter(p => (p.transactionId || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTools = tools.filter(t => (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPosts = posts.filter(p => (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMessages = messages.filter(m => (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || (m.message || '').toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredReports = reports.filter(r => (r.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) || (r.type || '').toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin h-8 w-8 text-brand-600" /></div>;
  if (!user || !isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex relative">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full hidden lg:flex flex-col z-20">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Panel</span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Nexus Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
            <NavButton active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} icon={Wrench} label="Tools Manager" />
            <NavButton active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} icon={FileText} label="Blog System" />
            <NavButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="User Control" />
            <NavButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon={CreditCard} label="Payment Manager" />
            <NavButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={MessageSquare} label="Message Center" />
            <NavButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={Flag} label="Reports & Feedback" />
            <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="System Settings" />
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-3 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-brand-600 text-sm font-medium">
                <LogOut className="h-4 w-4" /> Exit to App
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back, {user.name}</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Global Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" 
                        />
                    </div>
                    <button onClick={fetchData} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50">
                        <RefreshCw className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </header>

            {dataLoading ? (
                <div className="flex justify-center py-20"><RefreshCw className="animate-spin h-8 w-8 text-brand-600" /></div>
            ) : (
                <>
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6 animate-in fade-in">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <StatCard title="Total Users" value={users.length} icon={Users} color="blue" />
                                <StatCard title="Revenue" value={`$${payments.filter(p=>p.status==='approved').reduce((a,b)=>a+Number(b.amount),0).toFixed(2)}`} icon={DollarSign} color="green" />
                                <StatCard title="Total Views" value={totalViews.toLocaleString()} icon={Eye} color="amber" />
                                <StatCard title="Active Tools" value={tools.filter(t=>t.enabled !== false).length} icon={Wrench} color="purple" />
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* User Growth Chart */}
                                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-brand-600" /> User Growth</h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={userGrowthData}>
                                                <defs>
                                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748B'}} />
                                                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748B'}} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <Area type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Plan Distribution Chart */}
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold text-lg mb-4">Plan Distribution</h3>
                                    <div className="h-64 w-full flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={planDistributionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {planDistributionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Tools Usage & Report */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-purple-600" /> Most Used Tools</h3>
                                    <div className="space-y-4">
                                        {tools.filter(t=>t.popular).slice(0, 5).map((t, i) => (
                                            <div key={t.id} className="flex items-center gap-4">
                                                <span className="text-slate-400 font-mono text-sm w-4">0{i+1}</span>
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">{t.name}</span>
                                                        <span className="text-slate-500">{90 - (i*10)}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                                        <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${90 - (i*10)}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                                    <FileText className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Generate Report</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs">Download a full analysis of users, payments, and site performance.</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => downloadCSV([...users, ...payments], 'full_site_data')} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
                                            <Download className="h-4 w-4" /> CSV
                                        </button>
                                        <button onClick={generatePDFReport} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700">
                                            <FileText className="h-4 w-4" /> PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TOOLS MANAGER TAB */}
                    {activeTab === 'tools' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => {
                                        setSelectedTool({ id: `custom-${Date.now()}`, slug: `tool-${Date.now()}`, name: '', description: '', category: ToolCategory.MISC, isNew: true, enabled: true });
                                        setIsAddToolOpen(true);
                                    }}
                                    className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700"
                                >
                                    <Plus className="h-4 w-4" /> Add New Tool
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Tool Name</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredTools.map(t => (
                                            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                                                    <div className="text-xs text-slate-500">{t.description.substring(0, 50)}...</div>
                                                </td>
                                                <td className="p-4 capitalize"><span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{t.category}</span></td>
                                                <td className="p-4">
                                                    <button 
                                                        onClick={() => handleToolToggle(t)}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${t.enabled !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                                    >
                                                        {t.enabled !== false ? 'Enabled' : 'Disabled'}
                                                    </button>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => { setSelectedTool(t); setIsEditToolOpen(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"><Edit2 className="h-4 w-4 text-slate-500" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* REPORTS TAB */}
                    {activeTab === 'reports' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Subject</th>
                                            <th className="p-4">Message</th>
                                            <th className="p-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredReports.map(r => (
                                            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold capitalize ${r.type === 'bug' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{r.type}</span></td>
                                                <td className="p-4 font-bold text-slate-900 dark:text-white">{r.subject}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{r.message}</td>
                                                <td className="p-4 text-slate-500">{r.createdAt?.seconds ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))}
                                        {filteredReports.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No reports found.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* BLOG MANAGER TAB */}
                    {activeTab === 'blog' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => { setSelectedPost({ title: '', excerpt: '', content: '', author: user.name, date: new Date().toISOString(), category: 'General' }); setIsEditPostOpen(true); }}
                                    className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700"
                                >
                                    <Plus className="h-4 w-4" /> New Post
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {filteredPosts.map(post => (
                                    <div key={post.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{post.title}</h3>
                                            <p className="text-xs text-slate-500">{new Date(post.date).toLocaleDateString()} • {post.author}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setSelectedPost(post); setIsEditPostOpen(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"><Edit2 className="h-4 w-4 text-brand-600" /></button>
                                            <button onClick={() => handleDeletePost(post.id!)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 className="h-4 w-4 text-red-600" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MESSAGES TAB */}
                    {activeTab === 'messages' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="grid grid-cols-1 gap-4">
                                {filteredMessages.map(msg => (
                                    <div key={msg.id} className={`bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 transition-all ${msg.read ? 'border-slate-200 opacity-70' : 'border-brand-200 shadow-sm ring-1 ring-brand-100'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {msg.firstName} {msg.lastName}
                                                    {!msg.read && <span className="h-2 w-2 bg-brand-600 rounded-full"></span>}
                                                </h3>
                                                <a href={`mailto:${msg.email}`} className="text-sm text-brand-600 hover:underline">{msg.email}</a>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-xs text-slate-400">{msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleToggleMessageRead(msg)} 
                                                        className="p-1 text-slate-400 hover:text-brand-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                                        title={msg.read ? "Mark as Unread" : "Mark as Read"}
                                                    >
                                                        {msg.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedMessage(msg); setIsViewMessageOpen(true); if(!msg.read) handleToggleMessageRead(msg); }}
                                                        className="mt-2 text-xs flex items-center gap-1 text-slate-500 hover:text-brand-600"
                                                    >
                                                        <Eye className="h-3 w-3" /> Read Full
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg line-clamp-2">{msg.message}</p>
                                    </div>
                                ))}
                                {filteredMessages.length === 0 && <p className="text-center text-slate-500">No messages found.</p>}
                            </div>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-in fade-in max-w-3xl">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><DollarSign className="h-5 w-5" /> Pricing Configuration</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Golden Monthly ($)</label>
                                        <input 
                                            type="number" step="0.01"
                                            value={siteConfig.pricing?.goldenMonthly || ''} 
                                            onChange={e => setSiteConfig({...siteConfig, pricing: { ...siteConfig.pricing, goldenMonthly: e.target.value }})} 
                                            className="w-full p-2 border rounded dark:bg-slate-950 dark:border-slate-700" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Golden Yearly ($)</label>
                                        <input 
                                            type="number" step="0.01"
                                            value={siteConfig.pricing?.goldenYearly || ''} 
                                            onChange={e => setSiteConfig({...siteConfig, pricing: { ...siteConfig.pricing, goldenYearly: e.target.value }})} 
                                            className="w-full p-2 border rounded dark:bg-slate-950 dark:border-slate-700" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe className="h-5 w-5" /> General Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Footer Text</label>
                                        <input type="text" value={siteConfig.footerText} onChange={e => setSiteConfig({...siteConfig, footerText: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-950 dark:border-slate-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Contact Email</label>
                                        <input type="text" value={siteConfig.contactEmail} onChange={e => setSiteConfig({...siteConfig, contactEmail: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-950 dark:border-slate-700" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><ExternalLink className="h-5 w-5" /> Social Media Links</h3>
                                    <button onClick={addSocial} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded dark:bg-slate-800 dark:text-slate-300">Add Link</button>
                                </div>
                                <div className="space-y-3">
                                    {siteConfig.socials.map((social, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <select 
                                                value={social.platform} 
                                                onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                                                className="p-2 border rounded dark:bg-slate-950 dark:border-slate-700"
                                            >
                                                <option value="twitter">Twitter</option>
                                                <option value="github">GitHub</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="discord">Discord</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                value={social.url} 
                                                onChange={(e) => handleSocialChange(idx, 'url', e.target.value)} 
                                                className="flex-1 p-2 border rounded dark:bg-slate-950 dark:border-slate-700" 
                                                placeholder="https://..."
                                            />
                                            <button onClick={() => removeSocial(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    ))}
                                    {siteConfig.socials.length === 0 && <p className="text-sm text-slate-400 italic">No social links added.</p>}
                                </div>
                            </div>

                            <button onClick={handleSaveConfig} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 flex items-center gap-2">
                                <Save className="h-4 w-4" /> Save Changes
                            </button>
                        </div>
                    )}

                    {/* USERS & PAYMENTS Tabs (Simplified for brevity, logic exists above) */}
                    {activeTab === 'users' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex justify-end">
                                <button onClick={() => downloadCSV(users, 'users_export')} className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
                                    <Download className="h-4 w-4" /> Export CSV
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium uppercase text-xs">
                                        <tr>
                                            <th className="p-4">User</th>
                                            <th className="p-4">Plan</th>
                                            <th className="p-4">Joined</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredUsers.map(u => (
                                            <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-4 flex items-center gap-3">
                                                    <img src={u.avatar} className="h-8 w-8 rounded-full" />
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">{u.name}</div>
                                                        <div className="text-xs text-slate-500">{u.email}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 capitalize">{u.plan}</td>
                                                <td className="p-4">{new Date(u.memberSince).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    {u.isBanned ? <span className="text-red-600 font-bold text-xs">BANNED</span> : <span className="text-green-600 font-bold text-xs">ACTIVE</span>}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => { setSelectedUser(u); setIsEditUserOpen(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-brand-600">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-4 animate-in fade-in">
                             <div className="flex justify-end">
                                <button onClick={() => downloadCSV(payments, 'payments_export')} className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
                                    <Download className="h-4 w-4" /> Export CSV
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">User</th>
                                            <th className="p-4">Details</th>
                                            <th className="p-4">TrxID</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredPayments.map(p => (
                                            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-4">{p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : '-'}</td>
                                                <td className="p-4"><div className="font-medium">{p.email}</div></td>
                                                <td className="p-4"><span className="font-bold">${p.amount}</span> <span className="text-slate-500 text-xs">via {p.method}</span></td>
                                                <td className="p-4 font-mono text-xs">{p.transactionId}</td>
                                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold capitalize ${p.status === 'approved' ? 'bg-green-100 text-green-700' : p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span></td>
                                                <td className="p-4 text-right">
                                                    {p.status === 'pending' && (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handlePaymentAction(p.id!, 'approved', p.userId, p.plan)} className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100"><Check className="h-4 w-4" /></button>
                                                            <button onClick={() => handlePaymentAction(p.id!, 'rejected', p.userId, p.plan)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><X className="h-4 w-4" /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
      </main>

      {/* MESSAGE VIEW MODAL */}
      {isViewMessageOpen && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h3 className="font-bold text-lg">{selectedMessage.firstName} {selectedMessage.lastName}</h3>
                          <p className="text-sm text-slate-500">{selectedMessage.email}</p>
                      </div>
                      <div className="text-right">
                          <span className="text-xs text-slate-400 block mb-2">{selectedMessage.createdAt?.seconds ? new Date(selectedMessage.createdAt.seconds * 1000).toLocaleString() : ''}</span>
                          <button 
                            onClick={() => handleToggleMessageRead(selectedMessage)}
                            className={`text-xs px-3 py-1 rounded-full border ${selectedMessage.read ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-brand-50 text-brand-600 border-brand-200'}`}
                          >
                              {selectedMessage.read ? 'Marked as Read' : 'Mark as Read'}
                          </button>
                      </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {selectedMessage.message}
                  </div>
                  <div className="mt-6 flex justify-end">
                      <button onClick={() => setIsViewMessageOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700">Close</button>
                  </div>
              </div>
          </div>
      )}

      {/* EDIT TOOL MODAL */}
      {(isEditToolOpen || isAddToolOpen) && selectedTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">{isAddToolOpen ? 'Add New Tool' : 'Edit Tool'}</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input type="text" value={selectedTool.name} onChange={e => setSelectedTool({...selectedTool, name: e.target.value})} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea value={selectedTool.description} onChange={e => setSelectedTool({...selectedTool, description: e.target.value})} className="w-full p-2 border rounded" />
                      </div>
                      <div className="flex gap-4">
                          <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">Category</label>
                              <select value={selectedTool.category} onChange={e => setSelectedTool({...selectedTool, category: e.target.value as any})} className="w-full p-2 border rounded">
                                  {Object.values(ToolCategory).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                          <div className="flex items-end mb-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={selectedTool.enabled !== false} onChange={e => setSelectedTool({...selectedTool, enabled: e.target.checked})} className="rounded text-brand-600" />
                                  <span className="text-sm">Enabled</span>
                              </label>
                          </div>
                      </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                      <button onClick={() => { setIsEditToolOpen(false); setIsAddToolOpen(false); }} className="px-4 py-2 border rounded hover:bg-slate-50">Cancel</button>
                      <button onClick={handleSaveTool} className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Save Tool</button>
                  </div>
              </div>
          </div>
      )}

      {/* EDIT POST MODAL */}
      {isEditPostOpen && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                  <h3 className="font-bold text-lg mb-4">Edit Blog Post</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input type="text" value={selectedPost.title} onChange={e => setSelectedPost({...selectedPost, title: e.target.value})} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Image URL</label>
                          <input type="text" value={selectedPost.imageUrl || ''} onChange={e => setSelectedPost({...selectedPost, imageUrl: e.target.value})} className="w-full p-2 border rounded" placeholder="https://..." />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Excerpt</label>
                          <textarea rows={2} value={selectedPost.excerpt} onChange={e => setSelectedPost({...selectedPost, excerpt: e.target.value})} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Content (HTML)</label>
                          <textarea rows={10} value={selectedPost.content} onChange={e => setSelectedPost({...selectedPost, content: e.target.value})} className="w-full p-2 border rounded font-mono text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-1">Category</label>
                              <input type="text" value={selectedPost.category} onChange={e => setSelectedPost({...selectedPost, category: e.target.value})} className="w-full p-2 border rounded" />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-1">Author</label>
                              <input type="text" value={selectedPost.author} onChange={e => setSelectedPost({...selectedPost, author: e.target.value})} className="w-full p-2 border rounded" />
                          </div>
                      </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                      <button onClick={() => setIsEditPostOpen(false)} className="px-4 py-2 border rounded hover:bg-slate-50">Cancel</button>
                      <button onClick={handleSavePost} className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Save Post</button>
                  </div>
              </div>
          </div>
      )}

      {/* USER EDIT MODAL (Reused logic) */}
      {isEditUserOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Edit User</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input type="text" value={selectedUser.name} onChange={e => setSelectedUser({...selectedUser, name: e.target.value})} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Plan</label>
                          <select value={selectedUser.plan} onChange={e => setSelectedUser({...selectedUser, plan: e.target.value as any})} className="w-full p-2 border rounded">
                              <option value="free">Free</option>
                              <option value="golden">Golden</option>
                              <option value="custom">Custom</option>
                          </select>
                      </div>
                      <div className="flex items-center gap-2">
                          <input type="checkbox" checked={selectedUser.isBanned || false} onChange={e => setSelectedUser({...selectedUser, isBanned: e.target.checked})} className="rounded text-red-600" />
                          <span className="text-red-600 font-bold text-sm">Ban User</span>
                      </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                      <button onClick={() => handleDeleteUser(selectedUser.uid!)} className="text-red-600 text-sm font-bold flex items-center gap-1"><Trash2 className="h-4 w-4" /> Delete</button>
                      <div className="flex gap-3">
                          <button onClick={() => setIsEditUserOpen(false)} className="px-4 py-2 border rounded hover:bg-slate-50">Cancel</button>
                          <button onClick={handleUpdateUser} className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Save</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => {
    const colors: any = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        amber: 'bg-amber-100 text-amber-600',
        purple: 'bg-purple-100 text-purple-600',
    };
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colors[color]} dark:bg-opacity-20`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
    >
        <Icon className="h-5 w-5" /> {label}
    </button>
);

export default AdminDashboard;