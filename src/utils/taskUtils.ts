import { TaskData, DayData, WeekData, Resource } from '../types/types';

export const getInitialTasks = (day: string): TaskData[] => {
  const baseTasks: TaskData[] = [
    {
      id: 'glossar',
      name: 'Glossar A2/B1/B2 usw learning',
      emoji: '📘',
      duration: 60,
      completed: false,
      description: 'Neue Wörter merken und Vokabeln üben',
      notes: 'Neue Wörter merken',
      link: 'https://languagereactor.com',
      resources: [
        { name: 'Language Reactor', url: 'https://languagereactor.com', type: 'link' },
        { name: 'Fokus auf neue Vokabeln und deren Verwendung', type: 'note' }
      ],
      pomodoroSessions: 0,
      timeSpent: 0
    },
    {
      id: 'interactive-videos',
      name: 'Easy German & Interactive Videos',
      emoji: '🎬',
      duration: 60, // 45-60 min
      completed: false,
      description: '• Watch 1–2 episodes from Easy German\n• Note 5 new expressions\n• Practice shadowing (repeat sentences aloud)\n• Write 3 sentences using learned expressions\n• (Optional) Comment on the video in German',
      notes: '',
      videoTitle: '',
      videoLink: '',
      vocabulary: '',
      exampleSentences: '',
      videoSummary: '',
      grammarNotes: '',
      tags: '#Speaking #Listening #Vocabulary #FunLearning',
      resources: [
        { name: 'Easy German', url: 'https://www.youtube.com/@EasyGerman', type: 'link' },
        { name: 'Deutsch lernen mit Jenny', url: 'https://www.youtube.com/@DeutschlernenMitJenny', type: 'link' },
        { name: 'Deutsche Welle', url: 'https://www.youtube.com/@DeutscheWelle', type: 'link' }
      ],
      pomodoroSessions: 0,
      timeSpent: 0
    },
    {
      id: 'radio-podcast',
      name: 'Radio and Podcast Practice',
      emoji: '📻',
      duration: 30, // 20-30 min
      completed: false,
      description: '• Listen to a German radio station (e.g., Deutschlandfunk, Bayern 2)\n• Identify 3 topics discussed\n• Try to summarize in German (oral or written)\n• Look up 3 unknown words and save them',
      notes: '',
      radioStation: '',
      topicsDiscussed: '',
      germanSummary: '',
      newWords: '',
      tags: '#Listening #RealGerman #IndependentPractice',
      resources: [
        { name: 'Deutschlandfunk', url: 'https://www.deutschlandfunk.de', type: 'link' },
        { name: 'Bayern 2', url: 'https://www.br.de/radio/bayern2', type: 'link' },
        { name: 'WDR 5', url: 'https://www1.wdr.de/radio/wdr5', type: 'link' },
        { name: 'SWR2', url: 'https://www.swr.de/swr2', type: 'link' }
      ],
      pomodoroSessions: 0,
      timeSpent: 0
    },
    {
      id: 'prof-khalid',
      name: 'YouTube lessons with Prof Khalid',
      emoji: '🧑‍🏫',
      duration: 45,
      completed: false,
      description: 'Learn German with Prof Khalid - Gateway to Germany',
      notes: '',
      link: 'https://www.youtube.com/@gatewaytogermany',
      videoTitle: '',
      videoLink: '',
      vocabulary: '',
      exampleSentences: '',
      videoSummary: '',
      grammarNotes: '',
      tags: '#Grammar #Structured #Professor #Arabic',
      resources: [
        { name: 'Gateway to Germany', url: 'https://www.youtube.com/@gatewaytogermany', type: 'link' },
        { name: 'Structured German lessons in Arabic', type: 'note' },
        { name: 'Grammar explanations', type: 'note' }
      ],
      pomodoroSessions: 0,
      timeSpent: 0
    },
    {
      id: 'exam',
      name: 'Prüfungstest (B1, etc.)',
      emoji: '📝',
      duration: 30,
      completed: false,
      description: 'Prüfungsvorbereitung und Testübungen',
      notes: '',
      resources: [
        { name: 'A2 Deutsch', url: 'https://a2-deutsch.com', type: 'link' },
        { name: 'YouTube Kanal', type: 'note' },
        { name: 'Deutsch Vorbereitung', url: 'https://deutsch-vorbereitung.com', type: 'link' }
      ],
      pomodoroSessions: 0,
      timeSpent: 0
    },
    {
      id: 'listening',
      name: 'Listening task: Film, Podcast, Radio',
      emoji: '🎧',
      duration: 45,
      completed: false,
      description: 'Deutsche Medien für Hörverständnis',
      notes: '',
      resources: [
        { name: 'ARD Mediathek', url: 'https://ardmediathek.de', type: 'link' },
        { name: 'Deutschland FM', url: 'https://deutschland.fm', type: 'link' },
        { name: 'Language Reactor', url: 'https://languagereactor.com', type: 'link' }
      ],
      pomodoroSessions: 0,
      timeSpent: 0
    }
  ];

  // Add weekday-specific tasks
  if (['monday', 'tuesday', 'wednesday', 'thursday'].includes(day)) {

    baseTasks.push({
      id: 'vhs',
      name: 'VHS App / Übungen',
      emoji: '📱',
      duration: 60,
      completed: false,
      description: 'VHS Übungen und App-basiertes Lernen',
      notes: '',
      resources: [
        { name: 'VHS Übungen', type: 'note' },
        { name: 'Interaktive Aufgaben', type: 'note' }
      ],
      pomodoroSessions: 0,
      timeSpent: 0
    });
  }

  return baseTasks;
};

export const getInitialWeekData = (): WeekData => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const weekData: any = {};
  
  days.forEach(day => {
    weekData[day] = {
      tasks: getInitialTasks(day)
    };
  });
  
  return weekData as WeekData;
};

export const calculateDayProgress = (tasks: TaskData[]): number => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

export const calculateTotalTime = (tasks: TaskData[]): string => {
  const totalMinutes = tasks.reduce((sum, task) => sum + task.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getDayName = (day: string): string => {
  const dayNames: { [key: string]: string } = {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag'
  };
  return dayNames[day] || day;
};

export const getDayAbbr = (day: string): string => {
  const dayAbbr: { [key: string]: string } = {
    monday: 'Mo',
    tuesday: 'Di',
    wednesday: 'Mi',
    thursday: 'Do',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'So'
  };
  return dayAbbr[day] || day;
};