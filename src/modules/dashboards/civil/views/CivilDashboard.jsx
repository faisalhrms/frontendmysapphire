import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import {
    MapPin, TrendingUp, AlertCircle, CheckCircle,
    DollarSign, Briefcase, Activity,
     Search, X, ChevronRight, Building2, ArrowLeft,
    Target, AlertTriangle, RefreshCw
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import api from "@config/axiosConfig.js";
import {toTitleCase} from "@helpers/formatters.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {formatDate, formatDateTimeLocal} from "@helpers/dateTime.js";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CivilDashboard = () => {
    const [sitesData, setSitesData] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        searchQuery: ''
    });
    const [detailData, setDetailData] = useState({
        projects: [],
        financials: null,
        tasks: null
    });
    const [detailLoading, setDetailLoading] = useState(false);

    // Fetch sites overview
    useEffect(() => {
        fetchSitesOverview();
    }, [filters.status]);

    // Fetch site details when site is selected
    useEffect(() => {
        if (selectedSite) {
            fetchSiteDetails(selectedSite.id);
        }
    }, [selectedSite, activeTab]);

    const fetchSitesOverview = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/dashboard/civil/sites/?status=${filters.status}`);
            const result = response.data;
            if (result.status) {
                setSitesData(result.data.sites);
            }
        } catch (error) {
            console.error('Error fetching sites:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSiteDetails = async (siteId) => {
        setDetailLoading(true);
        try {
            const endpoints = {
                projects: `/dashboard/civil/projects/${siteId}/`,
                financials: `/dashboard/civil/financials/${siteId}/`,
                tasks: `/dashboard/civil/tasks/${siteId}/`
            };

            const endpoint = endpoints[activeTab];
            if (endpoint) {
                const response = await api.get(endpoint);
                const result = response.data;
                if (result.status) {
                    setDetailData(prev => ({
                        ...prev,
                        [activeTab]: result.data
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching site details:', error);
        } finally {
            setDetailLoading(false);
        }
    };

    const filteredSites = useMemo(() => {
        return sitesData.filter(site =>
            site.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            (site.address && site.address.toLowerCase().includes(filters.searchQuery.toLowerCase()))
        );
    }, [sitesData, filters.searchQuery]);

    const getHealthColor = (status) => {
        const colors = {
            excellent: 'bg-success/10 text-success border-success/20',
            good: 'bg-primary/10 text-primary border-primary/20',
            warning: 'bg-warning/10 text-warning border-warning/20',
            critical: 'bg-danger/10 text-danger border-danger/20'
        };
        return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200';
    };

    const getHealthDotColor = (status) => {
        const colors = {
            excellent: '#10b981',
            good: '#3b82f6',
            warning: '#f59e0b',
            critical: '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    const MapBounds = ({ sites }) => {
        const map = useMap();

        useEffect(() => {
            if (sites.length > 0) {
                const validSites = sites.filter(s => s.latitude && s.longitude);
                if (validSites.length > 0) {
                    const bounds = validSites.map(site => [
                        parseFloat(site.latitude),
                        parseFloat(site.longitude)
                    ]);
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        }, [sites, map]);

        return null;
    };

    const CustomMarkerIcon = (healthStatus) => {
        const color = getHealthDotColor(healthStatus);

        return L.divIcon({
            html: `
      <div class="marker-pin">
        <div class="marker-inner" style="background: ${color};">
          <div class="marker-pulse" style="background: ${color};"></div>
          <svg class="marker-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
      </div>
      <style>
        .marker-pin {
          width: 44px;
          height: 44px;
          position: relative;
          animation: markerBounce 3s ease-in-out infinite;
        }
        
        .marker-inner {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2), 0 0 0 5px rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .marker-icon {
          width: 20px;
          height: 20px;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        
        .marker-pulse {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          position: absolute;
          opacity: 0;
          animation: pulse 2.5s ease-out infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        
        @keyframes markerBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .marker-pin:hover .marker-inner {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25), 0 0 0 5px rgba(255, 255, 255, 0.95);
        }
      </style>
    `,
            className: 'custom-marker-icon',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            popupAnchor: [0, -22]
        });
    };
    const MetricCard = ({ icon: Icon, label, value, change, changeType = 'neutral', subtitle }) => (
        <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="text-gray-600" size={18} />
                </div>
                {change && (
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                        changeType === 'positive' ? 'bg-success/10 text-success' :
                            changeType === 'negative' ? 'bg-danger/10 text-danger' :
                                'bg-gray-100 text-gray-600'
                    }`}>
                        {change}
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
        </div>
    );

    const SiteCard = ({ site }) => (
        <div
            onClick={() => setSelectedSite(site)}
            className="group bg-white border border-gray-100 rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 truncate group-hover:text-primary transition-colors">
                        {site.name}
                    </h3>
                    {site.address && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                            {site.address}
                        </p>
                    )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getHealthColor(site.health_status)}`}>
                    {site.health_status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="space-y-1">
                    <div className="text-xs text-gray-500 font-medium">Projects</div>
                    <div className="text-lg font-semibold text-gray-900">
                        {site.active_projects}<span className="text-sm text-gray-400 font-normal">/{site.total_projects}</span>
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <div className="text-xs text-gray-500 font-medium">Progress</div>
                    <div className="text-lg font-semibold text-primary">
                        {site.completion_rate}%
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Tasks Completed</span>
                    <span className="font-semibold text-gray-900">{site.completed_tasks}/{site.total_tasks}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${site.completion_rate}%` }}
                    />
                </div>
            </div>

            {site.overdue_tasks > 0 && (
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-danger bg-danger/5 px-2.5 py-1.5 rounded-lg border border-danger/10">
                    <AlertTriangle size={12} />
                    <span>{site.overdue_tasks} overdue</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className={`text-xs font-medium ${site.is_active ? 'text-success' : 'text-gray-400'}`}>
                    {site.is_active ? '● Active' : '○ Closed'}
                </span>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
        </div>
    );

    const OverviewTab = () => {
        if (!selectedSite) return null;

        const budgetData = [
            {
                name: 'Budget',
                allocated: selectedSite.total_budget,
                spent: selectedSite.total_spent
            }
        ];

        const progressData = [
            { name: 'Completed', value: selectedSite.completed_tasks },
            { name: 'Remaining', value: selectedSite.total_tasks - selectedSite.completed_tasks }
        ];

        const projectsData = [
            { name: 'Active', value: selectedSite.active_projects },
            { name: 'Completed', value: selectedSite.completed_projects }
        ];

        const COLORS = {
            completed: '#10b981',
            remaining: '#e5e7eb',
            active: '#3b82f6',
            completedProjects: '#10b981'
        };

        return (
            <div className="space-y-5">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <MetricCard
                        icon={Briefcase}
                        label="Total Projects"
                        value={selectedSite.total_projects}
                        subtitle={`${selectedSite.active_projects} active, ${selectedSite.completed_projects} completed`}
                    />
                    <MetricCard
                        icon={CheckCircle}
                        label="Completion Rate"
                        value={`${selectedSite.completion_rate}%`}
                        subtitle={`${selectedSite.completed_tasks}/${selectedSite.total_tasks} tasks`}
                        change={selectedSite.completion_rate >= 70 ? '+5%' : null}
                        changeType={selectedSite.completion_rate >= 70 ? 'positive' : 'neutral'}
                    />
                    <MetricCard
                        icon={AlertCircle}
                        label="Overdue Tasks"
                        value={selectedSite.overdue_tasks}
                        subtitle={selectedSite.overdue_tasks > 0 ? 'Requires attention' : 'On track'}
                        changeType={selectedSite.overdue_tasks > 5 ? 'negative' : selectedSite.overdue_tasks > 0 ? 'neutral' : 'positive'}
                    />
                    <MetricCard
                        icon={Activity}
                        label="Health Score"
                        value={selectedSite.health_score}
                        subtitle={selectedSite.health_status.charAt(0).toUpperCase() + selectedSite.health_status.slice(1)}
                        change={selectedSite.health_score >= 80 ? 'Good' : 'Fair'}
                        changeType={selectedSite.health_score >= 80 ? 'positive' : 'neutral'}
                    />
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-semibold text-gray-900">Budget Overview</h3>
                            <DollarSign className="text-gray-400" size={20}/>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-xs text-gray-500 font-medium">Total Budget</span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {(selectedSite.total_budget / 1000000).toFixed(2)}M
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-xs text-gray-500 font-medium">Total Spent</span>
                                    <span className="text-lg font-semibold text-primary">
                                        {(selectedSite.total_spent / 1000000).toFixed(2)}M
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-gray-500 font-medium">Remaining</span>
                                    <span className="text-lg font-semibold text-success">
                                        {((selectedSite.total_budget - selectedSite.total_spent) / 1000000).toFixed(2)}M
                                    </span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-gray-500 font-medium">Utilization</span>
                                    <span
                                        className="text-sm font-semibold text-gray-900">{selectedSite.budget_utilization}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            selectedSite.budget_utilization > 90 ? 'bg-danger' :
                                                selectedSite.budget_utilization > 75 ? 'bg-warning' :
                                                    'bg-primary'
                                        }`}
                                        style={{width: `${selectedSite.budget_utilization}%`}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-6">Task Progress</h3>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={progressData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    <Cell fill={COLORS.completed}/>
                                    <Cell fill={COLORS.remaining}/>
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-success"></div>
                                <span className="text-xs text-gray-600">Completed: {selectedSite.completed_tasks}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                <span
                                    className="text-xs text-gray-600">Remaining: {selectedSite.total_tasks - selectedSite.completed_tasks}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-6">Projects Status</h3>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={projectsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    <Cell fill={COLORS.active}/>
                                    <Cell fill={COLORS.completedProjects}/>
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="text-xs text-gray-600">Active: {selectedSite.active_projects}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-success"></div>
                                <span
                                    className="text-xs text-gray-600">Completed: {selectedSite.completed_projects}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budget Spending Chart */}
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-gray-900">Budget Allocation vs Spending</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-primary/20"></div>
                                <span className="text-gray-600">Allocated</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-success/20"></div>
                                <span className="text-gray-600">Spent</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={budgetData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
                            <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 11}}
                                   axisLine={{stroke: '#e5e7eb'}}/>
                            <YAxis tick={{fill: '#6b7280', fontSize: 11}} axisLine={{stroke: '#e5e7eb'}}/>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                                formatter={(value) => `${(value / 1000000).toFixed(2)}M`}
                            />
                            <Bar dataKey="allocated" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Allocated"/>
                            <Bar dataKey="spent" fill="#10b981" radius={[4, 4, 0, 0]} name="Spent"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div
                        className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-primary/70 font-medium uppercase tracking-wide mb-2">Site
                                    Status</p>
                                <p className="text-2xl font-bold text-primary mb-1">
                                    {selectedSite.is_active ? 'Active' : 'Closed'}
                                </p>
                                <p className="text-xs text-primary/70">
                                    {selectedSite.ended_at ? `Ended: ${selectedSite.ended_at}` : 'Currently operational'}
                                </p>
                            </div>
                            <div className="p-3 bg-white/50 rounded-lg">
                                <Building2 className="text-primary" size={24}/>
                            </div>
                        </div>
                    </div>

                    <div className={`bg-gradient-to-br rounded-xl p-6 border ${
                        selectedSite.health_score >= 80 ? 'from-success/5 to-success/10 border-success/20' :
                            selectedSite.health_score >= 60 ? 'from-warning/5 to-warning/10 border-warning/20' :
                                'from-danger/5 to-danger/10 border-danger/20'
                    }`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${
                                    selectedSite.health_score >= 80 ? 'text-success/70' :
                                        selectedSite.health_score >= 60 ? 'text-warning/70' :
                                            'text-danger/70'
                                }`}>Overall Health</p>
                                <p className={`text-2xl font-bold mb-1 ${
                                    selectedSite.health_score >= 80 ? 'text-success' :
                                        selectedSite.health_score >= 60 ? 'text-warning' :
                                            'text-danger'
                                }`}>
                                    {selectedSite.health_score}/100
                                </p>
                                <p className={`text-xs capitalize ${
                                    selectedSite.health_score >= 80 ? 'text-success/70' :
                                        selectedSite.health_score >= 60 ? 'text-warning/70' :
                                            'text-danger/70'
                                }`}>
                                    {selectedSite.health_status} condition
                                </p>
                            </div>
                            <div className={`p-3 bg-white/50 rounded-lg`}>
                                <Activity className={
                                    selectedSite.health_score >= 80 ? 'text-success' :
                                        selectedSite.health_score >= 60 ? 'text-warning' :
                                            'text-danger'
                                } size={24}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{height: '400px'}}>
                    <MapContainer
                        center={[parseFloat(selectedSite.latitude), parseFloat(selectedSite.longitude)]}
                        zoom={15}
                        style={{height: '100%', width: '100%'}}
                        maxZoom={18}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <Marker
                            position={[parseFloat(selectedSite.latitude), parseFloat(selectedSite.longitude)]}
                            icon={CustomMarkerIcon(selectedSite.health_status)}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-2">{selectedSite.name}</h4>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Health:</span>
                                            <span className="font-medium capitalize"
                                                  style={{color: getHealthDotColor(selectedSite.health_status)}}>
                                                    {selectedSite.health_status}
                                                </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Progress:</span>
                                            <span
                                                className="font-medium text-primary">{selectedSite.completion_rate}%</span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

            </div>
        );
    };

    const ProjectsTab = () => {
        if (detailLoading) return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary"></div>
            </div>
        );
        if (!detailData.projects || !detailData?.projects.length > 0) return null;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {detailData.projects.map(project => (
                    <div key={project.id}
                         className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="font-semibold text-gray-900 text-sm flex-1 pr-2">{project.name}</h4>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                project.status === 'completed' ? 'bg-success/10 text-success' :
                                    project.status === 'active' ? 'bg-primary/10 text-primary' :
                                        'bg-gray-100 text-gray-600'
                            }`}>
                                {toTitleCase(project.status)}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-gray-500 font-medium">Progress</span>
                                    <span className="font-semibold text-gray-900">{project.task_progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{width: `${project.task_progress}%`}}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1 font-medium">Milestones</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {project.completed_milestones}<span className="text-sm text-gray-400">/{project.total_milestones}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1 font-medium">Tasks</div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {project.completed_tasks}<span className="text-sm text-gray-400">/{project.total_tasks}</span>
                                    </div>
                                </div>
                            </div>

                            {project.project_budget && (
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-medium">Budget</span>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {(project.project_spent / 1000).toFixed(0)}K
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                of {(project.project_budget / 1000).toFixed(0)}K
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const FinancialsTab = () => {
        if (detailLoading) return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary"></div>
            </div>
        );
        if (!detailData.financials) return null;

        const { summary, boqs } = detailData.financials;

        const chartData = boqs.map(boq => ({
            name: boq.boq_no,
            budget: boq.budget,
            spent: boq.awarded_amount
        }));

        return (
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    <MetricCard
                        icon={DollarSign}
                        label="Total Budget"
                        value={`${(summary.total_budget / 1000000).toFixed(1)}M`}
                        subtitle={`${summary.total_budget.toLocaleString()}`}
                    />
                    <MetricCard
                        icon={TrendingUp}
                        label="Total Spent"
                        value={`${(summary.total_awarded / 1000000).toFixed(1)}M`}
                        subtitle={`${summary.total_awarded.toLocaleString()}`}
                    />
                    <MetricCard
                        icon={Activity}
                        label="Variance"
                        value={`${Math.abs(summary.total_variance / 1000000).toFixed(1)}M`}
                        subtitle={`${summary.total_variance.toLocaleString()}`}
                        change={summary.total_variance >= 0 ? 'Under Budget' : 'Over Budget'}
                        changeType={summary.total_variance >= 0 ? 'positive' : 'negative'}
                    />
                    <MetricCard
                        icon={Target}
                        label="Utilization"
                        value={`${summary.overall_utilization}%`}
                        change={summary.overall_utilization > 80 ? 'High' : 'Normal'}
                        changeType={summary.overall_utilization > 90 ? 'negative' : 'positive'}
                    />
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-gray-900">Budget Analysis</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-primary/20"></div>
                                <span className="text-gray-600">Budget</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-success/20"></div>
                                <span className="text-gray-600">Spent</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar dataKey="budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="spent" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900">BOQ Details</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">BOQ No</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Budget</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Spent</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Variance</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Utilization</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {boqs.map((boq) => (
                                <tr key={boq.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900 text-sm">{boq.boq_no}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{boq.project_name}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                        {boq.currency} {boq.budget.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                        {boq.currency} {boq.awarded_amount.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 text-right text-sm font-semibold ${
                                        boq.variance >= 0 ? 'text-success' : 'text-danger'
                                    }`}>
                                        {boq.currency} {Math.abs(boq.variance).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                                                boq.utilization > 100 ? 'bg-danger/10 text-danger' :
                                                    boq.utilization > 80 ? 'bg-warning/10 text-warning' :
                                                        'bg-success/10 text-success'
                                            }`}>
                                                {boq.utilization}%
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const TasksTab = () => {
        if (detailLoading) return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary"></div>
            </div>
        );
        if (!detailData.tasks) return null;

        const { by_status, by_priority, overdue_tasks } = detailData.tasks;

        const statusData = by_status.map(item => ({
            name: item.status.replace('_', ' ').toUpperCase(),
            value: item.count
        }));

        const priorityData = by_priority.map(item => ({
            name: item.priority.toUpperCase(),
            value: item.count
        }));

        const STATUS_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        const PRIORITY_COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

        return (
            <div className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {statusData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: STATUS_COLORS[idx] }}></div>
                                    <span className="text-gray-600">{item.name}</span>
                                    <span className="font-semibold text-gray-900 ml-auto">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Priority Distribution</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {priorityData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: PRIORITY_COLORS[idx] }}></div>
                                    <span className="text-gray-600">{item.name}</span>
                                    <span className="font-semibold text-gray-900 ml-auto">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {overdue_tasks.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-danger/5">
                            <AlertCircle className="text-danger" size={20} />
                            <h3 className="text-base font-semibold text-gray-900">
                                Overdue Tasks ({overdue_tasks.length})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Milestone</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Priority</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {overdue_tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900 text-sm">{task.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{task.milestone__name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{task.milestone__project__name}</td>
                                        <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    task.priority === 'high' ? 'bg-danger/10 text-danger' :
                                                        task.priority === 'medium' ? 'bg-warning/10 text-warning' :
                                                            'bg-primary/10 text-primary'
                                                }`}>
                                                    {task.priority.toUpperCase()}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-danger font-medium text-sm">{formatDate(task.ended_at)}</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'financials', label: 'Financials', icon: DollarSign },
        { id: 'tasks', label: 'Tasks', icon: CheckCircle }
    ];

    return (
        <>
            <div className="space-y-6 mx-auto pb-6">
                <IconPageHeader
                    heading="Civil Dashboard"
                    headerClasses='font-bold text-[2rem]'
                    description="Monitor projects, financials, and site performance"
                    icon={Building2}
                    children={
                        <>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={16}/>
                                    <input
                                        type="text"
                                        placeholder="Search sites..."
                                        value={filters.searchQuery}
                                        onChange={(e) => setFilters(prev => ({...prev, searchQuery: e.target.value}))}
                                        className="pl-9 pr-9 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
                                    />
                                    {filters.searchQuery && (
                                        <button
                                            onClick={() => setFilters(prev => ({...prev, searchQuery: ''}))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={14}/>
                                        </button>
                                    )}
                                </div>

                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    <option value="all">All Sites</option>
                                    <option value="active">Active Only</option>
                                    <option value="closed">Closed Only</option>
                                </select>

                                <button
                                    className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                    <RefreshCw size={16} className="text-gray-600"/>
                                </button>
                            </div>
                        </>
                    }
                />

                {!selectedSite ? (
                    <>
                        <style>{`
        .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 16px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1);
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        
        .leaflet-popup-content {
          margin: 0;
          width: 300px !important;
        }
        
        .leaflet-popup-tip {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.1);
        }
        
        .leaflet-popup-close-button {
          display: none !important;
        }
        
        .popup-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .popup-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 100%);
          pointer-events: none;
        }
        
        .popup-header-content {
          position: relative;
          z-index: 1;
        }
        
        .popup-title {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 10px 0;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }
        
        .popup-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 5px 10px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
        }
        
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: statusPulse 2s ease-in-out infinite;
          box-shadow: 0 0 8px currentColor;
        }
        
        @keyframes statusPulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.15);
          }
        }
        
        .popup-body {
          padding: 18px 20px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }
        
        .metric-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        
        .metric-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .metric-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
        
        .metric-card:hover::before {
          opacity: 1;
        }
        
        .metric-label {
          font-size: 10px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        
        .metric-value {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        
        .progress-section {
          margin-top: 16px;
          padding: 14px 16px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .progress-label {
          font-size: 10px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .progress-value {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 100px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        
        .progress-bar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 10px currentColor;
        }
        
        .progress-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2.5s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .popup-footer {
          padding: 16px 20px 18px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }
        
        .btn-details {
          width: 100%;
          padding: 11px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.25);
          position: relative;
          overflow: hidden;
        }
        
        .btn-details::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn-details:hover::before {
          left: 100%;
        }
        
        .btn-details:hover {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.4);
        }
        
        .btn-details:active {
          transform: translateY(0);
        }
      `}</style>
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
                             style={{height: '600px'}}>
                            <MapContainer
                                center={[31.5204, 74.3587]}
                                zoom={11}
                                style={{height: '100%', width: '100%'}}
                                maxZoom={18}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />
                                <MapBounds sites={filteredSites.filter(s => s.latitude && s.longitude)}/>
                                <MarkerClusterGroup
                                    chunkedLoading
                                    maxClusterRadius={50}
                                    spiderfyOnMaxZoom={true}
                                    showCoverageOnHover={false}
                                    zoomToBoundsOnClick={true}
                                    iconCreateFunction={(cluster) => {
                                        const count = cluster.getChildCount();
                                        let size = count > 10 ? 58 : count > 5 ? 50 : 44;

                                        return L.divIcon({
                                            html: `
                    <div class="cluster-marker">
                      <div class="cluster-inner" style="width: ${size}px; height: ${size}px;">
                        <div class="cluster-pulse"></div>
                        <span class="cluster-count">${count}</span>
                      </div>
                    </div>
                    <style>
                      .cluster-marker {
                        animation: clusterFloat 3s ease-in-out infinite;
                      }
                      
                      .cluster-inner {
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
                        border-radius: 50%;
                        border: 5px solid white;
                        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.35), 0 4px 8px rgba(15, 23, 42, 0.25);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                      }
                      
                      .cluster-count {
                        font-weight: 800;
                        color: white;
                        font-size: 16px;
                        z-index: 2;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                      }
                      
                      .cluster-pulse {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                        animation: clusterPulse 2.5s ease-out infinite;
                      }
                      
                      @keyframes clusterPulse {
                        0% {
                          transform: scale(1);
                          opacity: 0.7;
                        }
                        100% {
                          transform: scale(2);
                          opacity: 0;
                        }
                      }
                      
                      @keyframes clusterFloat {
                        0%, 100% {
                          transform: translateY(0);
                        }
                        50% {
                          transform: translateY(-6px);
                        }
                      }
                      
                      .cluster-marker:hover .cluster-inner {
                        transform: scale(1.15);
                        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.45), 0 6px 12px rgba(15, 23, 42, 0.35);
                      }
                    </style>
                  `,
                                            className: 'custom-cluster-icon',
                                            iconSize: L.point(size, size, true)
                                        });
                                    }}
                                >
                                    {filteredSites
                                        .filter(site => site.latitude && site.longitude)
                                        .map(site => (
                                            <Marker
                                                key={site.id}
                                                position={[parseFloat(site.latitude), parseFloat(site.longitude)]}
                                                icon={CustomMarkerIcon(site.health_status)}
                                            >
                                                <Popup>
                                                    <div>
                                                        <div className="popup-header">
                                                            <div className="popup-header-content">
                                                                <h3 className="popup-title">{site.name}</h3>
                                                                <div className="popup-status"
                                                                     style={{color: getHealthDotColor(site.health_status)}}>
                                                                    <span className="status-dot"
                                                                          style={{background: getHealthDotColor(site.health_status)}}></span>
                                                                    {site.health_status}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="popup-body">
                                                            <div className="metric-grid">
                                                                <div className="metric-card">
                                                                    <div className="metric-label">Active</div>
                                                                    <div
                                                                        className="metric-value">{site.active_projects}</div>
                                                                </div>
                                                                <div className="metric-card">
                                                                    <div className="metric-label">Total</div>
                                                                    <div
                                                                        className="metric-value">{site.total_projects}</div>
                                                                </div>
                                                            </div>

                                                            <div className="progress-section">
                                                                <div className="progress-header">
                                                                    <span className="progress-label">Completion</span>
                                                                    <span
                                                                        className="progress-value">{site.completion_rate}%</span>
                                                                </div>
                                                                <div className="progress-bar-container">
                                                                    <div
                                                                        className="progress-bar-fill"
                                                                        style={{
                                                                            width: `${site.completion_rate}%`,
                                                                            background: site.completion_rate >= 75
                                                                                ? 'linear-gradient(90deg, #10b981, #059669)'
                                                                                : site.completion_rate >= 50
                                                                                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                                                                    : 'linear-gradient(90deg, #ef4444, #dc2626)',
                                                                            color: site.completion_rate >= 75 ? '#10b981' : site.completion_rate >= 50 ? '#f59e0b' : '#ef4444'
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="popup-footer">
                                                            <button
                                                                className="btn-details"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedSite(site);
                                                                }}
                                                            >
                                                                View Details →
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}
                                </MarkerClusterGroup>
                            </MapContainer>
                        </div>

                        {/* Sites Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">All Sites</h2>
                                <span
                                    className="text-sm text-gray-500">{filteredSites.length} {filteredSites.length === 1 ? 'site' : 'sites'}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {loading ? (
                                    <div className="col-span-full flex items-center justify-center py-20">
                                        <div
                                            className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary"></div>
                                    </div>
                                ) : filteredSites.length === 0 ? (
                                    <div className="col-span-full text-center py-20">
                                        <Building2 size={40} className="mx-auto text-gray-300 mb-3"/>
                                        <p className="text-gray-500 text-sm">No sites found</p>
                                    </div>
                                ) : (
                                    filteredSites.map(site => <SiteCard key={site.id} site={site}/>)
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Site Detail Header */}
                        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                            <button
                                onClick={() => setSelectedSite(null)}
                                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm mb-4 transition-colors group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform"/>
                                Back to sites
                            </button>

                            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSite.name}</h2>
                                    {selectedSite.address && (
                                        <p className="text-sm text-gray-500 flex items-start gap-2">
                                            <MapPin size={16} className="flex-shrink-0 mt-0.5"/>
                                            <span>{selectedSite.address}</span>
                                        </p>
                                    )}
                                </div>
                                <span
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${getHealthColor(selectedSite.health_status)}`}>
                                    {selectedSite.health_status.toUpperCase()}
                                </span>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <div className="flex gap-1 overflow-x-auto">
                                    {tabs.map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm transition-all whitespace-nowrap ${
                                                    activeTab === tab.id
                                                        ? 'text-primary border-b-2 border-primary'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                <Icon size={16}/>
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div>
                            {activeTab === 'overview' && <OverviewTab/>}
                            {activeTab === 'projects' && <ProjectsTab/>}
                            {activeTab === 'financials' && <FinancialsTab/>}
                            {activeTab === 'tasks' && <TasksTab/>}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CivilDashboard;