import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Brain, Pill, Activity, Stethoscope, Sparkles, ChevronLeft, ChevronRight, Calendar, BookOpen, Settings } from "lucide-react";
import { Button } from "./components/ui/button";
import { AnkiCard } from "./components/AnkiCard";
import { DrugInfoPanel } from "./components/DrugInfoPanel";
import { AnatomyViewer } from "./components/AnatomyViewer";
import { PracticeQuestions } from "./components/PracticeQuestions";
import { ClinicalViewer } from "./components/ClinicalViewer";
import { SchedulePlanner } from "./components/SchedulePlanner";
import { OverviewPanel } from "./components/OverviewPanel";
import { Chatbot } from "./components/Chatbot";
import {
  SAMPLE_ANKI_CARDS,
  MOCK_DRUGS,
  MOCK_DISEASES,
  ANATOMY_MODELS,
  generatePracticeQuestions,
  type PracticeQuestion,
  type DrugInfo,
  type DiseaseInfo,
  type AnatomyModel,
} from "./data/mockData";
import { fetchStudyData } from "./data/studyApi";

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [ankiCards, setAnkiCards] = useState(SAMPLE_ANKI_CARDS);
  const [drugs, setDrugs] = useState(MOCK_DRUGS);
  const [diseases, setDiseases] = useState(MOCK_DISEASES);
  const [anatomyModels, setAnatomyModels] = useState(ANATOMY_MODELS);
  const [practiceQuestionsByCard, setPracticeQuestionsByCard] = useState<Record<string, PracticeQuestion[]>>({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<DrugInfo | undefined>();
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | undefined>();
  const [wrongAnswerCount, setWrongAnswerCount] = useState<Record<string, number>>({});
  const [practiceSessionNote, setPracticeSessionNote] = useState<string | null>(null);
  const [showSidebarSettings, setShowSidebarSettings] = useState(false);
  const [isLoadingDynamicData, setIsLoadingDynamicData] = useState(false);
  const [dynamicDataError, setDynamicDataError] = useState<string | null>(null);
  const [enabledTabs, setEnabledTabs] = useState({
    overview: true,
    drugs: true,
    anatomy: true,
    clinicals: true,
  });
  const enabledTabCount = Object.values(enabledTabs).filter(Boolean).length;
  const sidebarTabsGridClass =
    enabledTabCount === 1
      ? "grid-cols-1"
      : enabledTabCount === 2
        ? "grid-cols-2"
        : enabledTabCount === 3
          ? "grid-cols-3"
          : "grid-cols-4";

  const currentCard = ankiCards[currentCardIndex] ?? SAMPLE_ANKI_CARDS[0];
  const totalCardCount = Math.max(ankiCards.length, 1);

  // Extract drug and disease mentions from card content
  const extractMedicalTerms = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Check for drugs
    let drug: DrugInfo | undefined;
    Object.keys(drugs).forEach(drugName => {
      if (lowerText.includes(drugName.toLowerCase())) {
        drug = drugs[drugName];
      }
    });

    // Check for diseases
    let disease: DiseaseInfo | undefined;
    Object.keys(diseases).forEach(diseaseName => {
      if (lowerText.includes(diseaseName.toLowerCase())) {
        disease = diseases[diseaseName];
      }
    });

    return { drug, disease };
  };

  const handleCardChange = (index: number) => {
    setCurrentCardIndex(index);
    const card = ankiCards[index] ?? SAMPLE_ANKI_CARDS[0];
    const { drug, disease } = extractMedicalTerms(card.front + " " + card.back);
    setSelectedDrug(drug);
    setSelectedDisease(disease);
  };

  const handleAgain = () => {
    const cardId = currentCard.id;
    const newCount = (wrongAnswerCount[cardId] || 0) + 1;
    setWrongAnswerCount({ ...wrongAnswerCount, [cardId]: newCount });

    // Generate practice questions after 2 wrong answers
    if (newCount >= 2) {
      const raw =
        practiceQuestionsByCard[cardId] && practiceQuestionsByCard[cardId].length > 0
          ? practiceQuestionsByCard[cardId]
          : generatePracticeQuestions(cardId, currentCard.front + " " + currentCard.back);
      setPracticeQuestions(
        raw.map((q) => ({ ...q, sourceCardId: q.sourceCardId ?? cardId }))
      );
    }

    // Move to next card
    const nextIndex = (currentCardIndex + 1) % totalCardCount;
    handleCardChange(nextIndex);
  };

  const handleGood = () => {
    const nextIndex = (currentCardIndex + 1) % totalCardCount;
    handleCardChange(nextIndex);
  };

  const handleEasy = () => {
    const nextIndex = (currentCardIndex + 1) % totalCardCount;
    handleCardChange(nextIndex);
  };

  const handlePrevCard = () => {
    const prevIndex = currentCardIndex === 0 ? totalCardCount - 1 : currentCardIndex - 1;
    handleCardChange(prevIndex);
  };

  const handleNextCard = () => {
    const nextIndex = (currentCardIndex + 1) % totalCardCount;
    handleCardChange(nextIndex);
  };

  const handleGenerateQuestions = () => {
    const weakCardIds = ankiCards
      .map((c) => c.id)
      .filter((id) => (wrongAnswerCount[id] ?? 0) > 0)
      .sort((a, b) => (wrongAnswerCount[b] ?? 0) - (wrongAnswerCount[a] ?? 0));

    const cardsToQuiz =
      weakCardIds.length > 0
        ? weakCardIds
            .map((id) => ankiCards.find((c) => c.id === id))
            .filter((c): c is (typeof ankiCards)[number] => Boolean(c))
        : ankiCards;

    setPracticeSessionNote(
      weakCardIds.length > 0
        ? "These multiple-choice questions focus on flashcards you've marked Again or missed in practice (weakest areas first)."
        : "No weak spots tracked yet - using all cards. Press Again while studying or miss a practice question to personalize the next set."
    );

    const collected: PracticeQuestion[] = [];
    const seenIds = new Set<string>();

    for (const card of cardsToQuiz) {
      const raw =
        practiceQuestionsByCard[card.id] && practiceQuestionsByCard[card.id].length > 0
          ? practiceQuestionsByCard[card.id]
          : generatePracticeQuestions(card.id, `${card.front} ${card.back}`);

      for (const q of raw) {
        const withSource: PracticeQuestion = { ...q, sourceCardId: q.sourceCardId ?? card.id };
        if (seenIds.has(withSource.id)) continue;
        seenIds.add(withSource.id);
        collected.push(withSource);
      }
    }

    setPracticeQuestions(shuffleArray(collected));
  };

  const handlePracticeAnswerResult = (payload: { sourceCardId?: string; correct: boolean }) => {
    if (payload.correct || !payload.sourceCardId) return;
    setWrongAnswerCount((prev) => ({
      ...prev,
      [payload.sourceCardId]: (prev[payload.sourceCardId] ?? 0) + 1,
    }));
  };

  // Determine which anatomy model to show based on card content
  const getRelevantAnatomyModel = (): AnatomyModel => {
    const cardText = (currentCard.front + " " + currentCard.back).toLowerCase();
    if (cardText.includes("heart") || cardText.includes("cardiac") || cardText.includes("ventricular") || cardText.includes("atrial")) {
      return anatomyModels.heart;
    }
    if (cardText.includes("lung") || cardText.includes("pulmonary") || cardText.includes("respiratory")) {
      return anatomyModels.lung;
    }
    if (cardText.includes("kidney") || cardText.includes("renal") || cardText.includes("nephron")) {
      return anatomyModels.kidney;
    }
    // Default to heart if no match
    return anatomyModels.heart ?? Object.values(anatomyModels)[0];
  };

  // Initialize drug and disease on mount
  useState(() => {
    const { drug, disease } = extractMedicalTerms(currentCard.front + " " + currentCard.back);
    setSelectedDrug(drug);
    setSelectedDisease(disease);
  });

  useEffect(() => {
    let isMounted = true;

    const loadDynamicData = async () => {
      setIsLoadingDynamicData(true);
      setDynamicDataError(null);
      try {
        const dynamicData = await fetchStudyData();
        if (!isMounted) return;
        setAnkiCards(dynamicData.cards);
        setDrugs(dynamicData.drugs);
        setDiseases(dynamicData.diseases);
        setAnatomyModels(dynamicData.anatomyModels);
        setPracticeQuestionsByCard(dynamicData.practiceQuestionsByCard);
        setCurrentCardIndex(0);
      } catch (error) {
        if (!isMounted) return;
        setDynamicDataError(error instanceof Error ? error.message : "Failed to load LLM-backed data");
      } finally {
        if (isMounted) setIsLoadingDynamicData(false);
      }
    };

    void loadDynamicData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AXON
                </h1>
                <p className="text-xs text-gray-500">Adaptive eXperience for Optimized Navigation</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Medical Education
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <Tabs defaultValue="study" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="study" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Anki Study</span>
              <span className="sm:hidden">Study</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
              <span className="sm:hidden">Practice</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Schedule</span>
            </TabsTrigger>
          </TabsList>

          {/* Anki Study Tab */}
          <TabsContent value="study" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Enhanced Anki Study Session
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Study your flashcards with AI-powered drug information, disease context, and adaptive practice questions
                </p>
                {(isLoadingDynamicData || dynamicDataError) && (
                  <p className={`text-xs mt-2 ${dynamicDataError ? "text-amber-700" : "text-blue-700"}`}>
                    {dynamicDataError
                      ? `Using local mock data (${dynamicDataError}).`
                      : "Loading LLM-backed study data..."}
                  </p>
                )}
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AnkiCard
                  front={currentCard.front}
                  back={currentCard.back}
                  tags={currentCard.tags}
                  onAgain={handleAgain}
                  onGood={handleGood}
                  onEasy={handleEasy}
                />

                {/* Card Navigator with Arrows */}
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevCard}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex gap-2">
                    {ankiCards.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCardChange(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentCardIndex
                            ? "bg-blue-600 w-8"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextCard}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Sidebar Settings Toggle */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Sidebar Panels</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSidebarSettings(!showSidebarSettings)}
                    className="h-8"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    {showSidebarSettings ? "Done" : "Customize"}
                  </Button>
                </div>

                {/* Settings Panel */}
                {showSidebarSettings && (
                  <Card className="mb-4 bg-gray-50">
                    <CardContent className="p-4 space-y-3">
                      <p className="text-xs text-gray-600 mb-3">Choose which panels to display:</p>
                      
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabledTabs.overview}
                          onChange={(e) => setEnabledTabs({ ...enabledTabs, overview: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">Overview</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabledTabs.drugs}
                          onChange={(e) => setEnabledTabs({ ...enabledTabs, drugs: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Pill className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Drugs</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabledTabs.anatomy}
                          onChange={(e) => setEnabledTabs({ ...enabledTabs, anatomy: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Anatomy</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabledTabs.clinicals}
                          onChange={(e) => setEnabledTabs({ ...enabledTabs, clinicals: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Stethoscope className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Clinical</span>
                      </label>
                    </CardContent>
                  </Card>
                )}

                <Tabs defaultValue={enabledTabs.overview ? "overview" : enabledTabs.drugs ? "drugs" : enabledTabs.anatomy ? "anatomy" : "clinicals"} className="w-full">
                  <TabsList className={`grid w-full ${sidebarTabsGridClass}`}>
                    {enabledTabs.overview && (
                      <TabsTrigger value="overview" className="text-xs px-1 sm:px-2">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Overview
                      </TabsTrigger>
                    )}
                    {enabledTabs.drugs && (
                      <TabsTrigger value="drugs" className="text-xs px-1 sm:px-2">
                        <Pill className="w-3 h-3 mr-1" />
                        Drugs
                      </TabsTrigger>
                    )}
                    {enabledTabs.anatomy && (
                      <TabsTrigger value="anatomy" className="text-xs px-1 sm:px-2">
                        <Activity className="w-3 h-3 mr-1" />
                        Anatomy
                      </TabsTrigger>
                    )}
                    {enabledTabs.clinicals && (
                      <TabsTrigger value="clinicals" className="text-xs px-1 sm:px-2">
                        <Stethoscope className="w-3 h-3 mr-1" />
                        Clinical
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {enabledTabs.overview && (
                    <TabsContent value="overview" className="mt-4">
                      <OverviewPanel 
                        cardText={currentCard.front + " " + currentCard.back}
                        disease={selectedDisease}
                      />
                    </TabsContent>
                  )}

                  {enabledTabs.drugs && (
                    <TabsContent value="drugs" className="mt-4">
                      <DrugInfoPanel drug={selectedDrug} disease={selectedDisease} />
                    </TabsContent>
                  )}

                  {enabledTabs.anatomy && (
                    <TabsContent value="anatomy" className="mt-4">
                      <AnatomyViewer model={getRelevantAnatomyModel()} showClinicalRelevance={false} />
                    </TabsContent>
                  )}

                  {enabledTabs.clinicals && (
                    <TabsContent value="clinicals" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-blue-600" />
                            Clinical Relevance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm">{getRelevantAnatomyModel().clinicalRelevance}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Key Structures:</h4>
                            {getRelevantAnatomyModel().structures.map((structure, index) => (
                              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="font-semibold text-sm mb-1">{structure.name}</div>
                                <p className="text-xs text-gray-600 mb-2">{structure.description}</p>
                                <div className="text-sm">
                                  <span className="font-semibold">🩺 Clinical Pearl: </span>
                                  {structure.clinicalPearl}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Adaptive Practice Questions
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Multiple-choice quiz: submit to see if you're right, the correct answer, and an explanation. New sets prioritize topics you've missed.
                    </p>
                    {practiceSessionNote && practiceQuestions.length > 0 && (
                      <p className="text-xs text-purple-700 mt-2 max-w-xl">{practiceSessionNote}</p>
                    )}
                  </div>
                  <Button 
                    onClick={handleGenerateQuestions}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Questions
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {practiceQuestions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No Practice Questions Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Click "Generate Questions" to create AI-powered practice questions from your flashcards, or mark cards as "Hard" during study to automatically generate questions.
                  </p>
                  <Button 
                    onClick={handleGenerateQuestions}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Questions Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <PracticeQuestions
                questions={practiceQuestions}
                onAnswerResult={handlePracticeAnswerResult}
              />
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <SchedulePlanner totalCards={ankiCards.length} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Chatbot */}
      <Chatbot currentCard={currentCard} />

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">AXON</span> - Built for medical students, by medical students
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <Badge variant="secondary">OpenFDA API</Badge>
              <Badge variant="secondary">Claude AI</Badge>
              <Badge variant="secondary">Three.js</Badge>
              <Badge variant="secondary">React</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}