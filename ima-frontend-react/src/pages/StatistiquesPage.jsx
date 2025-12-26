import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    BarChart3,
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

import { getStatusBadge } from '../styles/Util';

/* ================= STYLED COMPONENTS ================= */

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
`;

const StatIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

/* ================= STATUS META ================= */

const STATUS_META = {
    VALIDATED: { label: 'Validé', icon: ShieldCheck },
    PENDING_VALIDATION: { label: 'En attente', icon: Clock },
    DRAFT: { label: 'Brouillon', icon: FileEdit },
    SENT_FOR_SIGNATURE: { label: 'Envoyé', icon: Send },
    SIGNED: { label: 'Signé', icon: CheckCircle2 },
    CANCELED: { label: 'Annulé', icon: XCircle }
};

const STATUSES = [
    { key: 'DRAFT', field: 'draft' },
    { key: 'PENDING_VALIDATION', field: 'pendingValidation' },
    { key: 'VALIDATED', field: 'validated' },
    { key: 'SENT_FOR_SIGNATURE', field: 'sent' },
    { key: 'SIGNED', field: 'signed' },
    { key: 'CANCELED', field: 'canceled' }
];

/* ================= COMPONENT ================= */

const API_BASE_URL = 'http://localhost:8090/api/v1';

const StatistiquesPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        agreements: [],
        applications: [],
        monthlyChart: Array(12).fill(0),
        stats: {
        totalAgreements: 0,
        activeInternships: 0,
        totalStudents: 0,
        validationRate: 0,
        statusCounts: {
            draft: 0,
            pendingValidation: 0,
            validated: 0,
            sent: 0,
            signed: 0,
            canceled: 0
        }
        }
    });

    useEffect(() => {
        const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
            };

            const [agreementsRes, applicationsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/agreements`, { headers }),
            fetch(`${API_BASE_URL}/applications`, { headers })
            ]);

            if (!agreementsRes.ok || !applicationsRes.ok) {
            throw new Error('Erreur lors du chargement des données');
            }

            const agreements = await agreementsRes.json();
            const applications = await applicationsRes.json();

            const statusCounts = {
            draft: agreements.filter(a => a.status === 'DRAFT').length,
            pendingValidation: agreements.filter(a => a.status === 'PENDING_VALIDATION').length,
            validated: agreements.filter(a => a.status === 'VALIDATED').length,
            sent: agreements.filter(a => a.status === 'SENT_FOR_SIGNATURE').length,
            signed: agreements.filter(a => a.status === 'SIGNED').length,
            canceled: agreements.filter(a => a.status === 'CANCELED').length
            };

            const monthlyChart = Array(12).fill(0);
            applications.forEach(a => {
            if (a.createdAt) {
                monthlyChart[new Date(a.createdAt).getMonth()]++;
            }
            });

            setData({
            agreements,
            applications,
            monthlyChart,
            stats: {
                totalAgreements: agreements.length,
                activeInternships: applications.length,
                totalStudents: new Set(applications.map(a => a.studentId)).size,
                validationRate: agreements.length
                ? ((statusCounts.validated / agreements.length) * 100).toFixed(1)
                : 0,
                statusCounts
            }
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    /* ================= UI ================= */

    if (loading) {
        return (
        <Page className="d-flex justify-content-center align-items-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </Page>
        );
    }

    if (error) {
        return <p className="text-danger text-center">{error}</p>;
    }

    return (
        <Page>
            <div className="container">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">IMA Analytics</h2>
                        <p className="text-muted">Suivi des conventions et candidatures</p>
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary">
                        <Calendar size={16} /> Port 8090
                        </button>
                        <button className="btn btn-primary" disabled>
                        <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="row mb-4">
                    {[
                        { label: 'Conventions', value: data.stats.totalAgreements, icon: FileCheck },
                        { label: 'Candidatures', value: data.stats.activeInternships, icon: Building2 },
                        { label: 'Étudiants', value: data.stats.totalStudents, icon: Users },
                        { label: 'Taux validé', value: `${data.stats.validationRate}%`, icon: ShieldCheck }
                    ].map((kpi, i) => (
                        <div className="col-md-3 mb-3" key={i}>
                        <Card>
                            <div className="d-flex justify-content-between">
                            <div>
                                <small className="text-muted fw-bold">{kpi.label}</small>
                                <h4 className="fw-bold mt-2">{kpi.value}</h4>
                            </div>
                            <kpi.icon className="text-primary" />
                            </div>
                        </Card>
                        </div>
                    ))}
                </div>

                {/* STATUS BREAKDOWN */}
                <div className="row">
                    {STATUSES.map(({ key, field }) => {
                        const meta = STATUS_META[key];
                        const Icon = meta.icon;
                        const badgeClass = getStatusBadge(key);

                        return (
                            <div className="col-6 col-md-2 mb-3" key={key}>
                                <Card className="text-center">
                                <StatIcon className={`badge ${badgeClass} mb-2`}>
                                    <Icon size={14} />
                                </StatIcon>
                                <small className="text-muted fw-bold d-block">
                                    {meta.label}
                                </small>
                                <h4 className="fw-bold mt-1">
                                    {data.stats.statusCounts[field]}
                                </h4>
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
