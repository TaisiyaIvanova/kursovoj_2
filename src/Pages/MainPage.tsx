import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import TagInput from '../Components/TagInput';
import NoteCard from '../Components/NoteCard';
import Header from '../Components/Header';
import { useTheme } from '../Context/ThemeContext.tsx';

const tagColorClasses = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-600',
    'bg-yellow-500',
    'bg-purple-600',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-lime-500',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-fuchsia-500',
    'bg-violet-500',
    'bg-sky-500',
];

type Tag = {
    id: string;
    name: string;
    color: string;
};

type Note = {
    id: string;
    title: string;
    tag: string;
    content: string;
    backgroundUrl: string;
    owner: string;
    sharedWith?: string[];
    createdAt: string;
};

const MainPage = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [userName, setUserName] = useState('Пользователь');
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [showOnlyOwnedNotes, setShowOnlyOwnedNotes] = useState<boolean>(false);
    const { theme } = useTheme();

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && tags) {
            localStorage.setItem(`tags_${currentUser}`, JSON.stringify(tags));
        }
    }, [tags, currentUser]);

    useEffect(() => {
        const currentEmail = localStorage.getItem('currentUser');
        if (!currentEmail) {
            navigate('/login');
            return;
        }

        setCurrentUser(currentEmail);

        const rawUsers = localStorage.getItem('users');
        if (!rawUsers) {
            navigate('/login');
            return;
        }

        let users: Record<string, { email: string; name: string }>;
        try {
            users = JSON.parse(rawUsers);
        } catch {
            navigate('/login');
            return;
        }

        const user = users[currentEmail];
        if (!user) {
            navigate('/login');
            return;
        }

        setUserName(user.name || 'Пользователь');

        const savedTagsString = localStorage.getItem(`tags_${currentEmail}`);
        if (savedTagsString) {
            try {
                let parsedTags: Tag[] = JSON.parse(savedTagsString);
                // Ensure all loaded tags have a valid color
                parsedTags = parsedTags.map(tag => {
                    // Check if color is missing, not a string, or not in the predefined list
                    if (typeof tag.color !== 'string' || !tag.color || !tagColorClasses.includes(tag.color)) {
                        console.log(`Tag "${tag.name}" (id: ${tag.id}) is missing a valid color. Assigning a new one.`);
                        return {
                            ...tag,
                            color: tagColorClasses[Math.floor(Math.random() * tagColorClasses.length)]
                        };
                    }
                    return tag;
                });
                setTags(parsedTags);
            } catch (error) {
                console.error("Error parsing tags from localStorage or assigning colors:", error);
                setTags([]); 
            }
        } else {
            setTags([]); 
        }

        const rawNotes = localStorage.getItem('notes');
        if (rawNotes) {
            try {
                const allNotes: Note[] = JSON.parse(rawNotes);
                const userNotes = allNotes.filter(
                    (note) =>
                        note.owner === currentEmail || note.sharedWith?.includes(currentEmail),
                );
                setNotes(userNotes);
                setFilteredNotes(userNotes);
            } catch {
                setNotes([]);
                setFilteredNotes([]);
            }
        }
    }, [navigate]);

    useEffect(() => {
        let filtered = notes;

        // Filter by selected tag
        if (selectedTag) {
            filtered = filtered.filter((note) => note.tag === selectedTag);
        }

        // Filter by search text
        if (searchText.trim() !== '') {
            const lowerSearch = searchText.toLowerCase();
            filtered = filtered.filter(
                (note) =>
                    note.title.toLowerCase().includes(lowerSearch) ||
                    note.content.toLowerCase().includes(lowerSearch),
            );
        }

        // Filter by date range
        if (startDate) {
            filtered = filtered.filter(note => {
                const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
                return noteDate >= startDate;
            });
        }
        if (endDate) {
            filtered = filtered.filter(note => {
                const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
                // To make endDate inclusive, we compare if noteDate is less than or equal
                return noteDate <= endDate;
            });
        }

        // Filter by ownership (solo notes)
        if (showOnlyOwnedNotes) {
            if (currentUser) { // Ensure currentUser is available
                filtered = filtered.filter(note => note.owner === currentUser);
            }
        }

        setFilteredNotes(filtered);
    }, [notes, selectedTag, searchText, startDate, endDate, showOnlyOwnedNotes, currentUser]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const addTag = () => {
        const newTag: Tag = {
            id: uuidv4(),
            name: '',
            color: tagColorClasses[Math.floor(Math.random() * tagColorClasses.length)],
        };
        setTags((prev) => [...prev, newTag]);
    };

    const updateTag = (id: string, newName: string) => {
        setTags((prev) => prev.map((tag) => (tag.id === id ? { ...tag, name: newName } : tag)));
    };

    const deleteTag = (id: string) => {
        setTags((prev) => prev.filter((tag) => tag.id !== id));
    };

    const handleDeleteNote = (id: string) => {
        const currentEmail = localStorage.getItem('currentUser');
        if (!currentEmail) {
            navigate('/login');
            return;
        }

        let notesFromStorage: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');
        const noteToDeleteIndex = notesFromStorage.findIndex((note) => note.id === id);

        if (noteToDeleteIndex === -1) return;

        const noteData = notesFromStorage[noteToDeleteIndex];

        if (noteData.owner === currentEmail) {
            notesFromStorage.splice(noteToDeleteIndex, 1);
        } else if (noteData.sharedWith?.includes(currentEmail)) {
            noteData.sharedWith = noteData.sharedWith.filter((email) => email !== currentEmail);
            notesFromStorage[noteToDeleteIndex] = noteData;
        } else {
            console.warn("User attempted to delete a note they don't own or aren't shared on.");
            return;
        }

        localStorage.setItem('notes', JSON.stringify(notesFromStorage));
        const updatedUserNotes = notesFromStorage.filter(
            (note) => note.owner === currentEmail || note.sharedWith?.includes(currentEmail),
        );
        setNotes(updatedUserNotes);
    };

    const handleTagSelect = (tagName: string) => {
        setSelectedTag(tagName);
    };

    const clearFilter = () => {
        setSelectedTag(null);
        setSearchText('');
        setStartDate('');
        setEndDate('');
    };

    return (
        <main
            className={`min-h-screen px-6 py-10  ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}
        >
            <Header onSearchChange={handleSearchChange} />
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12 mt-10">Привет, {userName}</h1>

                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Мои теги</h2>
                        <motion.button
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-4xl text-indigo-500 hover:text-indigo-700 transition-all"
                            onClick={addTag}
                        >
                            <FiPlusCircle />
                        </motion.button>
                    </div>

                    <div className="flex flex-wrap gap-12 relative z-0">
                        {tags.map((tag) => (
                            <TagInput
                                key={tag.id}
                                id={tag.id}
                                name={tag.name}
                                color={tag.color}
                                onUpdate={updateTag}
                                onDelete={deleteTag}
                                onSelectTag={handleTagSelect}
                                selectedTag={selectedTag || ''}
                            />
                        ))}
                    </div>
                </section>

                <section className="mb-12 p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Дополнительные фильтры</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div>
                            <label htmlFor="startDate" className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Дата создания (от):</label>
                            <input 
                                type="date" 
                                id="startDate" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={`w-full p-2.5 border rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'}`}
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Дата создания (до):</label>
                            <input 
                                type="date" 
                                id="endDate" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={`w-full p-2.5 border rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'}`}
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-center mt-4 md:mt-0">
                            <input 
                                type="checkbox" 
                                id="showOnlyOwnedNotes" 
                                checked={showOnlyOwnedNotes}
                                onChange={(e) => setShowOnlyOwnedNotes(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="showOnlyOwnedNotes" className={`ml-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>Показывать только мои заметки</label>
                        </div>
                    </div>
                     { (selectedTag || searchText || startDate || endDate || showOnlyOwnedNotes) && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={clearFilter}
                                className="text-indigo-500 hover:text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}"
                            >
                                Сбросить все фильтры
                            </button>
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Мои заметки</h2>
                        <motion.button
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-4xl text-indigo-500 hover:text-indigo-700 transition-all"
                            onClick={() => navigate('/create-note')}
                        >
                            <FiPlusCircle />
                        </motion.button>
                    </div>

                    {filteredNotes.length === 0 ? (
                        <p className="text-gray-500 text-center mt-6">
                            {notes.length === 0
                                ? 'Пока нет заметок. Нажми + чтобы создать!'
                                : 'Нет заметок с выбранным тегом или по данному запросу'}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filteredNotes.map((note) => (
                                <NoteCard
                                    key={note.id}
                                    id={note.id}
                                    title={note.title}
                                    tag={note.tag}
                                    backgroundUrl={note.backgroundUrl}
                                    onDelete={handleDeleteNote}
                                    onEdit={() => navigate(`/edit-note/${note.id}`)}
                                    isShared={note.owner !== currentUser}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default MainPage;
