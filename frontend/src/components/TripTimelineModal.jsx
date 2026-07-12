import { X, CheckCircle, Clock, Truck, MapPin, Package } from 'lucide-react';

const TripTimelineModal = ({ trip, onClose }) => {
  if (!trip) return null;

  // Determine which steps are active based on trip status
  const steps = [
    { id: 1, title: 'Trip Created', description: 'Origin and Destination set', icon: Package, status: 'completed' },
    { id: 2, title: 'Resources Assigned', description: `${trip.vehicle?.registrationNumber || 'Vehicle'} and ${trip.driver?.name || 'Driver'} assigned`, icon: Truck, status: 'completed' },
    { id: 3, title: 'In Transit', description: 'Trip is currently on the way', icon: MapPin, status: trip.status === 'Completed' ? 'completed' : (trip.status === 'In Progress' ? 'active' : 'pending') },
    { id: 4, title: 'Completed', description: `Arrived at ${trip.destination}`, icon: CheckCircle, status: trip.status === 'Completed' ? 'completed' : 'pending' }
  ];

  if (trip.status === 'Cancelled') {
    steps[2] = { id: 3, title: 'Cancelled', description: 'Trip was cancelled', icon: X, status: 'cancelled' };
    steps[3] = { id: 4, title: '-', description: '-', icon: Clock, status: 'pending' };
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel animate-fade-in" style={{ width: '450px', padding: '30px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
          Timeline: {trip.origin} to {trip.destination}
        </h2>

        <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--glass-border)', marginLeft: '16px' }}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            let iconColor = 'var(--text-secondary)';
            let iconBg = 'rgba(255,255,255,0.05)';
            
            if (step.status === 'completed') {
              iconColor = 'white';
              iconBg = 'var(--success)';
            } else if (step.status === 'active') {
              iconColor = 'white';
              iconBg = 'var(--accent-primary)';
            } else if (step.status === 'cancelled') {
              iconColor = 'white';
              iconBg = 'var(--danger)';
            }

            return (
              <div key={step.id} style={{ position: 'relative', marginBottom: index === steps.length - 1 ? 0 : '32px' }}>
                <div style={{ 
                  position: 'absolute', left: '-36px', top: '0', 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '4px solid var(--bg-primary)'
                }}>
                  <Icon size={16} color={iconColor} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: step.status === 'pending' ? 'var(--text-secondary)' : 'white' }}>{step.title}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripTimelineModal;
