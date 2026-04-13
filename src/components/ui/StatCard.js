import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard — Carte de statistique premium
 * Props:
 *   icon      — React element (Lucide icon)
 *   label     — String: titre de la stat
 *   value     — String/Number: valeur principale
 *   trend     — Number (optional): pourcentage de tendance (+/-)
 *   color     — 'blue' | 'cyan' | 'orange' | 'success' | 'warning' | 'danger'
 *   subtitle  — String (optional)
 */
const COLOR_MAP = {
  blue:    { bg: 'rgba(0,63,127,0.15)',    color: 'var(--ofppt-blue-light)', glow: 'rgba(0,63,127,0.3)' },
  cyan:    { bg: 'rgba(0,168,225,0.12)',   color: 'var(--ofppt-cyan)',       glow: 'rgba(0,168,225,0.25)' },
  orange:  { bg: 'rgba(255,107,53,0.12)',  color: 'var(--ofppt-orange)',     glow: 'rgba(255,107,53,0.25)' },
  success: { bg: 'rgba(34,197,94,0.1)',    color: 'var(--success)',          glow: 'rgba(34,197,94,0.2)' },
  warning: { bg: 'rgba(245,158,11,0.1)',   color: 'var(--warning)',          glow: 'rgba(245,158,11,0.2)' },
  danger:  { bg: 'rgba(239,68,68,0.1)',    color: 'var(--danger)',           glow: 'rgba(239,68,68,0.2)' },
};

const StatCard = ({ icon, label, value, trend, color = 'cyan', subtitle, onClick }) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.cyan;

  const trendColor = trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--danger)' : 'var(--text-muted)';
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        background: `linear-gradient(135deg, var(--bg-card) 0%, rgba(10,15,30,0.9) 100%)`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Glow accent top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${colors.color}, transparent)`,
      }} />

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: colors.bg,
        filter: `blur(30px)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.78rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-tertiary)',
            marginBottom: '0.6rem',
          }}>
            {label}
          </div>

          <div style={{
            fontSize: '2.2rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1,
            marginBottom: '0.4rem',
            animation: 'countUp 0.5s ease-out',
          }}>
            {value}
          </div>

          {subtitle && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {subtitle}
            </div>
          )}

          {trend !== undefined && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              marginTop: '0.75rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: trend > 0 ? 'var(--success-bg)' : trend < 0 ? 'var(--danger-bg)' : 'var(--surface-1)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: trendColor,
            }}>
              <TrendIcon size={12} />
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>

        {/* Icon */}
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 'var(--radius-lg)',
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.color,
          boxShadow: `0 4px 15px ${colors.glow}`,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
