import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import securedAxiosInstance from '../services/SecuredAxiosInstance';

import {
    Users,
    FileCheck,
    Building2,
    Calendar,
    Download,
    Loader2,
    Clock,
    CheckCircle2,
    XCircle,
    Send,
    FileEdit,
    ShieldCheck
} from 'lucide-react';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';

import { getStatusBadge } from '../styles/Util.js';

/* ================= STYLES ================= */

const Page = styled.div`
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 2rem;
`;

const Card = styled.div`
    background: #ffffff;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    height: 100%;
    transition: transform 0.2s;
    &:hover { transform: translateY(-2px); }
`;

const StatIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

/* ================= CONSTANTES ================= */

const STATUS_META = {
    VALIDATED: { label: 'Validé', icon: ShieldCheck, color: '#198754' },
    PENDING_VALIDATION: { label: 'En attente', icon: Clock, color: '#ffc107' },
    DRAFT: { label: 'Brouillon', icon: FileEdit, color: '#6c757d' },
    SENT_FOR_SIGNATURE: { label: 'Envoyé', icon: Send, color: '#0d6efd' },
    SIGNED: { label: 'Signé', icon: CheckCircle2, color: '#0dcaf0' },
    CANCELED: { label: 'Annulé', icon: XCircle, color: '#dc3545' }
};

const STATUSES = [
    { key: 'DRAFT', field: 'draft' },
    { key: 'PENDING_VALIDATION', field: 'pendingValidation' },
    { key: 'VALIDATED', field: 'validated' },
    { key: 'SENT_FOR_SIGNATURE', field: 'sent' },
    { key: 'SIGNED', field: 'signed' },
    { key: 'CANCELED', field: 'canceled' }
];

const STATUS_FIELD_MAP = {
    DRAFT: 'draft',
    PENDING_VALIDATION: 'pendingValidation',
    VALIDATED: 'validated',
    SENT_FOR_SIGNATURE: 'sent',
    SIGNED: 'signed',
    CANCELED: 'canceled'
};

const MONTHS = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
];

/* ================= COMPONENT ================= */

const StatistiquesPage = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rawData, setRawData] = useState({ agreements: [], applications: [] });

    /* ================= FETCH (AXIOS + INTERCEPTOR) ================= */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agreementsRes, applicationsRes] = await Promise.all([
                    securedAxiosInstance.get('/agreements'),
                    securedAxiosInstance.get('/applications')
                ]);

                setRawData({
                    agreements: agreementsRes.data || [],
                    applications: applicationsRes.data || []
                });
            } catch (err) {
                console.error('Erreur StatistiquesPage:', err);
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Erreur de chargement des statistiques'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* ================= STATS ================= */

    const stats = useMemo(() => {
        const statusCounts = {
            draft: 0,
            pendingValidation: 0,
            validated: 0,
            sent: 0,
            signed: 0,
            canceled: 0
        };

        const monthlyCounts = Array(12).fill(0);

        rawData.agreements.forEach(({ status }) => {
            const field = STATUS_FIELD_MAP[status];
            if (field) statusCounts[field]++;
        });

        rawData.applications.forEach(({ createdAt }) => {
            if (createdAt) {
                const monthIndex = new Date(createdAt).getMonth();
                monthlyCounts[monthIndex]++;
            }
        });

        const totalAgreements = rawData.agreements.length;

        return {
            totalAgreements,
            totalApplications: rawData.applications.length,
            totalStudents: new Set(
                rawData.applications.map(a => a.studentId).filter(Boolean)
            ).size,
            validationRate: totalAgreements
                ? ((statusCounts.validated / totalAgreements) * 100).toFixed(1)
                : 0,
            statusCounts,
            chartData: MONTHS.map((name, i) => ({
                name,
                total: monthlyCounts[i]
            })),
            pieData: STATUSES.map(s => ({
                name: STATUS_META[s.key].label,
                value: statusCounts[s.field],
                color: STATUS_META[s.key].color
            })).filter(d => d.value > 0)
        };
    }, [rawData]);

    /* ================= STATES ================= */

    if (loading) {
        return (
            <Page className="d-flex justify-content-center align-items-center">
                <Loader2 className="animate-spin text-primary" size={50} />
            </Page>
        );
    }

    if (error) {
        return (
            <Page className="d-flex justify-content-center align-items-center text-center">
                <div>
                    <XCircle className="text-danger mb-3" size={48} />
                    <h4 className="fw-bold">Erreur de chargement</h4>
                    <p className="text-muted">{error}</p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => window.location.reload()}
                    >
                        Réessayer
                    </button>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className="container">
                
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold m-0 text-dark">IMA Analytics</h2>
                        <p className="text-muted m-0">Suivi en temps réel des conventions</p>
                    </div>
                    <div className="d-flex gap-2">
                        <div className="d-none d-md-flex align-items-center px-3 rounded bg-white border">
                            <Calendar size={16} className="text-primary me-2" />
                            <small className="fw-bold">Session 2024-2025</small>
                        </div>
                        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
                            <Download size={16} /> <span className="d-none d-sm-inline">Export PDF</span>
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="row mb-4">
                    {[
                        { label: 'Conventions', value: stats.totalAgreements, icon: FileCheck },
                        { label: 'Candidatures', value: stats.totalApplications, icon: Building2 },
                        { label: 'Étudiants', value: stats.totalStudents, icon: Users },
                        { label: 'Taux Validé', value: `${stats.validationRate}%`, icon: ShieldCheck }
                    ].map((kpi, i) => (
                        <div className="col-6 col-md-3 mb-3" key={i}>
                            <Card>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <p className="text-muted text-uppercase fw-bold mb-1" style={{fontSize: '0.65rem'}}>
                                            {kpi.label}
                                        </p>
                                        <h3 className="fw-bold m-0">{kpi.value}</h3>
                                    </div>
                                    <div className="p-2 bg-light rounded text-primary">
                                        <kpi.icon size={20} />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* GRAPHIQUES */}
                <div className="row mb-4">
                    <div className="col-lg-8 mb-3">
                        <Card>
                            <h6 className="fw-bold mb-4">Volume des candidatures par mois</h6>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                                        <Tooltip 
                                            cursor={{fill: '#f8f9fa'}} 
                                            contentStyle={{borderRadius: '8px', border:'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                                        />
                                        <Bar dataKey="total" fill="#0d6efd" radius={[4, 4, 0, 0]} barSize={35}>
                                            {stats.chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.total === 0 ? '#eee' : '#0d6efd'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                    <div className="col-lg-4 mb-3">
                        <Card>
                            <h6 className="fw-bold mb-4">Répartition par statut</h6>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={stats.pieData} 
                                            innerRadius={65} 
                                            outerRadius={85} 
                                            paddingAngle={5} 
                                            dataKey="value"
                                        >
                                            {stats.pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '20px'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* DÉTAIL DES STATUTS */}
                <div className="row">
                    {STATUSES.map(({ key, field }) => {
                        const meta = STATUS_META[key];
                        const Icon = meta.icon;
                        return (
                            <div className="col-6 col-md-4 col-lg-2 mb-3" key={key}>
                                <Card className="text-center p-3">
                                    <StatIcon className={`mx-auto mb-2 ${getStatusBadge(key)}`}>
                                        <Icon size={16} />
                                    </StatIcon>
                                    <small className="text-muted d-block text-truncate mb-1">{meta.label}</small>
                                    <h5 className="fw-bold m-0">{stats.statusCounts[field]}</h5>
                                </Card>
                            </div>
                        );
                    })}
                </div>

            </div>
        </Page>
    );
};

export default StatistiquesPage;