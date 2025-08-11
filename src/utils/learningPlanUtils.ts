import { LearningPlan, MonthlyPlan } from '../types/types';

export const getDefaultLearningPlan = (): LearningPlan => ({
  title: "Ayoub's Intensive Plan: A2 → B2",
  period: "August–December 2025 | Target: B2 by Dec 12",
  months: [
    {
      month: "August 2025",
      level: "Phase 1: B1 Foundation (Week 1-4)",
      description: "🎯 GOAL: Solid A2 review + B1 grammar foundation | 4-5h daily | 25 words/week",
      grammar: [
        { id: "aug-g1", topic: "Week 1: Perfekt vs. Präteritum (Netzwerk B1 Kap. 1-2)", completed: false },
        { id: "aug-g2", topic: "Week 2: Dativ/Akkusativ + Wechselpräpositionen", completed: false },
        { id: "aug-g3", topic: "Week 3: Modalverben (sollen, müssen, dürfen)", completed: false },
        { id: "aug-g4", topic: "Week 4: Konjunktionen (weil, dass, wenn, obwohl)", completed: false },
        { id: "aug-g5", topic: "Daily: Adjektivdeklination (bestimmt/unbestimmt)", completed: false }
      ],
      vocabulary: [
        { id: "aug-v1", topic: "Week 1: Familie & Beziehungen (25 Wörter)", targetWords: 25, learnedWords: 0 },
        { id: "aug-v2", topic: "Week 2: Arbeit & Beruf (25 Wörter)", targetWords: 25, learnedWords: 0 },
        { id: "aug-v3", topic: "Week 3: Gesundheit & Körper (25 Wörter)", targetWords: 25, learnedWords: 0 },
        { id: "aug-v4", topic: "Week 4: Wohnen & Leben (25 Wörter)", targetWords: 25, learnedWords: 0 }
      ],
      listening: [
        { id: "aug-l1", goal: "Easy German Videos (B1 level)", target: 20, completed: 0 },
        { id: "aug-l2", goal: "Deutsche Welle Langsam gesprochene Nachrichten", target: 28, completed: 0 },
        { id: "aug-l3", goal: "Netzwerk B1 Audio-Übungen", target: 15, completed: 0 }
      ],
      writing: [
        { id: "aug-w1", task: "Persönliche E-Mails (100-120 Wörter)", frequency: "2x pro Woche", completed: 0, target: 8 },
        { id: "aug-w2", task: "Tagebuch schreiben (80-100 Wörter)", frequency: "täglich", completed: 0, target: 31 },
        { id: "aug-w3", task: "Formelle Briefe üben", frequency: "1x pro Woche", completed: 0, target: 4 }
      ],
      speaking: [
        { id: "aug-s1", goal: "Gespräche mit Lehrer/Partner (30 min)", frequency: "3x pro Woche", completed: 0, target: 12 },
        { id: "aug-s2", goal: "Selbstgespräche/Monolog (10 min)", frequency: "täglich", completed: 0, target: 31 },
        { id: "aug-s3", goal: "Shadowing Easy German Videos", frequency: "täglich", completed: 0, target: 31 }
      ]
    },
    {
      month: "September 2025",
      level: "Phase 1: B1 Intensive (Week 5-8)",
      description: "🚀 GOAL: B1 mastery + complex structures | 4-5h daily | 30 words/week",
      grammar: [
        { id: "sep-g1", topic: "Week 1: Konjunktiv II (würde, hätte, wäre)", completed: false },
        { id: "sep-g2", topic: "Week 2: Passiv (Präsens, Präteritum, Perfekt)", completed: false },
        { id: "sep-g3", topic: "Week 3: Relativsätze (Nominativ, Akkusativ, Dativ)", completed: false },
        { id: "sep-g4", topic: "Week 4: Indirekte Rede + Temporale Nebensätze", completed: false },
        { id: "sep-g5", topic: "Daily: Wiederholung + B1 Prüfungsgrammatik", completed: false }
      ],
      vocabulary: [
        { id: "sep-v1", topic: "Week 1: Umwelt & Natur (30 Wörter)", targetWords: 30, learnedWords: 0 },
        { id: "sep-v2", topic: "Week 2: Medien & Technologie (30 Wörter)", targetWords: 30, learnedWords: 0 },
        { id: "sep-v3", topic: "Week 3: Kultur & Freizeit (30 Wörter)", targetWords: 30, learnedWords: 0 },
        { id: "sep-v4", topic: "Week 4: Reisen & Verkehr (30 Wörter)", targetWords: 30, learnedWords: 0 }
      ],
      listening: [
        { id: "sep-l1", goal: "Easy German Videos (komplexere Themen)", target: 25, completed: 0 },
        { id: "sep-l2", goal: "Deutsch lernen mit Jenny (B1)", target: 15, completed: 0 },
        { id: "sep-l3", goal: "Slow German Podcast", target: 12, completed: 0 },
        { id: "sep-l4", goal: "B1 Prüfungshörübungen", target: 10, completed: 0 }
      ],
      writing: [
        { id: "sep-w1", task: "Formelle Briefe (150-180 Wörter)", frequency: "2x pro Woche", completed: 0, target: 8 },
        { id: "sep-w2", task: "Meinungsäußerung/Argumentation", frequency: "2x pro Woche", completed: 0, target: 8 },
        { id: "sep-w3", task: "B1 Prüfungsschreiben üben", frequency: "1x pro Woche", completed: 0, target: 4 }
      ],
      speaking: [
        { id: "sep-s1", goal: "Diskussionen führen (45 min)", frequency: "3x pro Woche", completed: 0, target: 12 },
        { id: "sep-s2", goal: "Präsentationen (10 min)", frequency: "2x pro Woche", completed: 0, target: 8 },
        { id: "sep-s3", goal: "B1 Prüfungssimulation", frequency: "1x pro Woche", completed: 0, target: 4 }
      ]
    },
    {
      month: "October 2025",
      level: "Phase 1: B1 Perfection + B2 Start (Week 9-13)",
      description: "🎯 GOAL: B1 certification ready + B2 introduction | 5h daily | 35 words/week",
      grammar: [
        { id: "oct-g1", topic: "Week 1: B1 Mock Exam + Fehleranalyse", completed: false },
        { id: "oct-g2", topic: "Week 2: Erweiterte Konjunktiv II + Partizipien", completed: false },
        { id: "oct-g3", topic: "Week 3: Nominalisierung (Netzwerk B2 Kap. 1)", completed: false },
        { id: "oct-g4", topic: "Week 4: Kausale/finale Nebensätze (B2 Start)", completed: false },
        { id: "oct-g5", topic: "Week 5: Subjektive Modalverben (müssen/können)", completed: false }
      ],
      vocabulary: [
        { id: "oct-v1", topic: "Week 1-2: B1 Prüfungswortschatz (70 Wörter)", targetWords: 70, learnedWords: 0 },
        { id: "oct-v2", topic: "Week 3: Politik & Gesellschaft (35 Wörter)", targetWords: 35, learnedWords: 0 },
        { id: "oct-v3", topic: "Week 4: Wissenschaft & Forschung (35 Wörter)", targetWords: 35, learnedWords: 0 },
        { id: "oct-v4", topic: "Week 5: Wirtschaft & Finanzen (35 Wörter)", targetWords: 35, learnedWords: 0 }
      ],
      listening: [
        { id: "oct-l1", goal: "B1 Prüfungshörübungen (intensiv)", target: 15, completed: 0 },
        { id: "oct-l2", goal: "Tagesschau (langsam)", target: 20, completed: 0 },
        { id: "oct-l3", goal: "Deutsche Filme mit Untertiteln", target: 6, completed: 0 },
        { id: "oct-l4", goal: "Easy German (B2 Themen)", target: 15, completed: 0 }
      ],
      writing: [
        { id: "oct-w1", task: "B1 Prüfungsschreiben (200 Wörter)", frequency: "3x pro Woche", completed: 0, target: 15 },
        { id: "oct-w2", task: "Argumentative Texte (B2 Vorbereitung)", frequency: "2x pro Woche", completed: 0, target: 10 },
        { id: "oct-w3", task: "Zusammenfassungen schreiben", frequency: "2x pro Woche", completed: 0, target: 10 }
      ],
      speaking: [
        { id: "oct-s1", goal: "B1 Prüfungssimulation (komplett)", frequency: "2x pro Woche", completed: 0, target: 10 },
        { id: "oct-s2", goal: "Komplexe Diskussionen (60 min)", frequency: "3x pro Woche", completed: 0, target: 15 },
        { id: "oct-s3", goal: "Spontane Gespräche/Rollenspiele", frequency: "täglich", completed: 0, target: 31 }
      ]
    },
    {
      month: "November 2025",
      level: "Phase 2: B2 Intensive (Week 14-17)",
      description: "🚀 GOAL: B2 core mastery + complex structures | 5h daily | 40 words/week",
      grammar: [
        { id: "nov-g1", topic: "Week 1: Erweiterte Relativsätze (Netzwerk B2 Kap. 2-3)", completed: false },
        { id: "nov-g2", topic: "Week 2: Irreale Bedingungssätze (wenn/falls)", completed: false },
        { id: "nov-g3", topic: "Week 3: Funktionsverbgefüge + Nominalisierung", completed: false },
        { id: "nov-g4", topic: "Week 4: Textverknüpfung + Stilistische Varianten", completed: false },
        { id: "nov-g5", topic: "Daily: B2 Grammatik-Intensivtraining", completed: false }
      ],
      vocabulary: [
        { id: "nov-v1", topic: "Week 1: Abstrakte Begriffe (40 Wörter)", targetWords: 40, learnedWords: 0 },
        { id: "nov-v2", topic: "Week 2: Idiome & Redewendungen (40 Wörter)", targetWords: 40, learnedWords: 0 },
        { id: "nov-v3", topic: "Week 3: Fachsprache & Wissenschaft (40 Wörter)", targetWords: 40, learnedWords: 0 },
        { id: "nov-v4", topic: "Week 4: Medien & Kommunikation (40 Wörter)", targetWords: 40, learnedWords: 0 }
      ],
      listening: [
        { id: "nov-l1", goal: "Deutsche Dokumentationen (Arte, ZDF)", target: 12, completed: 0 },
        { id: "nov-l2", goal: "Radio-Interviews & Nachrichten", target: 20, completed: 0 },
        { id: "nov-l3", goal: "Easy German (B2 komplexe Themen)", target: 20, completed: 0 },
        { id: "nov-l4", goal: "B2 Prüfungshörübungen", target: 15, completed: 0 }
      ],
      writing: [
        { id: "nov-w1", task: "Erörterungen (250-300 Wörter)", frequency: "2x pro Woche", completed: 0, target: 8 },
        { id: "nov-w2", task: "Berichte & Analysen schreiben", frequency: "2x pro Woche", completed: 0, target: 8 },
        { id: "nov-w3", task: "B2 Prüfungsschreiben üben", frequency: "2x pro Woche", completed: 0, target: 8 }
      ],
      speaking: [
        { id: "nov-s1", goal: "Präsentationen (15-20 min)", frequency: "2x pro Woche", completed: 0, target: 8 },
        { id: "nov-s2", goal: "Komplexe Rollenspiele & Debatten", frequency: "3x pro Woche", completed: 0, target: 12 },
        { id: "nov-s3", goal: "B2 Prüfungssimulation", frequency: "2x pro Woche", completed: 0, target: 8 }
      ]
    },
    {
      month: "December 2025",
      level: "Phase 2: B2 Mastery + Exam Ready (Week 18-19)",
      description: "🏆 GOAL: B2 certification by Dec 12 | 5h daily | Final sprint!",
      grammar: [
        { id: "dec-g1", topic: "Week 1: Komplette B2 Grammatik-Wiederholung", completed: false },
        { id: "dec-g2", topic: "Week 2: Prüfungsrelevante Strukturen + Strategien", completed: false },
        { id: "dec-g3", topic: "Daily: Intensive Fehleranalyse + Korrektur", completed: false },
        { id: "dec-g4", topic: "Daily: Stilverbesserung + Textoptimierung", completed: false },
        { id: "dec-g5", topic: "Final: Prüfungsstrategien + Zeitmanagement", completed: false }
      ],
      vocabulary: [
        { id: "dec-v1", topic: "Week 1: B2 Prüfungswortschatz (100 Wörter)", targetWords: 100, learnedWords: 0 },
        { id: "dec-v2", topic: "Week 2: Synonyme & Antonyme (50 Wörter)", targetWords: 50, learnedWords: 0 },
        { id: "dec-v3", topic: "Daily: Wiederholung aller gelernten Wörter", targetWords: 200, learnedWords: 0 }
      ],
      listening: [
        { id: "dec-l1", goal: "B2 Prüfungssimulationen (komplett)", target: 15, completed: 0 },
        { id: "dec-l2", goal: "Authentische Gespräche & Interviews", target: 20, completed: 0 },
        { id: "dec-l3", goal: "Tagesschau & komplexe Nachrichten", target: 12, completed: 0 }
      ],
      writing: [
        { id: "dec-w1", task: "B2 Prüfungsaufsätze (täglich)", frequency: "täglich", completed: 0, target: 12 },
        { id: "dec-w2", task: "Formelle Korrespondenz & Berichte", frequency: "täglich", completed: 0, target: 12 },
        { id: "dec-w3", task: "Zeitmanagement-Training", frequency: "täglich", completed: 0, target: 12 }
      ],
      speaking: [
        { id: "dec-s1", goal: "Mündliche B2 Prüfungssimulation", frequency: "täglich", completed: 0, target: 12 },
        { id: "dec-s2", goal: "Freie Gespräche & Diskussionen", frequency: "täglich", completed: 0, target: 12 },
        { id: "dec-s3", goal: "Prüfungsangst-Management", frequency: "täglich", completed: 0, target: 12 }
      ]
    }
  ],
  overallProgress: {
    grammarCompleted: 0,
    grammarTotal: 25,
    vocabularyLearned: 0,
    vocabularyTarget: 1000,
    mockExamsDone: 0,
    mockExamsTarget: 25,
    speakingSessions: 0,
    speakingTarget: 150
  }
});

export const getAyoubDailySchedule = () => ({
  phase1: {
    title: "Phase 1: B1 Mastery (August-October)",
    schedule: {
      "08:00-09:00": "🌅 Grammatik-Intensiv (Netzwerk B1) + Übungen",
      "09:00-10:00": "📚 Wortschatz lernen (25-35 neue Wörter) + Anki/Flashcards",
      "10:00-10:15": "☕ Pause",
      "10:15-11:15": "🎧 Hörverständnis (Easy German + Deutsche Welle)",
      "11:15-12:15": "✍️ Schreibtraining (E-Mails, Briefe, Tagebuch)",
      "12:15-13:15": "🍽️ Mittagspause",
      "13:15-14:15": "🗣️ Sprechtraining (Selbstgespräche + Shadowing)",
      "14:15-15:15": "📖 Leseverständnis (Texte B1 Niveau)",
      "15:15-15:30": "☕ Pause",
      "15:30-16:30": "🔄 Wiederholung + Hausaufgaben + Fehlerkorrektur"
    }
  },
  phase2: {
    title: "Phase 2: B2 Mastery (November-December)",
    schedule: {
      "08:00-09:00": "🌅 B2 Grammatik-Intensiv (Netzwerk B2) + komplexe Strukturen",
      "09:00-10:00": "📚 Erweiteter Wortschatz (40+ neue Wörter) + Synonyme",
      "10:00-10:15": "☕ Pause",
      "10:15-11:15": "🎧 Komplexes Hörverständnis (Dokumentationen, Nachrichten)",
      "11:15-12:30": "✍️ B2 Schreibtraining (Erörterungen, Berichte, Analysen)",
      "12:30-13:30": "🍽️ Mittagspause",
      "13:30-14:30": "🗣️ Intensives Sprechtraining (Präsentationen, Debatten)",
      "14:30-15:30": "📖 B2 Leseverständnis + kritische Textanalyse",
      "15:30-15:45": "☕ Pause",
      "15:45-16:45": "🎯 Prüfungsvorbereitung + Mock-Tests + Strategien"
    }
  }
});

export const getWeeklyMilestones = () => [
  {
    week: "Week 1-4 (August)",
    goals: [
      "✅ A2 Grammatik komplett wiederholt",
      "✅ 100 neue Wörter gelernt (Familie, Arbeit, Gesundheit, Wohnen)",
      "✅ 20 Easy German Videos geschaut",
      "✅ 8 persönliche E-Mails geschrieben",
      "✅ Täglich 10 Min Selbstgespräche geführt"
    ]
  },
  {
    week: "Week 5-8 (September)",
    goals: [
      "✅ B1 Kerngrammatik beherrscht (Konjunktiv II, Passiv, Relativsätze)",
      "✅ 120 neue Wörter gelernt (Umwelt, Medien, Kultur, Reisen)",
      "✅ Erste B1 Mock-Prüfung bestanden",
      "✅ 8 formelle Briefe geschrieben",
      "✅ 12 strukturierte Gespräche geführt"
    ]
  },
  {
    week: "Week 9-13 (October)",
    goals: [
      "✅ B1 Zertifikat-bereit (90%+ in Mock-Tests)",
      "✅ 175 neue Wörter gelernt (Politik, Wissenschaft, Wirtschaft)",
      "✅ B2 Grammatik begonnen (Nominalisierung, erweiterte Strukturen)",
      "✅ 6 deutsche Filme mit Untertiteln geschaut",
      "✅ 15 B1 Prüfungssimulationen absolviert"
    ]
  },
  {
    week: "Week 14-17 (November)",
    goals: [
      "✅ B2 Kerngrammatik beherrscht",
      "✅ 160 neue Wörter gelernt (abstrakte Begriffe, Idiome)",
      "✅ Komplexe Texte verstehen und analysieren",
      "✅ 8 Erörterungen geschrieben (250+ Wörter)",
      "✅ 20-Min Präsentationen halten können"
    ]
  },
  {
    week: "Week 18-19 (December 1-12)",
    goals: [
      "🏆 B2 Prüfung bestehen (Ziel: 12. Dezember)",
      "✅ 150 Prüfungswörter perfekt beherrscht",
      "✅ 15 komplette B2 Mock-Prüfungen absolviert",
      "✅ Alle 4 Fertigkeiten auf B2-Niveau",
      "✅ Selbstbewusst und prüfungsbereit"
    ]
  }
];

export const updateGrammarProgress = (plan: LearningPlan, monthIndex: number, grammarId: string, completed: boolean): LearningPlan => {
  const updatedPlan = { ...plan };
  const grammar = updatedPlan.months[monthIndex].grammar.find(g => g.id === grammarId);
  if (grammar) {
    const wasCompleted = grammar.completed;
    grammar.completed = completed;
    
    // Update overall progress
    if (completed && !wasCompleted) {
      updatedPlan.overallProgress.grammarCompleted++;
    } else if (!completed && wasCompleted) {
      updatedPlan.overallProgress.grammarCompleted--;
    }
  }
  return updatedPlan;
};

export const updateVocabularyProgress = (plan: LearningPlan, monthIndex: number, vocabId: string, learnedWords: number): LearningPlan => {
  const updatedPlan = { ...plan };
  const vocab = updatedPlan.months[monthIndex].vocabulary.find(v => v.id === vocabId);
  if (vocab) {
    const difference = learnedWords - vocab.learnedWords;
    vocab.learnedWords = learnedWords;
    updatedPlan.overallProgress.vocabularyLearned += difference;
  }
  return updatedPlan;
};

export const updateListeningProgress = (plan: LearningPlan, monthIndex: number, listeningId: string, completed: number): LearningPlan => {
  const updatedPlan = { ...plan };
  const listening = updatedPlan.months[monthIndex].listening.find(l => l.id === listeningId);
  if (listening) {
    listening.completed = completed;
  }
  return updatedPlan;
};

export const updateWritingProgress = (plan: LearningPlan, monthIndex: number, writingId: string, completed: number): LearningPlan => {
  const updatedPlan = { ...plan };
  const writing = updatedPlan.months[monthIndex].writing.find(w => w.id === writingId);
  if (writing) {
    writing.completed = completed;
  }
  return updatedPlan;
};

export const updateSpeakingProgress = (plan: LearningPlan, monthIndex: number, speakingId: string, completed: number): LearningPlan => {
  const updatedPlan = { ...plan };
  const speaking = updatedPlan.months[monthIndex].speaking.find(s => s.id === speakingId);
  if (speaking) {
    const difference = completed - speaking.completed;
    speaking.completed = completed;
    updatedPlan.overallProgress.speakingSessions += difference;
  }
  return updatedPlan;
};

export const calculateMonthProgress = (month: MonthlyPlan): number => {
  const grammarProgress = month.grammar.filter(g => g.completed).length / month.grammar.length;
  const vocabProgress = month.vocabulary.reduce((sum, v) => sum + (v.learnedWords / v.targetWords), 0) / month.vocabulary.length;
  const listeningProgress = month.listening.reduce((sum, l) => sum + (l.completed / l.target), 0) / month.listening.length;
  const writingProgress = month.writing.reduce((sum, w) => sum + (w.completed / w.target), 0) / month.writing.length;
  const speakingProgress = month.speaking.reduce((sum, s) => sum + (s.completed / s.target), 0) / month.speaking.length;
  
  return Math.round(((grammarProgress + vocabProgress + listeningProgress + writingProgress + speakingProgress) / 5) * 100);
};

export const getOverallPlanProgress = (plan: LearningPlan): number => {
  const grammarProgress = plan.overallProgress.grammarCompleted / plan.overallProgress.grammarTotal;
  const vocabProgress = Math.min(plan.overallProgress.vocabularyLearned / plan.overallProgress.vocabularyTarget, 1);
  const mockExamProgress = plan.overallProgress.mockExamsDone / plan.overallProgress.mockExamsTarget;
  const speakingProgress = Math.min(plan.overallProgress.speakingSessions / plan.overallProgress.speakingTarget, 1);
  
  return Math.round(((grammarProgress + vocabProgress + mockExamProgress + speakingProgress) / 4) * 100);
};