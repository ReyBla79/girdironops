import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Coach, CoachLevel, CoachRoleType, VerificationStatus } from '@/types';

const VERIFICATION_COLORS: Record<VerificationStatus, string> = {
  VERIFIED_OPT_IN: 'bg-chart-1 text-primary-foreground',
  CLAIMED: 'bg-chart-2 text-primary-foreground',
  UNVERIFIED: 'bg-muted text-muted-foreground',
};

const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  VERIFIED_OPT_IN: 'Verified',
  CLAIMED: 'Claimed',
  UNVERIFIED: 'Unverified',
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

const NetworkPage = () => {
  const navigate = useNavigate();
  const { coaches } = useAppStore();
  
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');

  const states = [...new Set(coaches.map(c => c.state))].sort();
  
  const filteredCoaches = coaches.filter(coach => {
    if (levelFilter !== 'all' && coach.level !== levelFilter) return false;
    if (roleFilter !== 'all' && coach.roleType !== roleFilter) return false;
    if (stateFilter !== 'all' && coach.state !== stateFilter) return false;
    if (verificationFilter !== 'all' && coach.verificationStatus !== verificationFilter) return false;
    return true;
  });

  const getContactPreview = (coach: Coach) => {
    const publicContact = coach.contactMethods.find(m => m.visibility === 'PUBLIC');
    if (publicContact) {
      return publicContact.value;
    }
    const gatedContact = coach.contactMethods.find(m => m.visibility === 'GATED');
    if (gatedContact) {
      return maskContact(gatedContact.value, gatedContact.type);
    }
    return '(Request access)';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Verified Coaching Network</h1>
        <p className="text-muted-foreground mt-1">Demo directory (synthetic data). Contacts are permissioned + logged.</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Level</label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="FBS">FBS</SelectItem>
                  <SelectItem value="FCS">FCS</SelectItem>
                  <SelectItem value="D2">D2</SelectItem>
                  <SelectItem value="D3">D3</SelectItem>
                  <SelectItem value="JUCO">JUCO</SelectItem>
                  <SelectItem value="HS">HS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Role Type</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="HC">Head Coach</SelectItem>
                  <SelectItem value="OC">Off. Coordinator</SelectItem>
                  <SelectItem value="DC">Def. Coordinator</SelectItem>
                  <SelectItem value="POSITION">Position Coach</SelectItem>
                  <SelectItem value="RECRUITING">Recruiting</SelectItem>
                  <SelectItem value="ANALYST">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">State</label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Verification</label>
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="VERIFIED_OPT_IN">Verified</SelectItem>
                  <SelectItem value="CLAIMED">Claimed</SelectItem>
                  <SelectItem value="UNVERIFIED">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coach Directory Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Coach Directory ({filteredCoaches.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoaches.map((coach) => (
                  <TableRow 
                    key={coach.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => navigate(`/app/network/coach/${coach.id}`)}
                  >
                    <TableCell className="font-medium">{coach.name}</TableCell>
                    <TableCell>{coach.roleTitle}</TableCell>
                    <TableCell>{coach.program}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{coach.level}</Badge>
                    </TableCell>
                    <TableCell>{coach.state}</TableCell>
                    <TableCell>
                      <Badge className={VERIFICATION_COLORS[coach.verificationStatus]}>
                        {VERIFICATION_LABELS[coach.verificationStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getContactPreview(coach)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Hint Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Why contacts are gated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-chart-1" />
              Opt-in/verified contacts only
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-chart-2" />
              No bulk export
            </li>
            <li className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-primary" />
              Every access is audited
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              Coach can claim/opt-out
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkPage;
