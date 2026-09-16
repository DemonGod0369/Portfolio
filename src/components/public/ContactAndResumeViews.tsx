import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Send, CheckCircle2, MapPin, Mail, ArrowLeft, Shield, Printer, Phone, MessageCircle, Download, Calendar } from 'lucide-react';
import { downloadVisitingCardImage } from '../../utils/seoAndQrUtils';

export const ContactView: React.FC = () => {
  const { profile, submitContactMessage } = useData();

  const showPrimaryPhone = (profile.phoneDisplayOption === 'both' || profile.phoneDisplayOption === 'primary' || !profile.phoneDisplayOption) && Boolean(profile.phone);
  const showSecondaryPhone = (profile.phoneDisplayOption === 'both' || profile.phoneDisplayOption === 'secondary') && Boolean(profile.secondaryPhone);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // anti-bot spam field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await submitContactMessage(formData);
    setIsSubmitting(false);

    if (result.success) {
      setSubmittedSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        <div className="space-y-4 border-b border-[#1E293B] pb-10 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
            <span className="w-2 h-[1px] bg-[#00E5FF]" />
            Inquiries & Opportunities
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F8FAFC] uppercase">
            Let's Connect
          </h1>
          <p className="text-sm md:text-base text-[#94A3B8] leading-relaxed">
            Have a project, idea, question or collaboration opportunity? Send a direct note below.
          </p>
        </div>

        {/* Minimalist Split Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                Direct Communication
              </h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Whether you're looking for tailored web design, technical consultation, trade digitization advice, or want to exchange thoughts, I respond directly to every genuine inquiry.
              </p>
            </div>

            <div className="space-y-4 border-t border-[#131F37] pt-6 font-mono text-xs text-[#94A3B8]">
              {/* Address / Location (Availability and Timezone removed) */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0B132B] border border-[#1E293B] rounded-lg text-[#00E5FF]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase">Address & Location</span>
                  <span className="text-[#F8FAFC]">
                    {profile.address || profile.location || 'Kathmandu, Nepal'}
                  </span>
                </div>
              </div>

              {/* Date of Birth (if specified) */}
              {profile.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0B132B] border border-[#1E293B] rounded-lg text-[#00E5FF]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase">Date of Birth</span>
                    <span className="text-[#F8FAFC]">
                      {new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              )}

              {/* Primary Contact Number (Visibility-controlled) */}
              {showPrimaryPhone && (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0B132B] border border-[#1E293B] rounded-lg text-[#00E5FF]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase">Primary Contact Number</span>
                    <a href={`tel:${profile.phone!.replace(/\s+/g, '')}`} className="text-[#F8FAFC] hover:text-[#00E5FF] transition-colors">
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Secondary Contact Number (Visibility-controlled) */}
              {showSecondaryPhone && (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0B132B] border border-[#1E293B] rounded-lg text-[#94A3B8]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase">Secondary Direct Line</span>
                    <a href={`tel:${profile.secondaryPhone!.replace(/\s+/g, '')}`} className="text-[#F8FAFC] hover:text-[#00E5FF] transition-colors">
                      {profile.secondaryPhone}
                    </a>
                  </div>
                </div>
              )}

              {/* Primary Email */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0B132B] border border-[#1E293B] rounded-lg text-[#00E5FF]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B] text-[10px] uppercase">Primary Email</span>
                    {profile.primaryEmailLabel && (
                      <span className="text-[10px] text-[#00E5FF] px-1.5 py-0.2 bg-[#0B132B] border border-[#1E293B] rounded">
                        {profile.primaryEmailLabel}
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${profile.email}`} className="text-[#F8FAFC] hover:text-[#00E5FF] transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>

              {/* Alternate Email */}
              {profile.alternateEmail && (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0B132B] border border-[#1E293B] rounded-lg text-[#38BDF8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B] text-[10px] uppercase">Alternate Email</span>
                      {profile.alternateEmailLabel && (
                        <span className="text-[10px] text-[#38BDF8] px-1.5 py-0.2 bg-[#0B132B] border border-[#1E293B] rounded">
                          {profile.alternateEmailLabel}
                        </span>
                      )}
                    </div>
                    <a href={`mailto:${profile.alternateEmail}`} className="text-[#F8FAFC] hover:text-[#38BDF8] transition-colors">
                      {profile.alternateEmail}
                    </a>
                  </div>
                </div>
              )}

              {/* Quick Actions (WhatsApp Direct & Download Visiting Card) */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {profile.whatsappNumber !== 'none' && (profile.phone || profile.secondaryPhone) && (
                  <a
                    href={`https://wa.me/${(profile.whatsappNumber === 'secondary' && profile.secondaryPhone ? profile.secondaryPhone : profile.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0B132B] hover:bg-[#1E293B] border border-[#10B981]/40 hover:border-[#10B981] text-[#10B981] text-xs font-mono rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Direct</span>
                  </a>
                )}

                {profile.visitingCardImageUrl && (
                  <button
                    type="button"
                    onClick={() => downloadVisitingCardImage(profile.visitingCardImageUrl!, profile.name)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#00E5FF]/10 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-[#050814] border border-[#00E5FF]/30 hover:border-[#00E5FF] text-xs font-mono font-semibold rounded-lg transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Visiting Card</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 bg-[#0B132B] border border-[#1E3A5F] rounded-xl space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase">
                <Shield className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Security & Privacy</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                All inquiries are encrypted in transit and routed directly to my private admin inbox. Your contact details are never shared or published.
              </p>
            </div>
          </div>

          {/* Right Column: Protected Form */}
          <div className="lg:col-span-7 bg-[#0B132B] border border-[#1E293B] p-8 md:p-10 rounded-2xl shadow-xl">
            {submittedSuccess ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
                <h3 className="text-2xl font-bold text-[#F8FAFC]">
                  Message Received
                </h3>
                <p className="text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Your message has been logged securely and I will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] rounded-md mt-4 font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field for bot deterrence */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="phone_confirmation_token"
                    tabIndex={-1}
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    autoComplete="off"
                  />
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono rounded-md">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                      Your Name <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-4 py-3 bg-[#050814] border border-[#1E293B] focus:border-[#00E5FF] text-[#F8FAFC] placeholder-[#475569] rounded-md text-sm focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                      Email Address <span className="text-[#00E5FF]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={254}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-[#050814] border border-[#1E293B] focus:border-[#00E5FF] text-[#F8FAFC] placeholder-[#475569] rounded-md text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                    Subject
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Advisory / Feedback"
                    className="w-full px-4 py-3 bg-[#050814] border border-[#1E293B] focus:border-[#00E5FF] text-[#F8FAFC] placeholder-[#475569] rounded-md text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                    <label className="uppercase tracking-wider">
                      Message <span className="text-[#00E5FF]">*</span>
                    </label>
                    <span className="text-[#64748B]">{formData.message.length} / 5000</span>
                  </div>
                  <textarea
                    required
                    rows={5}
                    maxLength={5000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, timeline, or thoughts in detail..."
                    className="w-full px-4 py-3 bg-[#050814] border border-[#1E293B] focus:border-[#00E5FF] text-[#F8FAFC] placeholder-[#475569] rounded-md text-sm focus:outline-none transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-bold uppercase tracking-wider text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00E5FF] disabled:opacity-50 transition-all duration-200 rounded-md flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Securing & Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResumeView: React.FC = () => {
  const { profile, experiences, educations, skillCategories, skills, setCurrentRoute } = useData();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 md:px-10 space-y-12">
        {/* Actions header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-8 print:hidden">
          <button
            onClick={() => setCurrentRoute('home')}
            className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#00E5FF] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0B132B] hover:bg-[#0F1B38] border border-[#1E293B] hover:border-[#00E5FF]/40 text-xs font-mono text-[#F8FAFC] rounded-md flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Structured Resume Canvas */}
        <div className="p-8 sm:p-14 bg-[#0B132B] border border-[#1E293B] rounded-2xl space-y-12 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none">
          {/* Header */}
          <div className="border-b border-[#1E293B] pb-8 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC] uppercase">
              {profile.name}
            </h1>
            <p className="text-sm font-mono text-[#00E5FF] font-semibold">
              {profile.headline}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-[#94A3B8] pt-1">
              <span>{profile.location}</span>
              <span>•</span>
              <span>{profile.email}</span>
              <span>•</span>
              <span>{profile.website}</span>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
              Executive Summary
            </h2>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              {profile.longBio}
            </p>
          </div>

          {/* Professional Experience */}
          <div className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
              Experience & Focus Areas
            </h2>
            <div className="space-y-6 divide-y divide-[#131F37]">
              {experiences.filter(e => e.published).map((exp) => (
                <div key={exp.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h3 className="text-base font-bold text-[#F8FAFC]">
                      {exp.title}
                    </h3>
                    <span className="text-xs font-mono text-[#64748B]">
                      {exp.startDate} {exp.isCurrent ? '— Present' : exp.endDate ? `— ${exp.endDate}` : ''}
                    </span>
                  </div>
                  {exp.roleTitle && (
                    <p className="text-xs font-mono text-[#94A3B8]">
                      {exp.roleTitle} {exp.organization ? `· ${exp.organization}` : ''}
                    </p>
                  )}
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
              Education & Studies
            </h2>
            <div className="space-y-4">
              {educations.filter(e => e.published).map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h3 className="text-sm font-bold text-[#F8FAFC]">
                      {edu.qualification}
                    </h3>
                    <span className="text-xs font-mono text-[#64748B]">
                      {edu.startDate} — {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#94A3B8]">
                    {edu.institution} {edu.field ? `· ${edu.field}` : ''}
                  </p>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Competencies */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
              Core Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {skillCategories.filter(c => c.published).map((cat) => (
                <div key={cat.id} className="p-4 bg-[#050814] border border-[#1E293B] rounded-lg space-y-2">
                  <h4 className="font-bold text-[#F8FAFC] uppercase tracking-tight">{cat.name}</h4>
                  <ul className="space-y-1 text-[#94A3B8]">
                    {skills.filter(s => s.categoryId === cat.id && s.published).map((s) => (
                      <li key={s.id}>• {s.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
