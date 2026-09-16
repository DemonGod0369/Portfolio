import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, Bot, Palette, Briefcase, Sparkles } from 'lucide-react';

export const SkillsView: React.FC = () => {
  const { skillCategories, skills, services, setCurrentRoute } = useData();
  const { isDark } = useTheme();

  const publishedCategories = skillCategories
    .filter(c => c.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const publishedServices = services
    .filter(s => s.published)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });

  const getCategoryIcon = (slug: string, name?: string) => {
    const s = (slug + ' ' + (name || '')).toLowerCase();
    if (s.includes('tech') || s.includes('system') || s.includes('robo')) {
      return <Bot className={`w-5 h-5 ${isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'}`} />;
    }
    if (s.includes('design') || s.includes('creative')) {
      return <Palette className={`w-5 h-5 ${isDark ? 'text-[#38BDF8]' : 'text-[#0284C7]'}`} />;
    }
    return <Briefcase className={`w-5 h-5 ${isDark ? 'text-[#10B981]' : 'text-[#059669]'}`} />;
  };

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {/* Header */}
        <div className={`space-y-4 border-b pb-10 max-w-3xl ${isDark ? 'border-[#1E293B]' : 'border-slate-200'}`}>
          <span className={`text-xs font-mono uppercase tracking-widest flex items-center gap-2 ${
            isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'
          }`}>
            <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
            Competencies & Practice
          </span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase ${
            isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
          }`}>
            Skill Set
          </h1>
          <p className={`text-sm md:text-base leading-relaxed ${
            isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
          }`}>
            Categorized technical capabilities, design principles, and business proficiencies. Structured without arbitrary percentage bars.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-16">
          {publishedCategories.map((category) => {
            const categorySkills = skills
              .filter(s => s.categoryId === category.id && s.published)
              .sort((a, b) => a.displayOrder - b.displayOrder);

            return (
              <div key={category.id} className="space-y-6">
                {/* Category Header */}
                <div className={`flex items-center gap-3 border-b pb-3 ${
                  isDark ? 'border-[#131F37]' : 'border-slate-200'
                }`}>
                  <div className={`p-2.5 rounded-lg border shadow-sm transition-transform duration-300 hover:scale-105 ${
                    isDark 
                      ? 'bg-[#0B132B] border-[#1E293B]' 
                      : 'bg-white border-[#CBD5E1]'
                  }`}>
                    {getCategoryIcon(category.slug, category.name)}
                  </div>
                  <div>
                    <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${
                      isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
                    }`}>
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className={`text-xs font-mono mt-0.5 ${
                        isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
                      }`}>
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills Grid with Smooth Pop Out Hover Effect */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`p-5 rounded-xl border space-y-2.5 cursor-default transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02] shadow-sm ${
                        isDark
                          ? 'bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/70 hover:shadow-[0_10px_25px_rgba(0,229,255,0.18)]'
                          : 'bg-white border-[#CBD5E1] hover:border-[#00838F]/70 hover:shadow-[0_10px_25px_rgba(0,131,143,0.18)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-bold tracking-tight transition-colors ${
                          isDark 
                            ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' 
                            : 'text-[#0F172A] group-hover:text-[#00838F]'
                        }`}>
                          {skill.name}
                        </h3>
                        <span className={`w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125 ${
                          isDark ? 'bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)]' : 'bg-[#00838F]'
                        }`} />
                      </div>

                      {skill.description && (
                        <p className={`text-xs leading-relaxed ${
                          isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                        }`}>
                          {skill.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Services Offered Section with Center Aligned Heading */}
        <div className={`pt-16 border-t space-y-12 ${isDark ? 'border-[#1E293B]' : 'border-slate-200'}`}>
          {/* Center-aligned Section Heading */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className={`text-xs font-mono uppercase tracking-widest inline-flex items-center gap-2 ${
              isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'
            }`}>
              <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
              Professional Engagements
              <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
            </span>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase ${
              isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
            }`}>
              Services Offered
            </h2>
            <p className={`text-sm md:text-base leading-relaxed ${
              isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
            }`}>
              Direct freelance, contract, and advisory services across digital systems, interface craftsmanship, and business digitization.
            </p>
          </div>

          {/* Services Cards Grid with Smooth Pop Out Hover Effect & No Serial Numbering */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedServices.map((service) => (
              <div
                key={service.id}
                className={`p-7 rounded-xl border transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] space-y-5 flex flex-col justify-between group shadow-sm ${
                  isDark
                    ? 'bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/70 hover:shadow-[0_12px_30px_rgba(0,229,255,0.2)]'
                    : 'bg-white border-[#CBD5E1] hover:border-[#00838F]/70 hover:shadow-[0_12px_30px_rgba(0,131,143,0.18)]'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Badge (Featured Tag if present, no serial numbers) */}
                  {service.featured && (
                    <div className="flex items-center justify-start">
                      <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-md border flex items-center gap-1 ${
                        isDark 
                          ? 'bg-[#050814] border-[#00E5FF]/40 text-[#00E5FF]' 
                          : 'bg-cyan-50 border-cyan-300 text-[#00838F]'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    </div>
                  )}

                  <h3 className={`text-lg font-bold transition-colors leading-snug ${
                    isDark 
                      ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' 
                      : 'text-[#0F172A] group-hover:text-[#00838F]'
                  }`}>
                    {service.title}
                  </h3>

                  <p className={`text-xs font-medium leading-relaxed ${
                    isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'
                  }`}>
                    {service.shortDescription}
                  </p>

                  {service.description && (
                    <p className={`text-xs leading-relaxed pt-3 border-t ${
                      isDark ? 'text-[#94A3B8] border-[#131F37]' : 'text-[#64748B] border-slate-100'
                    }`}>
                      {service.description}
                    </p>
                  )}
                </div>

                <div className={`pt-4 border-t flex items-center justify-between ${
                  isDark ? 'border-[#131F37]' : 'border-slate-100'
                }`}>
                  <button
                    onClick={() => setCurrentRoute('contact')}
                    className={`text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors ${
                      isDark 
                        ? 'text-[#00E5FF] hover:text-[#38BDF8]' 
                        : 'text-[#00838F] hover:text-[#0284C7]'
                    }`}
                  >
                    <span>Inquire for Project</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bespoke Engagement Callout */}
          <div className={`p-7 sm:p-9 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-center md:text-left transition-all duration-300 transform hover:scale-[1.01] ${
            isDark 
              ? 'bg-[#0B132B] border-[#1E3A5F]' 
              : 'bg-white border-[#CBD5E1]'
          }`}>
            <div>
              <h3 className={`text-base sm:text-lg font-bold ${
                isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
              }`}>
                Need a bespoke engagement or consulting model?
              </h3>
              <p className={`text-xs sm:text-sm font-mono mt-1 ${
                isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
              }`}>
                Flexible timelines and tailored project scopes available.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentRoute('work')}
                className={`px-6 py-3 text-xs font-mono uppercase tracking-wider rounded-md border transition-all ${
                  isDark
                    ? 'text-[#F8FAFC] bg-[#0B132B] hover:bg-[#0F1B38] border-[#1E3A5F] hover:border-[#00E5FF]/40'
                    : 'text-[#0F172A] bg-slate-50 hover:bg-slate-100 border-[#CBD5E1] hover:border-[#00838F]/40'
                }`}
              >
                View Projects
              </button>
              <button
                onClick={() => setCurrentRoute('contact')}
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00E5FF] transition-all rounded-md shrink-0 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.02]"
              >
                Start a Conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ServicesView: React.FC = () => {
  const { services, setCurrentRoute } = useData();
  const { isDark } = useTheme();

  const publishedServices = services
    .filter(s => s.published)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });

  return (
    <div className="py-12 md:py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        <div className={`space-y-4 border-b pb-10 max-w-3xl ${isDark ? 'border-[#1E293B]' : 'border-slate-200'}`}>
          <span className={`text-xs font-mono uppercase tracking-widest flex items-center gap-2 ${
            isDark ? 'text-[#00E5FF]' : 'text-[#00838F]'
          }`}>
            <span className={`w-2 h-[1px] ${isDark ? 'bg-[#00E5FF]' : 'bg-[#00838F]'}`} />
            Professional Engagements
          </span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase ${
            isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
          }`}>
            What I Can Provide
          </h1>
          <p className={`text-sm md:text-base leading-relaxed ${
            isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
          }`}>
            Direct freelance, contract, and advisory services across digital systems, interface craftsmanship, and business digitization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedServices.map((service) => (
            <div
              key={service.id}
              className={`p-8 rounded-xl border transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] space-y-4 flex flex-col justify-between group shadow-sm ${
                isDark
                  ? 'bg-[#0B132B] border-[#1E293B] hover:border-[#00E5FF]/70 hover:shadow-[0_12px_30px_rgba(0,229,255,0.2)]'
                  : 'bg-white border-[#CBD5E1] hover:border-[#00838F]/70 hover:shadow-[0_12px_30px_rgba(0,131,143,0.18)]'
              }`}
            >
              <div className="space-y-3">
                {service.featured && (
                  <div className="flex items-center justify-start">
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-md border flex items-center gap-1 ${
                      isDark 
                        ? 'bg-[#050814] border-[#00E5FF]/40 text-[#00E5FF]' 
                        : 'bg-cyan-50 border-cyan-300 text-[#00838F]'
                    }`}>
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  </div>
                )}

                <h2 className={`text-xl font-bold transition-colors leading-snug ${
                  isDark 
                    ? 'text-[#F8FAFC] group-hover:text-[#00E5FF]' 
                    : 'text-[#0F172A] group-hover:text-[#00838F]'
                }`}>
                  {service.title}
                </h2>

                <p className={`text-xs font-medium leading-relaxed ${
                  isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'
                }`}>
                  {service.shortDescription}
                </p>

                {service.description && (
                  <p className={`text-xs leading-relaxed pt-2 border-t ${
                    isDark ? 'text-[#94A3B8] border-[#131F37]' : 'text-[#64748B] border-slate-100'
                  }`}>
                    {service.description}
                  </p>
                )}
              </div>

              <div className={`pt-4 border-t flex items-center justify-between ${
                isDark ? 'border-[#131F37]' : 'border-slate-100'
              }`}>
                <button
                  onClick={() => setCurrentRoute('contact')}
                  className={`text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors ${
                    isDark 
                      ? 'text-[#00E5FF] hover:text-[#38BDF8]' 
                      : 'text-[#00838F] hover:text-[#0284C7]'
                  }`}
                >
                  <span>Inquire for Project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={`p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl transition-all duration-300 transform hover:scale-[1.01] ${
          isDark 
            ? 'bg-[#0B132B] border-[#1E3A5F]' 
            : 'bg-white border-[#CBD5E1]'
        }`}>
          <div>
            <h3 className={`text-base font-semibold ${
              isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]'
            }`}>
              Need a bespoke engagement or consulting model?
            </h3>
            <p className={`text-xs font-mono mt-1 ${
              isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
            }`}>
              Flexible timelines and tailored project scopes available.
            </p>
          </div>
          <button
            onClick={() => setCurrentRoute('contact')}
            className="px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#050814] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#00E5FF] transition-all rounded-md shrink-0 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            Start a Conversation
          </button>
        </div>
      </div>
    </div>
  );
};
