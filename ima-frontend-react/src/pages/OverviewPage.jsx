import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    BarChart3,
    FileCheck,
    Building2,
    Users,
    GraduationCap,
    ArrowRight,
    Loader2,
    Bell,
    AlertTriangle
} from 'lucide-react';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip as RechartsTooltip
} from 'recharts';

import securedAxiosInstance from '../services/SecuredAxiosInstance';

/* ================= STYLES ================= */

const PageWrapper = styled.div`
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 2rem 0;
`;

const NotificationWrapper = styled.div`
    position: relative;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: all 0.2s;

    &:hover {
        background: #f0f0f0;
    }
`;

const AlertBadge = styled.span`
    position: absolute;
    top: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background-color: #dc3545;
    border: 2px solid white;
    border-radius: 50%;
`;

const NotificationDropdown = styled.div`
    position: absolute;
    top: 55px;
    right: 0;
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    z-index: 1050;
    padding: 1.25rem;
`;

const StyledCard = styled.div`
    cursor: pointer;
    transition: all 0.25s ease-in-out;
    border-radius: 1rem;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }
`;

const SparklineWrapper = styled.div`
    width: 100%;
    height: 50px;
    margin-top: 15px;
`;

/* ================= HELPERS ================= */

const calculateStatsWithTrend = (items = [], dateKey = 'createdAt') => {
    const now = new Date();
    const trendData = [];
    let currentWeek = 0;
    let lastWeek = 0;

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        trendData.push({
            date: d.toISOString().split('T')[0],
            count: 0
        });
    }

    items.forEach(item => {
        if (!item?.[dateKey]) return;

        const itemDate = new Date(item[dateKey]);
        const dateStr = itemDate.toISOString().split('T')[0];

        const point = trendData.find(p => p.date === dateStr);
        if (point) point.count++;

        if (itemDate >= oneWeekAgo) currentWeek++;
        else if (itemDate >= twoWeeksAgo) lastWeek++;
    });

    let percentage = 0;
    if (lastWeek > 0) {
        percentage = ((currentWeek - lastWeek) / lastWeek) * 100;
    } else if (currentWeek > 0) {
        percentage = 100;
    }

    return {
        total: items.length,
        chartData: trendData,
        percentage: Math.round(percentage),
        isUp: currentWeek >= lastWeek
    };
};

/* ================= COMPONENT ================= */

const OverviewPage = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNotifs, setShowNotifs] = useState(false);

    const [data, setData] = useState({
        agreements: [],
        applications: [],
        students: [],
        companies: [],
        teachers: []
    });

    /* ================= API CALL ================= */

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [
                    agreementsRes,
                    applicationsRes,
                    studentsRes,
                    companiesRes,
                    teachersRes
                ] = await Promise.all([
                    securedAxiosInstance.get('/agreements'),
                    securedAxiosInstance.get('/applications'),
                    securedAxiosInstance.get('/students'),
                    securedAxiosInstance.get('/companies'),
                    securedAxiosInstance.get('/teachers')
                ]);

                setData({
                    agreements: agreementsRes.data || [],
                    applications: applicationsRes.data || [],
                    students: studentsRes.data || [],
                    companies: companiesRes.data || [],
                    teachers: teachersRes.data || []
                });

            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Erreur lors du chargement des données"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    /* ================= DERIVED DATA ================= */

    const { cards, alerts } = useMemo(() => {

        const convStats = calculateStatsWithTrend(data.agreements);
        const appStats = calculateStatsWithTrend(data.applications);

        const alerts = [];

        if (convStats.percentage <= -20) {
            alerts.push({ id: 1, msg: `Forte baisse des conventions (${convStats.percentage}%)` });
        }

        if (appStats.percentage <= -20) {
            alerts.push({ id: 2, msg: `Baisse des candidatures (${appStats.percentage}%)` });
        }

        if (data.companies.length === 0) {
            alerts.push({ id: 3, msg: "Aucune entreprise partenaire enregistrée" });
        }

        const cards = [
            { title: 'Statistiques', desc: 'Vue globale', icon: BarChart3, path: '/stats', color: 'text-primary' },
            { title: 'Conventions', desc: 'Dossiers de stage', icon: FileCheck, val: convStats.total, path: '/agreements', color: 'text-success', trend: convStats },
            { title: 'Candidatures', desc: 'Demandes étudiantes', icon: Building2, val: appStats.total, path: '/applications', color: 'text-warning', trend: appStats },
            { title: 'Étudiants', desc: 'Inscrits', icon: Users, val: data.students.length, path: '/students', color: 'text-info' },
            { title: 'Entreprises', desc: 'Partenaires', icon: Building2, val: data.companies.length, path: '/companies', color: 'text-secondary' },
            { title: 'Enseignants', desc: 'Encadreurs', icon: GraduationCap, val: data.teachers.length, path: '/teachers', color: 'text-dark' }
        ];

        return { cards, alerts };
    }, [data]);

    /* ================= UI STATES ================= */

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center mt-5">
                {error}
            </div>
        );
    }

    /* ================= RENDER ================= */

    return (
        <PageWrapper onClick={() => setShowNotifs(false)}>
            <div className="container">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold mb-1">Vue d’ensemble</h2>
                        <p className="text-muted m-0">Activité sur les 7 derniers jours</p>
                    </div>

                    <div className="position-relative">
                        <NotificationWrapper
                            role="button"
                            aria-label="Notifications"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowNotifs(!showNotifs);
                            }}
                        >
                            <Bell size={24} />
                            {alerts.length > 0 && <AlertBadge />}
                        </NotificationWrapper>

                        {showNotifs && (
                            <NotificationDropdown onClick={e => e.stopPropagation()}>
                                <h6 className="fw-bold mb-3">Alertes</h6>
                                {alerts.length > 0 ? alerts.map(a => (
                                    <div key={a.id} className="d-flex gap-2 mb-2 p-2 rounded bg-light border-start border-danger border-4">
                                        <AlertTriangle size={16} className="text-danger" />
                                        <small className="fw-bold">{a.msg}</small>
                                    </div>
                                )) : (
                                    <div className="text-muted small text-center">Aucune alerte</div>
                                )}
                            </NotificationDropdown>
                        )}
                    </div>
                </div>

                {/* CARDS */}
                <div className="row">
                    {cards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={i}>
                                <StyledCard
                                    className="card h-100 shadow-sm"
                                    tabIndex={0}
                                    onClick={() => navigate(card.path)}
                                >
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div className={`p-2 rounded bg-light ${card.color}`}>
                                                <Icon size={28} />
                                            </div>
                                            {card.val !== undefined && (
                                                <div className="text-end">
                                                    <h2 className="fw-bold m-0">{card.val}</h2>
                                                    {card.trend && (
                                                        <span className={`badge ms-2 ${card.trend.isUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                            {card.trend.isUp ? '↑' : '↓'} {Math.abs(card.trend.percentage)}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <h5 className="fw-bold">{card.title}</h5>
                                        <p className="text-muted small">{card.desc}</p>

                                        {card.trend && (
                                            <SparklineWrapper>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={card.trend.chartData}>
                                                        <RechartsTooltip contentStyle={{ fontSize: '11px' }} />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="count"
                                                            stroke={card.trend.isUp ? '#198754' : '#dc3545'}
                                                            strokeWidth={2.5}
                                                            dot={false}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </SparklineWrapper>
                                        )}

                                        <div className="mt-auto text-primary fw-bold small">
                                            Détails <ArrowRight size={14} className="ms-2" />
                                        </div>
                                    </div>
                                </StyledCard>
                            </div>
                        );
                    })}
                </div>

            </div>
        </PageWrapper>
    );
};

export default OverviewPage;
