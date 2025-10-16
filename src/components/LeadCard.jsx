// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, Button, Badge, Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
// @ts-ignore;
import { Clock } from 'lucide-react';

export function LeadCard({
  lead,
  onViewDetails
}) {
  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'new':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getSourceColor = source => {
    switch (source?.toLowerCase()) {
      case 'whatsapp':
        return 'bg-green-500';
      case 'facebook':
        return 'bg-blue-500';
      case 'instagram':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={lead.avatar} />
              <AvatarFallback>{lead.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{lead.name}</h3>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
              <p className="text-sm text-muted-foreground">{lead.phone}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onViewDetails(lead)}>
            View Details
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {lead.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge className={getSourceColor(lead.source)}>{lead.source}</Badge>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lead.lastInteraction}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>;
}