import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApiUrl } from '../../utils/api';

const TicketView = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(getApiUrl(`/bookings/${id}`));
        if (!res.ok) throw new Error('Failed to fetch ticket');
        const data = await res.json();
        setTicket(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24 }}>Error: {error}</div>;
  if (!ticket) return <div style={{ padding: 24 }}>Not found</div>;

  const allowed = (ticket.paymentStatus || '').toLowerCase() === 'paid';
  const bg = ticket?.temple?.image || ticket?.temple?.preview || '';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f6f2ea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        width: 420,
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          height: 160,
          color: '#fff',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>E‑Darshan Ticket</div>
            <div style={{ opacity: 0.8 }}>Booking Confirmation</div>
          </div>
          <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>{ticket._id}</div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{ticket.devoteeName || 'Devotee'}</div>
          <div style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: allowed ? '#0a7d32' : '#b45309',
            background: allowed ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
            border: `1px solid ${allowed ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}
          `}}
          >{allowed ? 'ALLOWED' : 'NOT ALLOWED'}</div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;


