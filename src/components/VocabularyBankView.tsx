import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, BookOpen, Volume2, Calendar, Tag, X, Edit3, Trash2, Save } from 'lucide-react';
import { VocabularyEntry } from '../types/types';

interface VocabularyBankViewProps {
  darkMode: boolean;
  onClose: () => void;
}

export const VocabularyBankView: React.FC<VocabularyBankViewProps> = ({
  darkMode,
  onClose
}) => {
  const [vocabulary, setVocabulary] = useState<VocabularyEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<VocabularyEntry | null>(null);
  const [newEntry, setNewEntry] = useState<VocabularyEntry>({
    id: '',
    word: '',
    translation: '',
    example: '',
    tags: [],
    level: 'A1',
    dateAdded: new Date().toISOString().split('T')[0],
    source: '',
    category: 'General',
    pronunciation: '',
    synonyms: [],
    antonyms: []
  });

  // Sample vocabulary data
  const sampleVocabulary: VocabularyEntry[] = [
    {
      id: '1',
      word: 'sich gewöhnen an',
      translation: 'to get used to',
      example: 'Ich muss mich an das deutsche Wetter gewöhnen.',
      tags: ['reflexive', 'common'],
      level: 'B1',
      dateAdded: '2025-01-30',
      source: 'Easy German Video',
      category: 'Verbs',
      pronunciation: '[zɪç ɡəˈvøːnən an]',
      synonyms: ['sich anpassen an'],
      antonyms: []
    },
    {
      id: '2',
      word: 'meiner Meinung nach',
      translation: 'in my opinion',
      example: 'Meiner Meinung nach ist Deutsch eine schöne Sprache.',
      tags: ['opinion', 'formal'],
      level: 'B1',
      dateAdded: '2025-01-30',
      source: 'Prof Khalid Lesson',
      category: 'Expressions',
      pronunciation: '[ˈmaɪnɐ ˈmaɪnʊŋ naːx]',
      synonyms: ['ich denke', 'ich glaube'],
      antonyms: []
    },
    {
      id: '3',
      word: 'die Nachhaltigkeit',
      translation: 'sustainability',
      example: 'Nachhaltigkeit ist ein wichtiges Thema in Deutschland.',
      tags: ['environment', 'formal'],
      level: 'B2',
      dateAdded: '2025-01-29',
      source: 'Radio Deutschlandfunk',
      category: 'Environment',
      pronunciation: '[ˈnaːxhaltɪçkaɪt]',
      synonyms: ['die Beständigkeit'],
      antonyms: ['die Verschwendung']
    },
    {
      id: '4',
      word: 'der Wandel',
      translation: 'change, transformation',
      example: 'Der Klimawandel ist eine große Herausforderung.',
      tags: ['change', 'formal'],
      level: 'B2',
      dateAdded: '2025-01-29',
      source: 'Deutsche Welle',
      category: 'Abstract Concepts',
      pronunciation: '[ˈvandəl]',
      synonyms: ['die Veränderung', 'die Transformation'],
      antonyms: ['die Beständigkeit']
    },
    {
      id: '5',
      word: 'übrigens',
      translation: 'by the way',
      example: 'Das Wetter ist schön heute, übrigens danke für deine Hilfe.',
      tags: ['connector', 'casual'],
      level: 'A2',
      dateAdded: '2025-01-28',
      source: 'Easy German Video',
      category: 'Connectors',
      pronunciation: '[ˈyːbʁɪɡəns]',
      synonyms: ['nebenbei bemerkt'],
      antonyms: []
    },
    {
      id: '6',
      word: 'die Herausforderung',
      translation: 'challenge',
      example: 'Deutsch zu lernen ist eine große Herausforderung.',
      tags: ['difficulty', 'formal'],
      level: 'B2',
      dateAdded: '2025-01-28',
      source: 'Prof Khalid Lesson',
      category: 'Abstract Concepts',
      pronunciation: '[ˈhɛʁaʊsˌfɔʁdəʁʊŋ]',
      synonyms: ['die Aufgabe', 'das Problem'],
      antonyms: ['die Leichtigkeit']
    },
    {
      id: '7',
      word: 'das macht Sinn',
      translation: 'that makes sense',
      example: 'Deine Erklärung macht Sinn, vielen Dank!',
      tags: ['understanding', 'common'],
      level: 'A2',
      dateAdded: '2025-01-27',
      source: 'Easy German Video',
      category: 'Expressions',
      pronunciation: '[das maxt zɪn]',
      synonyms: ['das ist logisch'],
      antonyms: ['das ist verwirrend']
    },
    {
      id: '8',
      word: 'die Verspätung',
      translation: 'delay',
      example: 'Der Zug hat 10 Minuten Verspätung.',
      tags: ['transport', 'time'],
      level: 'A2',
      dateAdded: '2025-01-27',
      source: 'Radio Bayern 2',
      category: 'Transport',
      pronunciation: '[fɛɐ̯ˈʃpɛːtʊŋ]',
      synonyms: ['die Verzögerung'],
      antonyms: ['die Pünktlichkeit']
    },
    {
      id: '9',
      word: 'die Gemütlichkeit',
      translation: 'coziness, comfort',
      example: 'Deutsche Cafés haben eine besondere Gemütlichkeit.',
      tags: ['culture', 'feeling'],
      level: 'B1',
      dateAdded: '2025-01-26',
      source: 'Easy German Video',
      category: 'Culture',
      pronunciation: '[ɡəˈmyːtlɪçkaɪt]',
      synonyms: ['die Behaglichkeit'],
      antonyms: ['die Unruhe']
    },
    {
      id: '10',
      word: 'sich freuen auf',
      translation: 'to look forward to',
      example: 'Ich freue mich auf das Wochenende.',
      tags: ['emotion', 'reflexive'],
      level: 'A2',
      dateAdded: '2025-01-26',
      source: 'Prof Khalid Lesson',
      category: 'Emotions',
      pronunciation: '[zɪç ˈfʁɔɪən aʊf]',
      synonyms: ['erwarten'],
      antonyms: ['sich fürchten vor']
    }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('germanTracker_vocabulary');
    if (stored) {
      try {
        setVocabulary(JSON.parse(stored));
      } catch (error) {
        setVocabulary(sampleVocabulary);
      }
    } else {
      setVocabulary(sampleVocabulary);
      localStorage.setItem('germanTracker_vocabulary', JSON.stringify(sampleVocabulary));
    }
  }, []);

  const saveVocabulary = (newVocab: VocabularyEntry[]) => {
    setVocabulary(newVocab);
    localStorage.setItem('germanTracker_vocabulary', JSON.stringify(newVocab));
  };

  const filteredVocabulary = vocabulary.filter(entry => {
    const matchesSearch = entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.example.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || entry.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const categories = [...new Set(vocabulary.map(entry => entry.category))];
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const handleAddEntry = () => {
    const entry = {
      ...newEntry,
      id: Date.now().toString(),
      tags: newEntry.tags.length > 0 ? newEntry.tags : ['new'],
      synonyms: newEntry.synonyms || [],
      antonyms: newEntry.antonyms || []
    };
    saveVocabulary([...vocabulary, entry]);
    setNewEntry({
      id: '',
      word: '',
      translation: '',
      example: '',
      tags: [],
      level: 'A1',
      dateAdded: new Date().toISOString().split('T')[0],
      source: '',
      category: 'General',
      pronunciation: '',
      synonyms: [],
      antonyms: []
    });
    setShowAddModal(false);
  };

  const handleEditEntry = (entry: VocabularyEntry) => {
    const updated = vocabulary.map(v => v.id === entry.id ? entry : v);
    saveVocabulary(updated);
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updated = vocabulary.filter(v => v.id !== id);
      saveVocabulary(updated);
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'A2': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'B1': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'B2': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'C1': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'C2': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[level as keyof typeof colors] || colors.A1;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold">📁 My Vocabulary Bank</h2>
              <p className="text-gray-500">Manage your German vocabulary collection</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Word
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{vocabulary.length}</div>
            <div className="text-sm text-gray-500">Total Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {vocabulary.filter(v => v.level === 'B1' || v.level === 'B2').length}
            </div>
            <div className="text-sm text-gray-500">B1-B2 Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{categories.length}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">
              {vocabulary.filter(v => v.dateAdded === new Date().toISOString().split('T')[0]).length}
            </div>
            <div className="text-sm text-gray-500">Added Today</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl p-6 ${
        darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search words, translations, examples..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVocabulary.map(entry => (
          <div key={entry.id} className={`rounded-xl p-4 border transition-all hover:shadow-lg ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold">{entry.word}</h3>
                {entry.pronunciation && (
                  <p className="text-sm text-gray-500 font-mono">{entry.pronunciation}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(entry.level)}`}>
                  {entry.level}
                </span>
                <button
                  onClick={() => setEditingEntry(entry)}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{entry.translation}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">"{entry.example}"</p>
            
            {entry.synonyms && entry.synonyms.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Synonyms: </span>
                <span className="text-xs text-gray-500">{entry.synonyms.join(', ')}</span>
              </div>
            )}
            
            {entry.antonyms && entry.antonyms.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-red-600 dark:text-red-400">Antonyms: </span>
                <span className="text-xs text-gray-500">{entry.antonyms.join(', ')}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded">{entry.category}</span>
              <span>{entry.source}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.map((tag, index) => (
                <span key={index} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredVocabulary.length === 0 && (
        <div className={`rounded-xl p-12 text-center ${
          darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No vocabulary found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Your First Word
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingEntry) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editingEntry ? 'Edit Word' : 'Add New Word'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEntry(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">German Word *</label>
                    <input
                      type="text"
                      value={editingEntry ? editingEntry.word : newEntry.word}
                      onChange={(e) => editingEntry 
                        ? setEditingEntry({...editingEntry, word: e.target.value})
                        : setNewEntry({...newEntry, word: e.target.value})
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}
                      placeholder="e.g., sich gewöhnen an"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Translation *</label>
                    <input
                      type="text"
                      value={editingEntry ? editingEntry.translation : newEntry.translation}
                      onChange={(e) => editingEntry 
                        ? setEditingEntry({...editingEntry, translation: e.target.value})
                        : setNewEntry({...newEntry, translation: e.target.value})
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}
                      placeholder="e.g., to get used to"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Example Sentence *</label>
                  <textarea
                    value={editingEntry ? editingEntry.example : newEntry.example}
                    onChange={(e) => editingEntry 
                      ? setEditingEntry({...editingEntry, example: e.target.value})
                      : setNewEntry({...newEntry, example: e.target.value})
                    }
                    rows={2}
                    className={`w-full px-4 py-2 rounded-lg border resize-none ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-gray-50 border-gray-300'
                    }`}
                    placeholder="e.g., Ich muss mich an das deutsche Wetter gewöhnen."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Level</label>
                    <select
                      value={editingEntry ? editingEntry.level : newEntry.level}
                      onChange={(e) => editingEntry 
                        ? setEditingEntry({...editingEntry, level: e.target.value as any})
                        : setNewEntry({...newEntry, level: e.target.value as any})
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={editingEntry ? editingEntry.category : newEntry.category}
                      onChange={(e) => editingEntry 
                        ? setEditingEntry({...editingEntry, category: e.target.value})
                        : setNewEntry({...newEntry, category: e.target.value})
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}
                      placeholder="e.g., Verbs, Expressions"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Source</label>
                    <input
                      type="text"
                      value={editingEntry ? editingEntry.source : newEntry.source}
                      onChange={(e) => editingEntry 
                        ? setEditingEntry({...editingEntry, source: e.target.value})
                        : setNewEntry({...newEntry, source: e.target.value})
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-gray-50 border-gray-300'
                      }`}
                      placeholder="e.g., Easy German Video"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pronunciation (IPA)</label>
                  <input
                    type="text"
                    value={editingEntry ? editingEntry.pronunciation || '' : newEntry.pronunciation || ''}
                    onChange={(e) => editingEntry 
                      ? setEditingEntry({...editingEntry, pronunciation: e.target.value})
                      : setNewEntry({...newEntry, pronunciation: e.target.value})
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-gray-50 border-gray-300'
                    }`}
                    placeholder="e.g., [zɪç ɡəˈvøːnən an]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editingEntry ? editingEntry.tags.join(', ') : newEntry.tags.join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                      editingEntry 
                        ? setEditingEntry({...editingEntry, tags})
                        : setNewEntry({...newEntry, tags});
                    }}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-gray-50 border-gray-300'
                    }`}
                    placeholder="e.g., reflexive, common, important"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEntry(null);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingEntry ? handleEditEntry(editingEntry) : handleAddEntry()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingEntry ? 'Update' : 'Add'} Word
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};