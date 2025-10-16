// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Sheet, SheetContent, SheetHeader, SheetTitle, ScrollArea, Avatar, AvatarFallback, AvatarImage, Badge } from '@/components/ui';
// @ts-ignore;
import { MessageSquare, Tag, Clock } from 'lucide-react';

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange
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
  if (!lead) return null;
  return <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={lead.avatar} />
                <AvatarFallback>{lead.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{lead.name}</h3>
                <p className="text-sm text-muted-foreground">{lead.email}</p>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                <Badge className={getSourceColor(lead.source)}>{lead.source}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Last interaction: {lead.lastInteraction}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map(tag => <Badge key={tag} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>)}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Interaction History</h4>
              <div className="space-y-2">
                {lead.interactions.map((interaction, idx) => <div key={idx} className="border-l-2 pl-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">{interaction.type}</span>
                      <span className="text-muted-foreground">{interaction.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{interaction.content}</p>
                  </div>)}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground">{lead.notes}</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>;
}