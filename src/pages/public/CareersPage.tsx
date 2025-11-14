import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Mail } from "lucide-react";

const jobs = [
  {
    id: "reporter",
    title: "News Reporter",
    location: "Lucknow, UP",
    type: "Full-time",
    email: "careers@upudaynews.com",
    description:
      "Cover breaking news, develop sources, and produce timely, accurate reporting across beats.",
    requirements: [
      "Bachelor's in Journalism or related field",
      "Strong writing and interviewing skills",
      "Comfortable with deadlines and field reporting",
    ],
  },
  {
    id: "editor",
    title: "Sub-Editor",
    location: "Noida, UP",
    type: "Full-time",
    email: "hr@upudaynews.com",
    description:
      "Edit and fact-check stories, write compelling headlines, and ensure style consistency.",
    requirements: [
      "2+ years editing experience",
      "Strong grasp of AP style or equivalent",
      "Attention to detail and story structure",
    ],
  },
  {
    id: "social",
    title: "Social Media Manager",
    location: "Remote",
    type: "Contract",
    email: "careers@upudaynews.com",
    description:
      "Own social channels, create content calendars, and grow audience engagement across platforms.",
    requirements: [
      "Experience with Twitter, Facebook, Instagram, YouTube",
      "Analytics and content strategy skills",
      "Basic design/video editing is a plus",
    ],
  },
];

const CareersPage = () => {
  const handleApply = (email: string, role: string) => {
    const subject = encodeURIComponent(`Resume Application: ${role}`);
    const body = encodeURIComponent(
      `Hello UP Uday News Team,\n\nI would like to apply for the ${role} position. Please find my resume attached.\n\nName: \nEmail: \nPhone: \nLinkedIn/Portfolio: \n\nThank you!`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <Badge className="bg-brand-600">We’re Hiring</Badge>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-brand-800">Careers at UP Uday News</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Join a fast-moving newsroom committed to truth, clarity, and impact across Uttar Pradesh and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-brand-600" /> {job.title}
                  </CardTitle>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground mb-3">{job.description}</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2">
                  <Button onClick={() => handleApply(job.email, job.title)} className="bg-brand-600 hover:bg-brand-700">
                    <Mail className="h-4 w-4 mr-2" /> Apply via Email
                  </Button>
                  <span className="text-xs text-muted-foreground">Send resume to {job.email}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Don’t see a role that fits? Email us at <span className="font-medium">careers@upudaynews.com</span>
            with your resume and interests.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default CareersPage;