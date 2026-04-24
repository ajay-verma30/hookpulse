import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ title, value, color, icon }) => {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
        <div className={`text-${color} mb-2`} style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {title}
        </div>
        <h2 className="mb-0" style={{ fontWeight: '800' }}>{value}</h2>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;