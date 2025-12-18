import { useAppStore } from '@/store/useAppStore';
import { Shield, Lock, Eye, FileText, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CompliancePage = () => {
  const { events } = useAppStore();

  // Show all events for comprehensive audit log
  const auditEvents = events.slice(0, 30);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-success" />
          Compliance & Audit
        </h1>
        <p className="text-muted-foreground">Track all actions and maintain compliance</p>
      </div>

      {/* Compliance Banner */}
      <div className="rounded-2xl border border-success/30 bg-success/10 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-success" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg mb-3">Compliance-first demo mode</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4 text-success shrink-0" />
                No bulk exports
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4 text-success shrink-0" />
                Locked contacts (approval required)
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4 text-success shrink-0" />
                Audit trail on every action
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-success shrink-0" />
                AI never invents contact info
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Locked Contact Example */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Protected Contact Information
        </h3>
        <div className="bg-secondary/50 rounded-lg p-4 relative overflow-hidden">
          <div className="blur-sm select-none">
            <p className="font-medium">John Smith - QB</p>
            <p className="text-sm text-muted-foreground">Phone: (555) 123-4567</p>
            <p className="text-sm text-muted-foreground">Email: john.smith@email.com</p>
            <p className="text-sm text-muted-foreground">Agent: Mike Johnson</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Contact Access Restricted</p>
              <p className="text-xs text-muted-foreground mt-1">Submit a request through the player profile</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30">
          <p className="text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <span>
              Contacts are permissioned. Requests are logged. Approvals required. 
              Demo intentionally hides real contact info.
            </span>
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Audit Log</h3>
          <span className="text-xs text-muted-foreground ml-auto">Last 30 events</span>
        </div>
        {auditEvents.length > 0 ? (
          <div className="divide-y divide-border">
            {auditEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      event.type === 'PORTAL_NEW' ? 'bg-primary/20' :
                      event.type === 'PORTAL_UPDATED' ? 'bg-warning/20' :
                      event.type === 'PORTAL_WITHDRAWN' ? 'bg-destructive/20' :
                      event.type === 'TASK_CREATED' ? 'bg-primary/20' :
                      event.type === 'PLAYER_REVIEWED' ? 'bg-success/20' :
                      event.type === 'CONTACT_REQUESTED' ? 'bg-warning/20' :
                      'bg-muted'
                    }`}>
                      {event.type.startsWith('PORTAL') && <FileText className="w-4 h-4 text-primary" />}
                      {event.type === 'TASK_CREATED' && <FileText className="w-4 h-4 text-primary" />}
                      {event.type === 'PLAYER_REVIEWED' && <Eye className="w-4 h-4 text-success" />}
                      {event.type === 'CONTACT_REQUESTED' && <Lock className="w-4 h-4 text-warning" />}
                      {event.type === 'AGENT_QUERY' && <Shield className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(event.ts), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No audit events recorded yet</p>
            <p className="text-sm mt-1">Actions like creating tasks, reviewing players, or requesting contact will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompliancePage;
