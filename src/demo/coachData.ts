import { Coach } from '@/types';

export const SEED_COACHES: Coach[] = [
  {
    id: "c1",
    name: "Mike Thompson",
    roleTitle: "Offensive Line Coach",
    roleType: "POSITION",
    program: "Arizona State",
    level: "FBS",
    state: "AZ",
    verificationStatus: "VERIFIED_OPT_IN",
    contactMethods: [
      { type: "email", value: "mthompson@asu.edu", visibility: "PUBLIC" },
      { type: "phone", value: "(480) 555-1234", visibility: "GATED" },
      { type: "twitter", value: "@CoachMThompson", visibility: "PUBLIC" }
    ],
    bio: "15 years coaching OL at P5 level. Known for developing NFL tackles.",
    yearsExperience: 15
  },
  {
    id: "c2",
    name: "James Rodriguez",
    roleTitle: "Defensive Coordinator",
    roleType: "DC",
    program: "San Diego State",
    level: "FBS",
    state: "CA",
    verificationStatus: "CLAIMED",
    contactMethods: [
      { type: "email", value: "j.rodriguez@sdsu.edu", visibility: "GATED" },
      { type: "phone", value: "(619) 555-5678", visibility: "HIDDEN" }
    ],
    bio: "Multiple front pressure scheme specialist.",
    yearsExperience: 12
  },
  {
    id: "c3",
    name: "Chris Williams",
    roleTitle: "Head Coach",
    roleType: "HC",
    program: "Weber State",
    level: "FCS",
    state: "UT",
    verificationStatus: "VERIFIED_OPT_IN",
    contactMethods: [
      { type: "email", value: "cwilliams@weber.edu", visibility: "PUBLIC" },
      { type: "phone", value: "(801) 555-9012", visibility: "PUBLIC" },
      { type: "twitter", value: "@CoachCWilliams", visibility: "PUBLIC" }
    ],
    bio: "Built FCS playoff contender. Strong transfer portal pipeline.",
    yearsExperience: 18
  },
  {
    id: "c4",
    name: "David Chen",
    roleTitle: "Recruiting Coordinator",
    roleType: "RECRUITING",
    program: "Fresno State",
    level: "FBS",
    state: "CA",
    verificationStatus: "UNVERIFIED",
    contactMethods: [
      { type: "email", value: "dchen@fresnostate.edu", visibility: "GATED" }
    ],
    bio: "West coast recruiting specialist.",
    yearsExperience: 6
  },
  {
    id: "c5",
    name: "Marcus Johnson",
    roleTitle: "Wide Receivers Coach",
    roleType: "POSITION",
    program: "Boise State",
    level: "FBS",
    state: "ID",
    verificationStatus: "CLAIMED",
    contactMethods: [
      { type: "email", value: "mjohnson@boisestate.edu", visibility: "GATED" },
      { type: "twitter", value: "@CoachMJohnson", visibility: "PUBLIC" }
    ],
    bio: "Former NFL WR. Specializes in route development.",
    yearsExperience: 8
  },
  {
    id: "c6",
    name: "Robert Davis",
    roleTitle: "Offensive Coordinator",
    roleType: "OC",
    program: "Colorado State",
    level: "FBS",
    state: "CO",
    verificationStatus: "VERIFIED_OPT_IN",
    contactMethods: [
      { type: "email", value: "rdavis@colostate.edu", visibility: "PUBLIC" },
      { type: "phone", value: "(970) 555-3456", visibility: "GATED" }
    ],
    bio: "Tempo offense innovator. High scoring systems.",
    yearsExperience: 14
  },
  {
    id: "c7",
    name: "Anthony Miller",
    roleTitle: "Defensive Line Coach",
    roleType: "POSITION",
    program: "Southern Utah",
    level: "FCS",
    state: "UT",
    verificationStatus: "UNVERIFIED",
    contactMethods: [
      { type: "email", value: "amiller@suu.edu", visibility: "GATED" }
    ],
    yearsExperience: 5
  },
  {
    id: "c8",
    name: "Kevin Brown",
    roleTitle: "Head Coach",
    roleType: "HC",
    program: "Bakersfield JC",
    level: "JUCO",
    state: "CA",
    verificationStatus: "VERIFIED_OPT_IN",
    contactMethods: [
      { type: "email", value: "kbrown@bc.edu", visibility: "PUBLIC" },
      { type: "phone", value: "(661) 555-7890", visibility: "PUBLIC" }
    ],
    bio: "Strong JUCO-to-FBS pipeline. Known for developing talent.",
    yearsExperience: 20
  }
];
