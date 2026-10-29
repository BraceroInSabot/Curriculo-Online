import type { ResumeOverview } from '@application/use-cases/GetResumeOverview';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { StatusScreen } from './components/StatusScreen/StatusScreen';
import { useResumeOverview } from './hooks/useResumeOverview';
import { NAVIGATION_ITEMS, SECTION_IDS } from './navigation';
import { AboutSection } from './sections/AboutSection/AboutSection';
import { ContactSection } from './sections/ContactSection/ContactSection';
import { EducationSection } from './sections/EducationSection/EducationSection';
import { ExperienceSection } from './sections/ExperienceSection/ExperienceSection';
import { HeroSection } from './sections/HeroSection/HeroSection';import { ProjectsSection } from './sections/ProjectsSection/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection/SkillsSection';

export function App() {
  const state = useResumeOverview();

  switch (state.status) {
    case 'loading':
      return <StatusScreen message="Carregando currículo…" />;
    case 'error':
      return <StatusScreen message={`Não foi possível carregar o currículo. ${state.error.message}`} />;
    case 'success':
      return <ResumePage resume={state.data} />;
  }
}

function ResumePage({ resume }: { readonly resume: ResumeOverview }) {
  const { profile } = resume;
  const github = profile.contacts.find((contact) => contact.kind === 'github');

  return (
    <>
      <Header
        name={profile.shortName}
        homeHref={`#${SECTION_IDS.top}`}
        navigation={NAVIGATION_ITEMS}
        socialLinks={profile.contacts.filter((contact) => contact.kind !== 'email')}
      />
      <main>
        <HeroSection
          id={SECTION_IDS.top}
          profile={profile}
          keywords={resume.skillGroups.flatMap((group) => group.skills)}
        />
        <AboutSection
          id={SECTION_IDS.about}
          profile={profile}
          currentPosition={resume.currentPosition}
          education={resume.education}
        />
        <ExperienceSection id={SECTION_IDS.experience} experiences={resume.experiences} />
        <EducationSection id={SECTION_IDS.education} education={resume.education} />
        <SkillsSection id={SECTION_IDS.skills} skillGroups={resume.skillGroups} />
        <ProjectsSection
          id={SECTION_IDS.projects}
          featured={resume.featuredProjects}
          others={resume.otherProjects}
          allProjectsUrl={github ? `${github.url}?tab=repositories` : undefined}
        />
        <ContactSection id={SECTION_IDS.contact} location={profile.location} contacts={profile.contacts} />
      </main>
      <Footer ownerName={profile.shortName} navigation={NAVIGATION_ITEMS} topAnchor={SECTION_IDS.top} />
    </>
  );
}
