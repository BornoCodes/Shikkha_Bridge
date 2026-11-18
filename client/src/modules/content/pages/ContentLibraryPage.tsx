import React, { useState } from 'react';
import { ContentCard } from '../components/ContentCard';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { toast } from 'react-hot-toast';
import { Search, Plus, Filter, BookOpen } from 'lucide-react';

export const ContentLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'video' | 'note' | 'exercise' | 'article'>('note');
  const [subject, setSubject] = useState('Mathematics');
  const [topicName, setTopicName] = useState('');
  const [url, setUrl] = useState('');

  const [items, setItems] = useState([
    {
      id: 'c1',
      title: 'Polynomial Factorization Made Easy (Bengali Walkthrough)',
      description: 'Comprehensive 15-minute video tutorial breaking down middle-term breakdown and cubic trial factors.',
      type: 'video' as const,
      subject: 'Mathematics',
      topicName: 'Algebraic Polynomials',
      uploadedBy: 'Farhan (Class Peer)',
      url: 'https://example.com/video-factorization',
    },
    {
      id: 'c2',
      title: 'Newtonian Dynamics Handwritten Summary Sheet',
      description: 'Scanned class notes from the lectures on Nov 05, including solved exercise diagrams and friction formulas.',
      type: 'note' as const,
      subject: 'Physics',
      topicName: 'Laws of Motion',
      uploadedBy: 'Ayesha (Class Peer)',
      url: 'https://example.com/physics-notes',
    },
    {
      id: 'c3',
      title: 'Periodic Table Trends Practice Problem Set',
      description: 'Curated 10 conceptual problems targeting electronegativity, atomic radius, and ionization energy.',
      type: 'exercise' as const,
      subject: 'Chemistry',
      topicName: 'Periodic Trends',
      uploadedBy: 'Nasrin Sultana (Teacher)',
      url: 'https://example.com/chem-problems',
    },
    {
      id: 'c4',
      title: 'Chloroplast Light Reactions Quick Revision Article',
      description: 'Concise summary with labeled diagrams designed for fast catch-up before exams.',
      type: 'article' as const,
      subject: 'Biology',
      topicName: 'Photosynthesis',
      uploadedBy: 'Tanvir (Peer)',
      url: 'https://example.com/bio-summary',
    },
  ]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setItems([
      ...items,
      {
        id: `c-${Date.now()}`,
        title,
        description,
        type,
        subject,
        topicName,
        uploadedBy: 'Me (Peer Contributor)',
        url: url || 'https://example.com/shared-material',
      },
    ]);
    toast.success('Study material shared with your peers on ShikkhaBridge!');
    setModalOpen(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesSubject = selectedSubject === 'all' || item.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topicName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-matti">
            Content Library & Peer Bridge
          </h1>
          <p className="text-sm text-matti-light mt-1">
            Browse teacher resources and peer-contributed notes to catch up with missed classes.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} variant="primary" size="md">
          <Plus className="w-4 h-4 mr-2" />
          Share Note or Resource
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-cream border border-parchment-dark p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-matti-light absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics, notes, videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-parchment-dark bg-parchment/40 text-sm text-matti focus:outline-none focus:ring-2 focus:ring-terracotta/40"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedSubject === sub
                  ? 'bg-terracotta text-white'
                  : 'bg-parchment text-matti hover:bg-parchment-dark'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ContentCard key={item.id} {...item} />
        ))}
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Share Learning Material with Classmates"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Resource Title"
            placeholder="e.g. Handwritten notes on Chapter 4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Curriculum Topic"
            placeholder="e.g. Laws of Motion"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-matti mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-parchment-dark bg-cream text-sm text-matti"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-matti mb-1">Resource Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-parchment-dark bg-cream text-sm text-matti"
              >
                <option value="note">Class Notes (PDF / Image)</option>
                <option value="video">Explainer Video</option>
                <option value="exercise">Problem Set</option>
                <option value="article">Summary Article</option>
              </select>
            </div>
          </div>

          <Input
            label="Short Description"
            placeholder="e.g. Solved exercises from page 78 to 82"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="File / External Link URL"
            placeholder="https://drive.google.com/... or https://youtube.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="md" className="w-full mt-2">
            Publish to ShikkhaBridge Peer Library
          </Button>
        </form>
      </Modal>
    </div>
  );
};
