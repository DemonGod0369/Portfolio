import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ImageUploadField } from '../ui/ImageUploadField';
import { downloadVCardFile, downloadVisitingCardImage } from '../../utils/seoAndQrUtils';
import { 
  User, 
  Briefcase, 
  Sparkles, 
  GraduationCap, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  X,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Globe,
  Languages,
  Download,
  Check,
  MessageCircle,
  ShieldCheck,
  Radio,
  ExternalLink,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Experience, Education, Skill } from '../../types';

export const AdminProfileMasterManager: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    educations, 
    addEducation, 
    updateEducation, 
    deleteEducation,
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    skillCategories,
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    siteSettings,
    updateSiteSettings,
    setCurrentRoute,
    openConfirmModal,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'bio' | 'education' | 'experience' | 'skills'>('bio');

  // Bio form state with user-arranged hierarchy (Name, DOB, Address, Contacts, Bios, Visiting Card)
  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    dateOfBirth: profile.dateOfBirth || '',
    address: profile.address || profile.location || '',
    headline: profile.headline,
    shortBio: profile.shortBio,
    longBio: profile.longBio,
    profileImageUrl: profile.profileImageUrl,
    visitingCardImageUrl: profile.visitingCardImageUrl || '',
    email: profile.email,
    alternateEmail: profile.alternateEmail || '',
    primaryEmailLabel: profile.primaryEmailLabel || 'Direct & Official',
    alternateEmailLabel: profile.alternateEmailLabel || 'Advisory & Ventures',
    phone: profile.phone || '',
    secondaryPhone: profile.secondaryPhone || '',
    phoneDisplayOption: (profile.phoneDisplayOption || 'both') as 'both' | 'primary' | 'secondary' | 'none',
    whatsappNumber: (profile.whatsappNumber || 'primary') as 'primary' | 'secondary' | 'none',
    location: profile.location,
    website: profile.website,
    languagesSpoken: profile.languagesSpoken || ['English (Fluent / Professional)', 'Nepali (Native)', 'Hindi (Conversational)'],
  });
  const [logoState, setLogoState] = useState(siteSettings.logoUrl || '');
  const [newLangInput, setNewLangInput] = useState('');

  // Keep profileForm synced with context updates
  useEffect(() => {
    setProfileForm({
      name: profile.name,
      dateOfBirth: profile.dateOfBirth || '',
      address: profile.address || profile.location || '',
      headline: profile.headline,
      shortBio: profile.shortBio,
      longBio: profile.longBio,
      profileImageUrl: profile.profileImageUrl,
      visitingCardImageUrl: profile.visitingCardImageUrl || '',
      email: profile.email,
      alternateEmail: profile.alternateEmail || '',
      primaryEmailLabel: profile.primaryEmailLabel || 'Direct & Official',
      alternateEmailLabel: profile.alternateEmailLabel || 'Advisory & Ventures',
      phone: profile.phone || '',
      secondaryPhone: profile.secondaryPhone || '',
      phoneDisplayOption: (profile.phoneDisplayOption || 'both') as 'both' | 'primary' | 'secondary' | 'none',
      whatsappNumber: (profile.whatsappNumber || 'primary') as 'primary' | 'secondary' | 'none',
      location: profile.location,
      website: profile.website,
      languagesSpoken: profile.languagesSpoken || ['English (Fluent / Professional)', 'Nepali (Native)', 'Hindi (Conversational)'],
    });
    setLogoState(siteSettings.logoUrl || '');
  }, [profile, siteSettings.logoUrl]);

  const handleAddLanguage = () => {
    const trimmed = newLangInput.trim();
    if (!trimmed) return;
    if (!profileForm.languagesSpoken.includes(trimmed)) {
      setProfileForm(prev => ({
        ...prev,
        languagesSpoken: [...prev.languagesSpoken, trimmed]
      }));
    }
    setNewLangInput('');
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setProfileForm(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.filter(l => l !== langToRemove)
    }));
  };

  // Experience form drawer
  const [isExpDrawerOpen, setIsExpDrawerOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState({
    category: 'Operations & Management',
    title: '',
    roleTitle: '',
    organization: '',
    location: 'Kathmandu, Nepal',
    startDate: '2024',
    endDate: '',
    isCurrent: false,
    shortDescription: '',
    description: '',
    tags: 'Operations, Strategy, Tech',
    featured: true,
    displayOrder: experiences.length + 1,
    published: true,
  });

  // Education form modal
  const [isEduDrawerOpen, setIsEduDrawerOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduForm, setEduForm] = useState({
    institution: '',
    qualification: '',
    field: '',
    location: 'Kathmandu, Nepal',
    startDate: '2020',
    endDate: '2024',
    description: '',
    displayOrder: educations.length + 1,
    published: true,
  });

  // Skills drawer
  const [isSkillDrawerOpen, setIsSkillDrawerOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState({
    categoryId: skillCategories[0]?.id || '',
    name: '',
    description: '',
    displayOrder: skills.length + 1,
    published: true,
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Draft auto-savers for profile drawers
  const saveExpDraft = () => {
    if (!expForm.title.trim()) {
      setIsExpDrawerOpen(false);
      setEditingExpId(null);
      return;
    }
    const tagsArray = (expForm.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    if (editingExpId) {
      updateExperience(editingExpId, {
        ...expForm,
        tags: tagsArray,
        published: false,
      });
    } else {
      addExperience({
        ...expForm,
        tags: tagsArray,
        published: false,
      });
    }
    setIsExpDrawerOpen(false);
    setEditingExpId(null);
    showToast('Experience milestone saved as Draft');
  };

  const saveEduDraft = () => {
    if (!eduForm.institution.trim() && !eduForm.qualification.trim()) {
      setIsEduDrawerOpen(false);
      setEditingEduId(null);
      return;
    }
    if (editingEduId) {
      updateEducation(editingEduId, {
        ...eduForm,
        published: false,
      });
    } else {
      addEducation({
        ...eduForm,
        published: false,
      });
    }
    setIsEduDrawerOpen(false);
    setEditingEduId(null);
    showToast('Academic record saved as Draft');
  };

  const saveSkillDraft = () => {
    if (!skillForm.name.trim() || !skillForm.categoryId) {
      setIsSkillDrawerOpen(false);
      setEditingSkillId(null);
      return;
    }
    if (editingSkillId) {
      updateSkill(editingSkillId, {
        ...skillForm,
        slug: skillForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published: false,
      });
    } else {
      addSkill({
        ...skillForm,
        slug: skillForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published: false,
      });
    }
    setIsSkillDrawerOpen(false);
    setEditingSkillId(null);
    showToast('Skill competency saved as Draft');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profileForm,
      location: profileForm.address || profileForm.location,
    });
    if (logoState !== siteSettings.logoUrl) {
      updateSiteSettings({ logoUrl: logoState });
    }
    showToast('Profile identity & presentation updated successfully');
  };

  const handleSaveVisitingCard = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    updateProfile({
      visitingCardImageUrl: profileForm.visitingCardImageUrl,
    });
    showToast('Visiting Card saved successfully');
  };

  const handleOpenNewExp = () => {
    setEditingExpId(null);
    setExpForm({
      category: 'Operations & Management',
      title: '',
      roleTitle: '',
      organization: '',
      location: 'Kathmandu, Nepal',
      startDate: '2024',
      endDate: '',
      isCurrent: false,
      shortDescription: '',
      description: '',
      tags: 'Operations, Strategy, Tech',
      featured: true,
      displayOrder: experiences.length + 1,
      published: true,
    });
    setIsExpDrawerOpen(true);
  };

  const handleOpenEditExp = (exp: Experience) => {
    setEditingExpId(exp.id);
    setExpForm({
      category: exp.category,
      title: exp.title,
      roleTitle: exp.roleTitle || '',
      organization: exp.organization || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent,
      shortDescription: exp.shortDescription,
      description: exp.description,
      tags: (exp.tags || []).join(', '),
      featured: exp.featured,
      displayOrder: exp.displayOrder,
      published: exp.published,
    });
    setIsExpDrawerOpen(true);
  };

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = (expForm.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    if (editingExpId) {
      updateExperience(editingExpId, {
        ...expForm,
        tags: tagsArray,
      });
      showToast('Career milestone updated successfully');
    } else {
      addExperience({
        ...expForm,
        tags: tagsArray,
      });
      showToast('Career milestone created successfully');
    }
    setIsExpDrawerOpen(false);
    setEditingExpId(null);
  };

  const handleOpenNewEdu = () => {
    setEditingEduId(null);
    setEduForm({
      institution: '',
      qualification: '',
      field: '',
      location: 'Kathmandu, Nepal',
      startDate: '2020',
      endDate: '2024',
      description: '',
      displayOrder: educations.length + 1,
      published: true,
    });
    setIsEduDrawerOpen(true);
  };

  const handleOpenEditEdu = (edu: Education) => {
    setEditingEduId(edu.id);
    setEduForm({
      institution: edu.institution,
      qualification: edu.qualification,
      field: edu.field || '',
      location: edu.location || 'Kathmandu, Nepal',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description,
      displayOrder: edu.displayOrder,
      published: edu.published,
    });
    setIsEduDrawerOpen(true);
  };

  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEduId) {
      updateEducation(editingEduId, eduForm);
      showToast('Academic qualification updated successfully');
    } else {
      addEducation(eduForm);
      showToast('Academic qualification added successfully');
    }
    setIsEduDrawerOpen(false);
    setEditingEduId(null);
  };

  const handleOpenNewSkill = (catId?: string) => {
    setEditingSkillId(null);
    setSkillForm({
      categoryId: catId || skillCategories[0]?.id || '',
      name: '',
      description: '',
      displayOrder: skills.length + 1,
      published: true,
    });
    setIsSkillDrawerOpen(true);
  };

  const handleOpenEditSkill = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setSkillForm({
      categoryId: skill.categoryId,
      name: skill.name,
      description: skill.description || '',
      displayOrder: skill.displayOrder,
      published: skill.published,
    });
    setIsSkillDrawerOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim() || !skillForm.categoryId) return;

    const isAssigned = skillForm.categoryId !== 'unassigned' && skillCategories.some(c => c.id === skillForm.categoryId);

    if (editingSkillId) {
      updateSkill(editingSkillId, {
        ...skillForm,
        slug: skillForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published: isAssigned,
      });
      showToast('Skill competency updated successfully');
    } else {
      addSkill({
        ...skillForm,
        slug: skillForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published: isAssigned,
      });
      showToast('Skill competency added successfully');
    }
    setIsSkillDrawerOpen(false);
    setEditingSkillId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5F5F5] uppercase flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#c6a87d]" />
            <span>Profile & Professional Background</span>
          </h2>
          <p className="text-xs font-mono text-[#969696]">
            Personal identity, career timeline milestones, academic credentials, and competency skill sets.
          </p>
        </div>

        <button
          onClick={() => setCurrentRoute('about')}
          className="px-3.5 py-2 bg-[#111111] hover:bg-[#171717] border border-[#262626] text-xs font-mono text-[#969696] hover:text-[#F5F5F5] rounded-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5 text-[#c6a87d]" />
          <span>View Public About Page</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#262626] pb-3">
        <button
          onClick={() => setActiveSubTab('bio')}
          className={`px-4 py-2 text-xs font-mono rounded-sm flex items-center gap-2 transition-colors ${
            activeSubTab === 'bio'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Bio & Identity</span>
        </button>

        <button
          onClick={() => setActiveSubTab('education')}
          className={`px-4 py-2 text-xs font-mono rounded-sm flex items-center gap-2 transition-colors ${
            activeSubTab === 'education'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academic Qualification ({educations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('experience')}
          className={`px-4 py-2 text-xs font-mono rounded-sm flex items-center gap-2 transition-colors ${
            activeSubTab === 'experience'
              ? 'bg-[#c6a87d] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#969696] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience Timeline ({experiences.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('skills')}
          className={`px-4 py-2 text-xs font-mono rounded-sm flex items-center gap-2 transition-colors ${
            activeSubTab === 'skills'
              ? 'bg-[#00E5FF] text-[#080808] font-bold'
              : 'bg-[#111111] text-[#00E5FF] hover:text-[#F5F5F5] border border-[#262626]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Skill Competencies ({skills.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: BIO & IDENTITY */}
      {activeSubTab === 'bio' && (
        <div className="space-y-6">
          <form onSubmit={handleProfileSubmit} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-8">
            
            {/* 1. PERSONAL IDENTITY & CORE ATTRIBUTES (Full Name, Date of Birth, Address, Headline) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c1c] pb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#c6a87d]" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#c6a87d]">
                    1. Personal Identity & Profile Attributes
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#666666]">
                  Primary hierarchy: Full Name, Date of Birth, Address & Professional Role
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#969696] flex items-center justify-between">
                    <span className="text-[#F5F5F5] font-bold">Full Name</span>
                    <span className="text-[10px] text-[#c6a87d] uppercase">Legal & Display</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gunjan Shrestha"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    />
                    <User className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#969696] flex items-center justify-between">
                    <span className="text-[#F5F5F5] font-bold">Date of Birth</span>
                    <span className="text-[10px] text-[#94A3B8] uppercase">DOB</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    />
                    <Calendar className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#969696] flex items-center justify-between">
                    <span className="text-[#F5F5F5] font-bold">Address / Location</span>
                    <span className="text-[10px] text-[#c6a87d] uppercase">Base Coordinates</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Kathmandu, Bagmati Province, Nepal"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    />
                    <MapPin className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                  </div>
                </div>

                {/* Headline / Core Role */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#969696] flex items-center justify-between">
                    <span className="text-[#F5F5F5] font-bold">Headline / Core Role</span>
                    <span className="text-[10px] text-[#94A3B8] uppercase">Professional Title</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Multidisciplinary Founder & Operator..."
                      value={profileForm.headline}
                      onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    />
                    <Briefcase className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CONTACT NUMBERS & COMMUNICATION CHANNELS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c1c] pb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#c6a87d]" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#c6a87d]">
                    2. Contact Numbers & Direct Communications
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#666666]">
                  Configure numbers with privacy controls & WhatsApp routing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#969696] flex items-center justify-between">
                    <span className="text-[#F5F5F5] font-bold">Primary Contact Number</span>
                    <span className="text-[10px] text-[#c6a87d] uppercase">Main Hotline</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+977 9800000000"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] font-mono text-[#666666]">
                    Primary telephone channel for executive communications and vCard export.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-[#969696] flex items-center justify-between">
                    <span className="text-[#F5F5F5] font-bold">Secondary Contact Number</span>
                    <span className="text-[10px] text-[#94A3B8] uppercase">Office / Backup</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+977 9811111111"
                      value={profileForm.secondaryPhone}
                      onChange={(e) => setProfileForm({ ...profileForm, secondaryPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] font-mono text-[#666666]">
                    Secondary direct line for backup communications or office desk.
                  </p>
                </div>
              </div>

              {/* Contact Number Website Visibility (Same option as WhatsApp) */}
              <div className="p-4 bg-[#0a0a0a] border border-[#1e1e1e] rounded-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F5F5F5] font-bold flex items-center gap-1.5">
                    {profileForm.phoneDisplayOption === 'none' ? (
                      <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-[#c6a87d]" />
                    )}
                    Website Contact Number Visibility
                  </span>
                  <span className="text-[10px] text-[#969696]">
                    Choose which contact numbers to show or hide on the website
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, phoneDisplayOption: 'both' })}
                    className={`p-2.5 text-xs font-mono rounded-sm border text-left transition-all ${
                      profileForm.phoneDisplayOption === 'both'
                        ? 'bg-[#171717] border-[#c6a87d] text-[#c6a87d]'
                        : 'bg-[#111111] border-[#262626] text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Both Numbers</span>
                      {profileForm.phoneDisplayOption === 'both' && <Check className="w-3 h-3 text-[#c6a87d]" />}
                    </div>
                    <span className="text-[10px] block opacity-75">Show Primary & Secondary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, phoneDisplayOption: 'primary' })}
                    className={`p-2.5 text-xs font-mono rounded-sm border text-left transition-all ${
                      profileForm.phoneDisplayOption === 'primary'
                        ? 'bg-[#171717] border-[#c6a87d] text-[#c6a87d]'
                        : 'bg-[#111111] border-[#262626] text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Primary Only</span>
                      {profileForm.phoneDisplayOption === 'primary' && <Check className="w-3 h-3 text-[#c6a87d]" />}
                    </div>
                    <span className="text-[10px] block opacity-75 truncate">{profileForm.phone || 'Primary line'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, phoneDisplayOption: 'secondary' })}
                    className={`p-2.5 text-xs font-mono rounded-sm border text-left transition-all ${
                      profileForm.phoneDisplayOption === 'secondary'
                        ? 'bg-[#171717] border-[#c6a87d] text-[#c6a87d]'
                        : 'bg-[#111111] border-[#262626] text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Secondary Only</span>
                      {profileForm.phoneDisplayOption === 'secondary' && <Check className="w-3 h-3 text-[#c6a87d]" />}
                    </div>
                    <span className="text-[10px] block opacity-75 truncate">{profileForm.secondaryPhone || 'Secondary line'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, phoneDisplayOption: 'none' })}
                    className={`p-2.5 text-xs font-mono rounded-sm border text-left transition-all ${
                      profileForm.phoneDisplayOption === 'none'
                        ? 'bg-[#1f1315] border-rose-500/80 text-rose-400'
                        : 'bg-[#111111] border-[#262626] text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Do Not Show</span>
                      {profileForm.phoneDisplayOption === 'none' && <Check className="w-3 h-3 text-rose-400" />}
                    </div>
                    <span className="text-[10px] block opacity-75">Hide phone numbers</span>
                  </button>
                </div>
              </div>

              {/* WhatsApp routing options */}
              <div className="p-4 bg-[#0a0a0a] border border-[#1e1e1e] rounded-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F5F5F5] font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    WhatsApp Direct-Chat Integration
                  </span>
                  <span className="text-[10px] text-[#969696]">
                    Enables one-click WhatsApp chat link on public cards
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, whatsappNumber: 'primary' })}
                    className={`p-2.5 text-xs font-mono rounded-sm border text-left transition-all ${
                      profileForm.whatsappNumber === 'primary'
                        ? 'bg-[#171717] border-[#25D366] text-[#25D366]'
                        : 'bg-[#111111] border-[#262626] text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Primary Line</span>
                      {profileForm.whatsappNumber === 'primary' && <Check className="w-3 h-3 text-[#25D366]" />}
                    </div>
                    <span className="text-[10px] block opacity-75 truncate">{profileForm.phone || 'No number set'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, whatsappNumber: 'secondary' })}
                    className={`p-2.5 text-xs font-mono rounded-sm border text-left transition-all ${
                      profileForm.whatsappNumber === 'secondary'
                        ? 'bg-[#171717] border-[#25D366] text-[#25D366]'
                        : 'bg-[#111111] border-[#262626] text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Secondary Line</span>
                      {profileForm.whatsappNumber === 'secondary' && <Check className="w-3 h-3 text-[#25D366]" />}
                    </div>
                    <span className="text-[10px] block opacity-75 truncate">{profileForm.secondaryPhone || 'No number set'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, whatsappNumber: 'none' })}
                    className={`p-2.5 text-xs font-mono rounded-sm border text-left transition-all ${
                      profileForm.whatsappNumber === 'none'
                        ? 'bg-[#171717] border-[#c6a87d] text-[#c6a87d]'
                        : 'bg-[#111111] border-[#262626] text-[#969696] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Do Not Link</span>
                      {profileForm.whatsappNumber === 'none' && <Check className="w-3 h-3 text-[#c6a87d]" />}
                    </div>
                    <span className="text-[10px] block opacity-75">Hide WhatsApp button</span>
                  </button>
                </div>
              </div>

              {/* Email Inboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Primary Email */}
                <div className="p-4 bg-[#0c0c0c] border border-[#212121] rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#F5F5F5]">Primary Email</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#171717] text-[#c6a87d] border border-[#262626] rounded">
                      Principal
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#969696] mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                      />
                      <Mail className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#969696] mb-1">Purpose Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Direct & Official"
                      value={profileForm.primaryEmailLabel}
                      onChange={(e) => setProfileForm({ ...profileForm, primaryEmailLabel: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    />
                  </div>
                </div>

                {/* Alternate Email */}
                <div className="p-4 bg-[#0c0c0c] border border-[#212121] rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#F5F5F5]">Alternate Email</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#171717] text-[#00E5FF] border border-[#262626] rounded">
                      Secondary / Bio
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#969696] mb-1">Alternate Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="contact@gunjanshrestha.com.np"
                        value={profileForm.alternateEmail}
                        onChange={(e) => setProfileForm({ ...profileForm, alternateEmail: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                      />
                      <Mail className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#969696] mb-1">Purpose Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Advisory & Ventures"
                      value={profileForm.alternateEmailLabel}
                      onChange={(e) => setProfileForm({ ...profileForm, alternateEmailLabel: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                    />
                  </div>
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-[#969696] flex items-center justify-between">
                  <span className="text-[#F5F5F5] font-bold">Canonical Website URL</span>
                  <span className="text-[10px] text-[#969696]">Domain Endpoint</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                  />
                  <Globe className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* 3. BIOGRAPHY, VISUAL IDENTITY & SPOKEN LANGUAGES */}
            <div className="space-y-4">
              <div className="border-b border-[#1c1c1c] pb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#c6a87d]">
                  3. Biography Narratives & Visual Presentation
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploadField
                  label="Profile Picture / Official Portrait"
                  value={profileForm.profileImageUrl}
                  onChange={(val) => setProfileForm({ ...profileForm, profileImageUrl: val })}
                  aspectRatio="portrait"
                  previewLabel="Profile Photo Preview"
                  helperText="Official portrait displayed across hero sections, about views, and metadata."
                />

                <ImageUploadField
                  label="Personal Brand Logo (Header & Footer)"
                  value={logoState}
                  onChange={(val) => setLogoState(val)}
                  aspectRatio="square"
                  previewLabel="Header & Footer Logo Preview"
                  helperText="Personal monogram, seal, or brand insignia (transparent PNG recommended)."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Short Bio (Hero Introduction)</label>
                <textarea
                  rows={2}
                  required
                  value={profileForm.shortBio}
                  onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#969696] mb-1">Detailed Background Biography</label>
                <textarea
                  rows={4}
                  required
                  value={profileForm.longBio}
                  onChange={(e) => setProfileForm({ ...profileForm, longBio: e.target.value })}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d]"
                />
              </div>

              {/* Languages Spoken */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#c6a87d]" />
                  <label className="block text-xs font-mono text-[#969696]">Languages Spoken & Fluency</label>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {profileForm.languagesSpoken.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm"
                    >
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang)}
                        className="text-[#666666] hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Add language (e.g. German (Basic))"
                      value={newLangInput}
                      onChange={(e) => setNewLangInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLanguage();
                        }
                      }}
                      className="px-3 py-1 bg-[#080808] border border-[#262626] text-xs font-mono text-[#F5F5F5] rounded-sm focus:outline-none focus:border-[#c6a87d] w-56"
                    />
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="px-2.5 py-1 bg-[#1c1c1c] hover:bg-[#c6a87d] hover:text-[#080808] text-xs font-mono text-[#c6a87d] rounded-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. DIGITAL VISITING CARD (UPLOAD & VISITOR DOWNLOAD) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c1c] pb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#c6a87d]" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#c6a87d]">
                    4. Digital Visiting Card (Upload & Visitor Download)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#666666]">
                  Supports JPEG, JPG, and PNG image formats
                </span>
              </div>

              <div className="p-4 bg-[#0a0a0a] border border-[#1e1e1e] rounded-sm space-y-4">
                <p className="text-xs font-mono text-[#969696] leading-relaxed">
                  Upload your visiting card image. Visitors on your public <span className="text-[#F5F5F5] font-bold">About</span> and <span className="text-[#F5F5F5] font-bold">Contact</span> pages will have the option to download this visiting card directly to their device.
                </p>

                <ImageUploadField
                  label="Visiting Card Graphic (JPEG, JPG, PNG)"
                  value={profileForm.visitingCardImageUrl}
                  onChange={(val) => setProfileForm({ ...profileForm, visitingCardImageUrl: val })}
                  aspectRatio="wide"
                  previewLabel="Visiting Card Preview"
                  helperText="Upload your visiting card design (JPEG, JPG, or PNG). Recommended ratio ~1.75:1 (e.g. 1050×600px)."
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#1a1a1a]">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#c6a87d]">
                    {profileForm.visitingCardImageUrl ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#c6a87d]" />
                        <span>Visiting card image ready for public visitor downloads</span>
                      </>
                    ) : (
                      <span className="text-[#666666]">No visiting card uploaded yet</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {profileForm.visitingCardImageUrl && (
                      <button
                        type="button"
                        onClick={() => downloadVisitingCardImage(profileForm.visitingCardImageUrl, profileForm.name)}
                        className="px-3.5 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#2e2e2e] text-[#F5F5F5] hover:text-[#c6a87d] text-xs font-mono rounded-sm transition-colors flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-[#c6a87d]" />
                        <span>Test Download</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSaveVisitingCard}
                      className="px-4 py-1.5 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] text-xs font-mono font-bold rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Visiting Card</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#262626]">
              <div className="flex flex-wrap items-center gap-2">
                {profileForm.visitingCardImageUrl && (
                  <button
                    type="button"
                    onClick={() => downloadVisitingCardImage(profileForm.visitingCardImageUrl, profileForm.name)}
                    className="px-3.5 py-2 bg-[#171717] hover:bg-[#212121] border border-[#262626] text-[#F5F5F5] hover:text-[#c6a87d] text-xs font-mono rounded-sm transition-colors flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-[#c6a87d]" />
                    <span>Download Visiting Card</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => downloadVCardFile(profileForm as any, siteSettings)}
                  className="px-3.5 py-2 bg-[#171717] hover:bg-[#212121] border border-[#262626] text-[#969696] hover:text-[#F5F5F5] text-xs font-mono rounded-sm transition-colors flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download vCard (.vcf)</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 2: ACADEMIC QUALIFICATION */}
      {activeSubTab === 'education' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#c6a87d]" />
                <span>Academic Qualifications & Degrees</span>
              </h3>
              <p className="text-xs font-mono text-[#969696]">Higher education credentials, degrees, and academic milestones shown on your profile.</p>
            </div>

            <button
              onClick={handleOpenNewEdu}
              className="px-4 py-2 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Degree</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educations.map((edu) => (
              <div key={edu.id} className="p-5 bg-[#111111] border border-[#262626] hover:border-[#c6a87d]/50 rounded-sm flex items-start justify-between gap-4 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#F5F5F5]">{edu.qualification}</p>
                    <span className={`px-2 py-0.2 text-[10px] font-mono rounded ${
                      edu.published ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' : 'text-[#666666] bg-[#171717]'
                    }`}>
                      {edu.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#c6a87d]">{edu.institution}</p>
                  <p className="text-[11px] font-mono text-[#666666]">{edu.startDate} — {edu.endDate || 'Present'} • {edu.location}</p>
                  {edu.description && <p className="text-xs text-[#969696] pt-1.5 line-clamp-2 leading-relaxed">{edu.description}</p>}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEditEdu(edu)}
                    className="p-1.5 bg-[#171717] text-[#969696] hover:text-[#c6a87d] rounded-sm border border-[#262626] transition-colors"
                    title="Edit Qualification"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      openConfirmModal({
                        title: 'Delete Qualification?',
                        message: `Are you sure you want to permanently delete "${edu.qualification}"? This action cannot be undone.`,
                        confirmLabel: 'Delete',
                        destructive: true,
                        onConfirm: () => {
                          deleteEducation(edu.id);
                          showToast('Academic qualification deleted');
                        },
                      });
                    }}
                    className="p-1.5 bg-[#171717] text-[#969696] hover:text-red-400 rounded-sm border border-[#262626] transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {educations.length === 0 && (
            <div className="p-12 text-center border border-dashed border-[#262626] rounded-sm bg-[#0e0e0e] space-y-3">
              <GraduationCap className="w-8 h-8 text-[#666666] mx-auto" />
              <p className="text-xs font-mono text-[#969696]">No academic credentials added yet.</p>
              <button
                onClick={handleOpenNewEdu}
                className="px-4 py-2 bg-[#c6a87d] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm"
              >
                Add First Degree
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: EXPERIENCE TIMELINE */}
      {activeSubTab === 'experience' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#c6a87d]" />
                <span>Career Milestones & Roles</span>
              </h3>
              <p className="text-xs font-mono text-[#969696]">Chronological and thematic career milestones rendered on your hybrid timeline.</p>
            </div>

            <button
              onClick={handleOpenNewExp}
              className="px-4 py-2 bg-[#c6a87d] hover:bg-[#d8bc93] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Milestone</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-5 bg-[#111111] border border-[#262626] rounded-sm space-y-3 flex flex-col justify-between group hover:border-[#c6a87d]/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#171717] text-[#c6a87d] text-[10px] font-mono uppercase tracking-wider rounded border border-[#262626]">
                      {exp.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          updateExperience(exp.id, { published: !exp.published });
                          showToast(exp.published ? 'Milestone set to draft' : 'Milestone published');
                        }}
                        className={`p-1 rounded-sm text-xs font-mono ${
                          exp.published ? 'text-emerald-400' : 'text-[#666666]'
                        }`}
                        title={exp.published ? 'Published' : 'Hidden'}
                      >
                        {exp.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#c6a87d] transition-colors leading-snug">
                    {exp.title}
                  </h4>

                  <p className="text-xs font-mono text-[#969696]">
                    {exp.roleTitle} {exp.organization ? `• ${exp.organization}` : ''}
                  </p>

                  <p className="text-[11px] font-mono text-[#666666]">
                    {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate || '2024'} • {exp.location}
                  </p>

                  <p className="text-xs text-[#969696] leading-relaxed line-clamp-2 pt-1">
                    {exp.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {exp.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono text-[#666666]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditExp(exp)}
                      className="px-2 py-1 bg-[#171717] hover:bg-[#222222] text-[#c6a87d] text-xs font-mono rounded flex items-center gap-1 border border-[#262626]"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        openConfirmModal({
                          title: 'Delete Milestone?',
                          message: `Are you sure you want to delete "${exp.title}"? This action cannot be undone.`,
                          confirmLabel: 'Delete',
                          destructive: true,
                          onConfirm: () => {
                            deleteExperience(exp.id);
                            showToast('Career milestone deleted');
                          },
                        });
                      }}
                      className="p-1 text-[#666666] hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: SKILL SETS */}
      {activeSubTab === 'skills' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                <span>Skill Competencies & Frameworks</span>
              </h3>
              <p className="text-xs font-mono text-[#969696]">Organized by domain categories. Manage categories separately under Categories tab.</p>
            </div>

            <button
              onClick={() => handleOpenNewSkill()}
              className="px-4 py-2 bg-[#00E5FF] hover:bg-[#38BDF8] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Skill Entry</span>
            </button>
          </div>

          <div className="space-y-8">
            {skillCategories.map((cat) => {
              const catSkills = skills.filter(s => s.categoryId === cat.id);
              return (
                <div key={cat.id} className="p-6 bg-[#111111] border border-[#262626] rounded-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#00E5FF]">{cat.name}</h4>
                      {cat.description && <p className="text-xs text-[#969696] font-mono mt-0.5">{cat.description}</p>}
                    </div>

                    <button
                      onClick={() => handleOpenNewSkill(cat.id)}
                      className="px-2.5 py-1 bg-[#171717] hover:bg-[#222222] text-[#00E5FF] text-xs font-mono rounded flex items-center gap-1 border border-[#262626]"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to {cat.name.split(' ')[0]}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catSkills.map((skill) => (
                      <div key={skill.id} className="p-3.5 bg-[#080808] border border-[#1e293b] rounded-sm flex items-start justify-between gap-3 group hover:border-[#00E5FF]/50 transition-all">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#00E5FF] transition-colors">{skill.name}</p>
                          {skill.description && <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">{skill.description}</p>}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEditSkill(skill)}
                            className="p-1 text-[#666666] hover:text-[#00E5FF]"
                            title="Edit Skill"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              openConfirmModal({
                                title: 'Delete Skill?',
                                message: `Are you sure you want to remove "${skill.name}"? This action cannot be undone.`,
                                confirmLabel: 'Delete',
                                destructive: true,
                                onConfirm: () => {
                                  deleteSkill(skill.id);
                                  showToast('Skill competency deleted');
                                },
                              });
                            }}
                            className="p-1 text-[#666666] hover:text-red-400"
                            title="Delete Skill"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Unassigned Skills (from deleted categories) */}
            {skills.filter(s => !skillCategories.some(c => c.id === s.categoryId)).length > 0 && (
              <div className="p-5 bg-[#161208] border border-amber-900/60 rounded-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                      <span>⚠️</span> Unassigned Skills ({skills.filter(s => !skillCategories.some(c => c.id === s.categoryId)).length})
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono rounded">
                      Hidden from website
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400/80">
                    Assign to an active category to publish on public profile
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.filter(s => !skillCategories.some(c => c.id === s.categoryId)).map((skill) => (
                    <div key={skill.id} className="p-3.5 bg-[#0a0804] border border-amber-900/40 rounded-sm flex flex-col justify-between gap-3 group hover:border-amber-500/60 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-amber-200">{skill.name}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditSkill(skill)}
                              className="p-1 text-[#666666] hover:text-[#00E5FF]"
                              title="Edit Skill"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                openConfirmModal({
                                  title: 'Delete Skill?',
                                  message: `Are you sure you want to permanently remove "${skill.name}"? This action cannot be undone.`,
                                  confirmLabel: 'Delete',
                                  destructive: true,
                                  onConfirm: () => {
                                    deleteSkill(skill.id);
                                    showToast('Skill competency deleted');
                                  },
                                });
                              }}
                              className="p-1 text-[#666666] hover:text-red-400"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {skill.description && <p className="text-[11px] text-[#888888] leading-relaxed line-clamp-2">{skill.description}</p>}
                      </div>

                      <div className="pt-2 border-t border-amber-950 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-[#888888] shrink-0">Assign to:</span>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              updateSkill(skill.id, { categoryId: e.target.value, published: true });
                              showToast(`Skill reassigned and published`);
                            }
                          }}
                          className="w-full px-2 py-1 bg-[#121212] border border-[#333333] text-[11px] text-amber-300 rounded focus:border-[#c6a87d] focus:outline-none"
                        >
                          <option value="">-- Choose Category --</option>
                          {skillCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#111111] border border-[#c6a87d] text-xs font-mono text-[#F5F5F5] rounded-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#c6a87d]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DRAWERS */}
      {/* Experience Drawer */}
      {isExpDrawerOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              saveExpDraft();
            }
          }}
          className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#0e0e0e] border-l border-[#262626] h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between animate-slide-in"
          >
            <form onSubmit={handleSaveExp} className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <h3 className="text-base font-bold text-[#F5F5F5] uppercase flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#c6a87d]" />
                  <span>{editingExpId ? 'Edit Career Milestone' : 'New Career Milestone'}</span>
                </h3>
                <button type="button" onClick={saveExpDraft} className="p-1.5 text-[#969696] hover:text-[#F5F5F5]" title="Close and Save Draft">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">Category / Domain</label>
                    <input
                      type="text"
                      required
                      value={expForm.category}
                      onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
                      placeholder="e.g. Operations & Management"
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">Discipline Title</label>
                    <input
                      type="text"
                      required
                      value={expForm.title}
                      onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                      placeholder="e.g. Cross-Functional Operations"
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">Role Title</label>
                    <input
                      type="text"
                      value={expForm.roleTitle}
                      onChange={(e) => setExpForm({ ...expForm, roleTitle: e.target.value })}
                      placeholder="e.g. Operations Manager"
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">Organization / Context</label>
                    <input
                      type="text"
                      value={expForm.organization}
                      onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                      placeholder="e.g. Enterprise Group"
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">Location</label>
                    <input
                      type="text"
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">Start Year</label>
                    <input
                      type="text"
                      value={expForm.startDate}
                      onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">End Year</label>
                    <input
                      type="text"
                      disabled={expForm.isCurrent}
                      value={expForm.endDate}
                      onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                      placeholder={expForm.isCurrent ? 'Present' : '2024'}
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5]">
                  <input
                    type="checkbox"
                    checked={expForm.isCurrent}
                    onChange={(e) => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                    className="accent-[#c6a87d]"
                  />
                  <span>Currently active in this role</span>
                </label>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Short Description (Punchy Summary)</label>
                  <textarea
                    rows={2}
                    required
                    value={expForm.shortDescription}
                    onChange={(e) => setExpForm({ ...expForm, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Detailed Description & Responsibilities</label>
                  <textarea
                    rows={4}
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Skill Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={expForm.tags}
                    onChange={(e) => setExpForm({ ...expForm, tags: e.target.value })}
                    placeholder="Operations, Accounting, Software"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#666666]">Clicking outside saves as Draft</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={saveExpDraft} className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] rounded-sm">
                    Save Draft
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase rounded-sm">
                    {editingExpId ? 'Save Changes' : 'Create Milestone'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Drawer */}
      {isEduDrawerOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              saveEduDraft();
            }
          }}
          className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0e0e0e] border-l border-[#262626] h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between animate-slide-in"
          >
            <form onSubmit={handleSaveEdu} className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <h3 className="text-base font-bold text-[#F5F5F5] uppercase flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#c6a87d]" />
                  <span>{editingEduId ? 'Edit Academic Record' : 'New Academic Qualification'}</span>
                </h3>
                <button type="button" onClick={saveEduDraft} className="p-1.5 text-[#969696] hover:text-[#F5F5F5]" title="Close and Save Draft">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Institution / University</label>
                  <input
                    type="text"
                    required
                    value={eduForm.institution}
                    onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                    placeholder="e.g. Kathmandu University"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Qualification Degree Title</label>
                  <input
                    type="text"
                    required
                    value={eduForm.qualification}
                    onChange={(e) => setEduForm({ ...eduForm, qualification: e.target.value })}
                    placeholder="e.g. Bachelor of Science in Computer Engineering"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">Start Year</label>
                    <input
                      type="text"
                      value={eduForm.startDate}
                      onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#969696] mb-1">End Year / Present</label>
                    <input
                      type="text"
                      value={eduForm.endDate}
                      onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Location</label>
                  <input
                    type="text"
                    value={eduForm.location}
                    onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                    placeholder="e.g. Dhulikhel, Nepal"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Curriculum & Highlights</label>
                  <textarea
                    rows={3}
                    value={eduForm.description}
                    onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                    placeholder="Specialized in software systems, database architecture, and algorithms..."
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#666666]">Auto-saves as Draft on close</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={saveEduDraft} className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] rounded-sm">
                    Save Draft
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#c6a87d] text-[#080808] text-xs font-bold uppercase rounded-sm">
                    {editingEduId ? 'Save Changes' : 'Save Record'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Drawer */}
      {isSkillDrawerOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              saveSkillDraft();
            }
          }}
          className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0e0e0e] border-l border-[#262626] h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between animate-slide-in"
          >
            <form onSubmit={handleSaveSkill} className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <h3 className="text-base font-bold text-[#F5F5F5] uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                  <span>{editingSkillId ? 'Edit Competency Skill' : 'New Competency Skill'}</span>
                </h3>
                <button type="button" onClick={saveSkillDraft} className="p-1.5 text-[#969696] hover:text-[#F5F5F5]" title="Close and Save Draft">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Target Skill Category</label>
                  <select
                    value={skillForm.categoryId}
                    onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:border-[#00E5FF]"
                  >
                    {(!skillCategories.some(c => c.id === skillForm.categoryId) || skillForm.categoryId === 'unassigned') && (
                      <option value="unassigned" className="text-amber-400">
                        ⚠️ Unassigned Category (Select category below)
                      </option>
                    )}
                    {skillCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Skill / Capability Name</label>
                  <input
                    type="text"
                    required
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    placeholder="e.g. React & Modern TypeScript Architecture"
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:border-[#00E5FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#969696] mb-1">Descriptor / Details</label>
                  <textarea
                    rows={3}
                    value={skillForm.description}
                    onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                    placeholder="Component modularity, state machines, and responsive layouts..."
                    className="w-full px-3 py-2 bg-[#080808] border border-[#262626] text-xs text-[#F5F5F5] rounded-sm focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#666666]">Auto-saves as Draft on close</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={saveSkillDraft} className="px-4 py-2 bg-[#171717] text-xs font-mono text-[#969696] rounded-sm">
                    Save Draft
                  </button>
                  <button type="submit" className="px-6 py-2 bg-[#00E5FF] hover:bg-[#38BDF8] text-[#080808] text-xs font-bold uppercase rounded-sm transition-colors">
                    {editingSkillId ? 'Save Changes' : 'Add Skill'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
