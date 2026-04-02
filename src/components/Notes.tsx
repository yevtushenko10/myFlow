import { useState, useEffect } from 'react';
import { useLocalStorage, Note } from '../types';
import { Plus, Search, Trash2, ChevronRight, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(n => 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveNote = (content: string) => {
    if (editingNote && editingId) {
      // Update existing note
      setNotes(notes.map(n => n.id === editingId ? { ...n, content, updatedAt: Date.now() } : n));
    } else {
      // Create new note
      const newNote: Note = {
        id: crypto.randomUUID(),
        content,
        updatedAt: Date.now(),
      };
      setNotes([newNote, ...notes]);
    }
    setEditingNote(null);
    setEditingId(null);
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditingNote(note);
  };

  const handleNewNote = () => {
    setEditingId(null);
    setEditingNote({ id: '', content: '', updatedAt: Date.now() });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 relative">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground text-sm">{notes.length} notes saved</p>
        </div>
        <button
          onClick={handleNewNote}
          className="w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform ios-btn"
        >
          <Plus size={22} />
        </button>
      </header>

      <div className="ios-card p-1 flex items-center gap-2">
        <Search size={20} className="ml-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="flex-1 bg-transparent px-2 py-3 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredNotes.map((note) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={note.id}
              className="ios-card p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    {format(note.updatedAt, 'MMM d')}
                  </span>
                  <h3 className="font-bold text-lg truncate pr-2">
                    {note.content.split('\n')[0] || 'Empty Note'}
                  </h3>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                {note.content.split('\n').slice(1).join(' ') || 'No additional text...'}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>


      {editingNote && (
        <NoteEditor 
          note={editingNote} 
          onSave={saveNote} 
          onClose={() => setEditingNote(null)} 
          onDelete={() => { deleteNote(editingNote.id); setEditingNote(null); }}
        />
      )}
    </div>
  );
}

function NoteEditor({ note, onSave, onClose, onDelete }: {
  note: Note,
  onSave: (c: string) => void,
  onClose: () => void,
  onDelete: () => void
}) {
  const [content, setContent] = useState(note.content);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const handler = () => {
      const kbHeight = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardHeight(Math.max(0, kbHeight));
    };
    vv.addEventListener('resize', handler);
    vv.addEventListener('scroll', handler);
    return () => {
      vv.removeEventListener('resize', handler);
      vv.removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ bottom: keyboardHeight }}
      className="fixed inset-x-0 top-[58%] bg-white z-50 flex flex-col rounded-t-3xl shadow-2xl"
    >
      <div className="flex-1 p-4 overflow-y-auto">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full h-full text-base outline-none resize-none placeholder:text-gray-300 leading-relaxed"
        />
      </div>
      <div className="px-4 py-3 flex justify-between items-center border-t border-gray-100">
        <button onClick={onClose} className="text-blue-500 font-medium px-2 py-2">Done</button>
        <div className="flex gap-4 items-center">
          {note.id && (
            <button onClick={onDelete} className="text-red-500 p-2">
              <Trash2 size={20} />
            </button>
          )}
          <button onClick={() => onSave(content)} className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-bold">
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
}
