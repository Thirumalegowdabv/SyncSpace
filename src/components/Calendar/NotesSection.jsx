import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Plus, Trash2, User, Clock, Calendar as CalendarIcon, Edit2, X, Save, Tag, Search } from 'lucide-react';

// --- Constants ---
const CATEGORIES = {
  Personal: { color: '#10b981', label: 'Personal' }, 
  Work: { color: '#3b82f6', label: 'Work' },         
  Study: { color: '#8b5cf6', label: 'Study' },       
  Urgent: { color: '#ef4444', label: 'Urgent' },     
};

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  color: #0f172a;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: ${props => props.$isEditing ? '#eff6ff' : '#f8fafc'};
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$isEditing ? '#bfdbfe' : '#e2e8f0'};
  transition: all 0.3s ease;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  background: white;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
    color: #94a3b8;
  }
`;

const StyledSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  background: white;
  cursor: pointer;
  color: #334155;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
    color: #94a3b8;
  }
`;

const NameInput = styled(StyledInput)` width: 30%; `;
const CategorySelect = styled(StyledSelect)` width: 25%; `;
const NoteInput = styled(StyledInput)` flex: 1; `;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3);
  }
  
  &:disabled {
    background: #e2e8f0;
    color: #94a3b8;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
  box-shadow: none;

  &:hover:not(:disabled) {
    background: #f8fafc;
    color: #0f172a;
    box-shadow: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled(StyledInput)`
  width: 100%;
  padding-left: 2.75rem; /* Make room for the icon */
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  
  &:focus {
    background-color: white;
  }
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const NoteCard = styled.div`
  background-color: white;
  border: 1px solid ${props => props.$isBeingEdited ? '#3b82f6' : '#e2e8f0'};
  border-left: 4px solid ${props => props.$categoryColor || '#e2e8f0'};
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.04);
  }
`;

const NoteContent = styled.div` flex: 1; `;
const NoteText = styled.p` font-size: 0.95rem; color: #1e293b; margin: 0 0 0.75rem 0; line-height: 1.4; `;
const MetaDataRow = styled.div` display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.75rem; color: #64748b; `;
const MetaTag = styled.div` display: flex; align-items: center; gap: 0.25rem; background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 4px; `;
const CategoryBadge = styled(MetaTag)` background-color: ${props => `${props.$color}15`}; color: ${props => props.$color}; font-weight: 500; `;
const ActionButtons = styled.div` display: flex; gap: 0.25rem; `;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$variant === 'delete' ? '#ef4444' : '#64748b'};
  
  &:hover {
    background-color: ${props => props.$variant === 'delete' ? '#fee2e2' : '#f1f5f9'};
    color: ${props => props.$variant === 'delete' ? '#b91c1c' : '#0f172a'};
  }
`;

// --- Main Component ---
const NotesSection = ({ dateRange, notes, setNotes }) => {
  const [authorName, setAuthorName] = useState('');
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  
  
  const [searchQuery, setSearchQuery] = useState('');

  const getSelectedDateText = () => {
    if (dateRange.start && dateRange.end) {
      return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
    } else if (dateRange.start) {
      return format(dateRange.start, 'MMM d, yyyy');
    }
    return 'No date selected';
  };

  const handleSaveNote = () => {
    if (!inputText.trim()) return;

    if (editingId) {
      setNotes(notes.map(note => 
        note.id === editingId 
          ? { ...note, text: inputText, author: authorName.trim() || 'Anonymous', category: selectedCategory }
          : note
      ));
      setEditingId(null);
      setInputText('');
    } else {
      const now = new Date();
      const newNote = {
        id: Date.now().toString(),
        text: inputText,
        author: authorName.trim() || 'Anonymous', 
        category: selectedCategory, 
        timeCreated: format(now, 'h:mm a'), 
        dateText: getSelectedDateText(),
        date: dateRange.start || now 
      };
      setNotes([...notes, newNote]);
      setInputText(''); 
    }
  };

  const handleEditClick = (note) => {
    setEditingId(note.id);
    setInputText(note.text);
    setAuthorName(note.author === 'Anonymous' ? '' : note.author);
    setSelectedCategory(note.category || 'Personal');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInputText('');
    setSelectedCategory('Personal');
  };

  const handleDeleteNote = (idToRemove) => {
    setNotes(notes.filter(note => note.id !== idToRemove));
    if (editingId === idToRemove) handleCancelEdit();
  };

  const isInputDisabled = !dateRange.start && !editingId;

  
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    
    return (
      note.text.toLowerCase().includes(query) ||
      note.author.toLowerCase().includes(query) ||
      (note.category && note.category.toLowerCase().includes(query))
    );
  });

  return (
    <Container>
      <SectionTitle>
        Memos & Notes
        {editingId && <span style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '500' }}>Editing Mode</span>}
      </SectionTitle>
      
      <FormContainer $isEditing={!!editingId}>
        <InputRow>
          <NameInput 
            type="text" placeholder="Your Name" value={authorName}
            onChange={(e) => setAuthorName(e.target.value)} disabled={isInputDisabled}
          />
          <CategorySelect 
            value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} disabled={isInputDisabled}
          >
            {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </CategorySelect>
        </InputRow>
        
        <InputRow>
          <NoteInput 
            type="text" placeholder={isInputDisabled ? "Select a date to add a note" : "Type your memo..."}
            value={inputText} onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()} disabled={isInputDisabled}
          />
        </InputRow>
        
        <ButtonGroup>
          {editingId && (
            <SecondaryButton onClick={handleCancelEdit}><X size={16} /> Cancel</SecondaryButton>
          )}
          <PrimaryButton onClick={handleSaveNote} disabled={isInputDisabled}>
            {editingId ? <><Save size={18} /> Save Changes</> : <><Plus size={18} /> Add Note</>}
          </PrimaryButton>
        </ButtonGroup>
      </FormContainer>

      
      {notes.length > 0 && (
        <SearchContainer>
          <SearchIconWrapper>
            <Search size={16} />
          </SearchIconWrapper>
          <SearchInput 
            type="text" 
            placeholder="Search notes by keyword, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      )}

      <NotesList>
        {notes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '1rem', fontSize: '0.875rem' }}>
            No notes for this calendar yet.
          </div>
        ) : filteredNotes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '1rem', fontSize: '0.875rem' }}>
            No matching notes found for "{searchQuery}".
          </div>
        ) : (

          filteredNotes.map(note => {
            const catData = CATEGORIES[note.category] || CATEGORIES['Personal']; 
            return (
              <NoteCard key={note.id} $isBeingEdited={note.id === editingId} $categoryColor={catData.color}>
                <NoteContent>
                  <NoteText>{note.text}</NoteText>
                  <MetaDataRow>
                    <CategoryBadge $color={catData.color}><Tag size={12} /> {note.category || 'Personal'}</CategoryBadge>
                    <MetaTag><User size={12} /> {note.author}</MetaTag>
                    <MetaTag><CalendarIcon size={12} /> {note.dateText}</MetaTag>
                    <MetaTag><Clock size={12} /> {note.timeCreated}</MetaTag>
                  </MetaDataRow>
                </NoteContent>
                <ActionButtons>
                  <IconButton onClick={() => handleEditClick(note)} title="Edit note"><Edit2 size={16} /></IconButton>
                  <IconButton $variant="delete" onClick={() => handleDeleteNote(note.id)} title="Delete note"><Trash2 size={16} /></IconButton>
                </ActionButtons>
              </NoteCard>
            );
          })
        )}
      </NotesList>
    </Container>
  );
};

export default NotesSection;