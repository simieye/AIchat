// @ts-ignore;
import React from 'react';

// @ts-ignore;
import { LeadCard } from '@/components/LeadCard';
export function LeadList({
  leads,
  onViewDetails
}) {
  return <div className="grid gap-4">
      {leads.map(lead => <LeadCard key={lead.id} lead={lead} onViewDetails={onViewDetails} />)}
    </div>;
}