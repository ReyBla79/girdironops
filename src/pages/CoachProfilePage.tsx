import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Phone, Twitter, Lock, CheckCircle, AlertCircle, Shield, Clock } from 'lucide-react';
import { VerificationStatus, ContactMethod } from '@/types';
import { format } from 'date-fns';

const VERIFICATION_COLORS: Record<VerificationStatus, string> = {
  VERIFIED_OPT_IN: 'bg-chart-1 text-primary-foreground',
  CLAIMED: 'bg-chart-2 text-primary-foreground',
  UNVERIFIED: 'bg-muted text-muted-foreground',
};

const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  VERIFIED_OPT_IN: 'Verified & Opted-In',
  CLAIMED: 'Claimed Profile',
  UNVERIFIED: 'Unverified',
};

const ContactIcon = ({ type }: { type: ContactMethod['type'] }) => {
  switch (type) {
    case 'email': return <Mail className="w-4 h-4" />;
    case 'phone': return <Phone className="w-4 h-4" />;
    case 'twitter': return <Twitter className="w-4 h-4" />;
  }
};

const maskContact = (value: string, type: string) => {
  if (type === 'email') {
    const [local, domain] = value.split('@');
    return `${local.slice(0, 2)}***@${domain}`;
  }
  if (type === 'phone') {
    return value.slice(0, 5) + '***-****';
  }
  return value;
};

const CoachProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { coaches, events, addEvent, createContactAccessRequest } = useAppStore();

  const coach = coaches.find(c => c.id === id);

  if (!coach) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Coach not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/app/network')}>
          Back to Network
        </Button>
      </div>
    );
  }

  const networkEvents = events.filter(e => e.coachId === coach.id).slice(0, 10);

  const handleRequestAccess = () => {
    createContactAccessRequest(coach.id);
    toast({
      title: "Request submitted (demo)",
      description: "Logged for compliance. Approval pending.",
    });
  };

  const handleGenerateOutreach = (mode: 'email' | 'sms') => {
    addEvent({
      type: 'OUTREACH_DRAFTED',
      coachId: coach.id,
      message: `${mode.toUpperCase()} outreach draft created for ${coach.name}`,
    });
    toast({
      title: `${mode === 'email' ? 'Email' : 'SMS'} draft ready (demo)`,
      description: "Outreach logged. Template generated.",
    });
  };

  const canViewFullContact = (method: ContactMethod) => {
    return method.visibility === 'PUBLIC' || 
      (coach.verificationStatus === 'VERIFIED_OPT_IN' && method.visibility === 'GATED');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/app/network')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Network
      </Button>

      {/* Coach Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-display font-bold">{coach.name}</h1>
                <Badge className={VERIFICATION_COLORS[coach.verificationStatus]}>
                  {VERIFICATION_LABELS[coach.verificationStatus]}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">{coach.roleTitle}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="font-medium">{coach.program}</span>
                <Badge variant="outline">{coach.level}</Badge>
                <span>{coach.state}</span>
              </div>
              {coach.bio && (
                <p className="mt-4 text-muted-foreground">{coach.bio}</p>
              )}
              {coach.yearsExperience && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {coach.yearsExperience} years experience
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Methods */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Contact Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coach.contactMethods.map((method, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <ContactIcon type={method.type} />
                  <span className="capitalize text-sm font-medium">{method.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  {canViewFullContact(method) ? (
                    <>
                      <span className="text-sm">{method.value}</span>
                      <CheckCircle className="w-4 h-4 text-chart-1" />
                    </>
                  ) : method.visibility === 'HIDDEN' ? (
                    <>
                      <span className="text-sm text-muted-foreground">(Hidden)</span>
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-muted-foreground">{maskContact(method.value, method.type)}</span>
                      <Lock className="w-4 h-4 text-chart-2" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {coach.contactMethods.some(m => m.visibility !== 'PUBLIC') && (
            <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Some contacts require approval. Request access below.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleRequestAccess}>
              Request Full Contact Access
            </Button>
            <Button variant="secondary" onClick={() => handleGenerateOutreach('email')}>
              Generate Intro Email
            </Button>
            <Button variant="ghost" onClick={() => handleGenerateOutreach('sms')}>
              Generate Intro SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Mini */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Activity Log (This Coach)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {networkEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity logged yet.</p>
          ) : (
            <div className="space-y-2">
              {networkEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/50">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{event.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.ts), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachProfilePage;
