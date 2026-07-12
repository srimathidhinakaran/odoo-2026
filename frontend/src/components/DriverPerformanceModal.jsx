import { X, Star, AlertTriangle, Droplet, Clock, CheckCircle } from 'lucide-react';

const DriverPerformanceModal = ({ driverId, driverName, onClose }) => {
  // Mock performance data based on driverId
  // In a real application, this would be fetched from an API
  
  // Use driverId's last few chars to generate somewhat deterministic mock data
  const seed = parseInt(driverId.substring(driverId.length - 4), 16) || 100;
  
  const performance = {
    safetyScore: Math.min(100, Math.max(50, 85 + (seed % 15) - 5)),
    tripsCompleted: 120 + (seed % 50),
    accidents: seed % 10 === 0 ? 1 : 0,
    fuelEfficiency: (12 + (seed % 5) * 0.5).toFixed(1),
    lateDeliveries: seed % 5,
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--success)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel animate-fade-in" style={{ width: '500px', padding: '30px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={24} color="var(--warning)" /> {driverName}'s Performance
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Main Score Card */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Overall Safety Score</div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={16} color={star <= Math.round(performance.safetyScore / 20) ? 'var(--warning)' : 'rgba(255,255,255,0.2)'} fill={star <= Math.round(performance.safetyScore / 20) ? 'var(--warning)' : 'none'} />
                ))}
              </div>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: getScoreColor(performance.safetyScore) }}>
              {performance.safetyScore}%
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
              <CheckCircle size={16} color="var(--success)" /> Trips Completed
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{performance.tripsCompleted}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
              <Droplet size={16} color="var(--accent-primary)" /> Fuel Efficiency
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{performance.fuelEfficiency} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>km/l</span></div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
              <Clock size={16} color="var(--warning)" /> Late Deliveries
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{performance.lateDeliveries}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
              <AlertTriangle size={16} color="var(--danger)" /> Accidents
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: performance.accidents > 0 ? 'var(--danger)' : 'white' }}>{performance.accidents}</div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Performance metrics are updated weekly based on telematics data and feedback.
        </div>
      </div>
    </div>
  );
};

export default DriverPerformanceModal;
