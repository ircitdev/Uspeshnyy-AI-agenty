import React, { useState, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BotVsAgent } from './components/BotVsAgent';
import { AgentsShowcase } from './components/AgentsShowcase';
// Симулятор и калькулятор тянут Recharts и лежат глубоко на странице —
// грузим их отдельными кусками, когда до них доскроллили.
const AgentSimulator = lazy(() =>
  import('./components/AgentSimulator').then(m => ({ default: m.AgentSimulator })));
const RoiCalculator = lazy(() =>
  import('./components/RoiCalculator').then(m => ({ default: m.RoiCalculator })));
import { SmartQuiz } from './components/SmartQuiz';
import { QuickPoll } from './components/QuickPoll';
import { AiReadinessAssessment } from './components/AiReadinessAssessment';
import { IntegrationsMap } from './components/IntegrationsMap';
import { DevelopmentRoadmap } from './components/DevelopmentRoadmap';
import { CaseResults } from './components/CaseResults';
import { WorkProcess } from './components/WorkProcess';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { ContactModal } from './components/ContactModal';
import { StickyCta } from './components/StickyCta';
import { AuditWizard } from './components/AuditWizard';
import { useScrollAnimations, useThemedImages } from './hooks/useScrollAnimations';
import { Footer } from './components/Footer';
import { ScrollReveal } from './components/ScrollReveal';

export default function App() {
  const [selectedAgentForDemo, setSelectedAgentForDemo] = useState<string>('qualifier');
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [consultationTopic, setConsultationTopic] = useState<string>('Разбор процесса');

  const [isAuditOpen, setIsAuditOpen] = useState<boolean>(false);

  // Основное целевое действие — мастер разбора: человек получает отчёт
  // в Telegram за минуту вместо ожидания звонка. Простая форма осталась
  // запасным путём, её открывает handleOpenContactForm.
  const handleOpenConsultation = (topic?: string) => {
    if (topic) setConsultationTopic(topic);
    setIsAuditOpen(true);
  };

  const handleOpenContactForm = (topic?: string) => {
    if (topic) setConsultationTopic(topic);
    setIsConsultationOpen(true);
  };

  const handleSelectAgentForDemo = (agentId: string) => {
    setSelectedAgentForDemo(agentId);
    const simEl = document.getElementById('simulator');
    if (simEl) {
      simEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSimulator = () => {
    const simEl = document.getElementById('simulator');
    if (simEl) {
      simEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useScrollAnimations();
  useThemedImages();

  return (
    <div className="min-h-screen flex flex-col bg-[#eef4fa] dark:bg-[#030a14] text-[#3a4d63] dark:text-[#b6c6da] transition-colors duration-300">
      {/* Sticky Header */}
      <Header onOpenConsultation={handleOpenConsultation} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onOpenConsultation={handleOpenConsultation}
          onScrollToSimulator={handleScrollToSimulator}
        />

        {/* Bot vs Agent Comparison */}
        <ScrollReveal direction="up" distance={30} delay={0.05}>
          <BotVsAgent />
        </ScrollReveal>

        {/* Five Ready-made Agents */}
        <ScrollReveal direction="up" distance={32}>
          <AgentsShowcase 
            onSelectAgentForDemo={handleSelectAgentForDemo}
            onOpenConsultation={handleOpenConsultation}
          />
        </ScrollReveal>

        {/* Interactive Live Demo Simulator */}
        <ScrollReveal direction="up" distance={32}>
          <Suspense fallback={<div className="min-h-[560px]" aria-hidden="true" />}>
          <AgentSimulator 
            selectedAgentId={selectedAgentForDemo}
            onSelectAgent={setSelectedAgentForDemo}
            onOpenConsultation={handleOpenConsultation}
          />
          </Suspense>
        </ScrollReveal>

        {/* ROI & Payback Calculator */}
        <ScrollReveal direction="up" distance={30}>
          <Suspense fallback={<div className="min-h-[520px]" aria-hidden="true" />}>
            <RoiCalculator onOpenConsultation={handleOpenConsultation} />
          </Suspense>
        </ScrollReveal>

        {/* Diagnostic Quiz */}
        <ScrollReveal direction="up" distance={30}>
          <SmartQuiz onOpenConsultation={handleOpenConsultation} />
        </ScrollReveal>

        {/* Quick Poll: Primary Business Obstacle */}
        <ScrollReveal direction="up" distance={30}>
          <QuickPoll onOpenConsultation={handleOpenConsultation} />
        </ScrollReveal>

        {/* AI Readiness Assessment (5-question readiness index tool) */}
        <ScrollReveal direction="up" distance={30}>
          <AiReadinessAssessment onOpenConsultation={handleOpenConsultation} />
        </ScrollReveal>

        {/* Integrations Map */}
        <ScrollReveal direction="up" distance={30}>
          <IntegrationsMap />
        </ScrollReveal>

        {/* Development Roadmap (From Analysis to Automation & Continuous Optimization) */}
        <ScrollReveal direction="up" distance={30}>
          <DevelopmentRoadmap onOpenConsultation={handleOpenConsultation} />
        </ScrollReveal>

        {/* Two-Column Section: Real Results & Process Flow */}
        <section className="py-10 sm:py-14" id="how">
          <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <ScrollReveal direction="up" distance={28}>
                <div id="cases">
                  <CaseResults />
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={28} delay={0.08}>
                <WorkProcess />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <ScrollReveal direction="up" distance={30}>
          <PricingSection onOpenConsultation={handleOpenConsultation} />
        </ScrollReveal>

        {/* FAQ Section */}
        <section className="py-6 sm:py-10">
          <div className="max-w-[1480px] mx-auto px-5 sm:px-7">
            <ScrollReveal direction="up" distance={30}>
              <FaqSection />
            </ScrollReveal>
          </div>
        </section>

        {/* Final CTA Banner */}
        <ScrollReveal direction="scale" distance={20}>
          <FinalCta onOpenConsultation={handleOpenConsultation} onOpenContactForm={handleOpenContactForm} />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <AuditWizard isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />

      <StickyCta onOpenConsultation={handleOpenConsultation} />

      <Footer />

      {/* Consultation Modal */}
      <ContactModal 
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        defaultTopic={consultationTopic}
      />
    </div>
  );
}
