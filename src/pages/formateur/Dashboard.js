import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle } from 'lucide-react';

const FormateurDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalPresentations: 0, completedPresentations: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, presRes] = await Promise.all([
          axios.get('http://localhost:3001/users?role=etudiant'),
          axios.get('http://localhost:3001/presentations')
        ]);
        
        setStats({
          totalStudents: usersRes.data.length,
          totalPresentations: presRes.data.length,
          completedPresentations: presRes.data.filter(p => p.status === 'completed').length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Vue d'ensemble</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-lg)', color: 'var(--accent-primary)' }}>
            <Users size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Étudiants</p>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{stats.totalStudents}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: 'var(--radius-lg)', color: 'var(--accent-secondary)' }}>
            <FileText size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Présentations</p>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{stats.totalPresentations}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-lg)', color: 'var(--accent-success)' }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Terminées</p>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{stats.completedPresentations}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormateurDashboard;
