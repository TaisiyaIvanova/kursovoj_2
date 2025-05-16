import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';
import { FiArrowLeft, FiUserPlus, FiXCircle } from 'react-icons/fi';

interface NoteData {
    id: string;
    title: string;
    content: string;
    tag: string;
    backgroundUrl: string;
    owner: string;
    createdAt: string;
    sharedWith?: string[];
}

const EditNotePage = () => {
    const { id } = useParams<{ id: string }>();
    const [note, setNote] = useState<NoteData | null>(null);
    const [title, setTitle] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState('');
    const [userTags, setUserTags] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [emailToShare, setEmailToShare] = useState('');
    const [emailsForSharingList, setEmailsForSharingList] = useState<string[]>([]);
    const [shareError, setShareError] = useState<string>('');
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const currentEmailFromStorage = localStorage.getItem('currentUser');
        if (!currentEmailFromStorage) {
            navigate('/login');
            return;
        }
        setCurrentUserEmail(currentEmailFromStorage);

        const notes: NoteData[] = JSON.parse(localStorage.getItem('notes') || '[]');
        const foundNote = notes.find((n: NoteData) => n.id === id);

        if (foundNote) {
            setNote(foundNote);
            setTitle(foundNote.title);
            setSelectedTag(foundNote.tag || null);
            setBackgroundUrl(foundNote.backgroundUrl || '');
            setContent(foundNote.content || '');
            setEmailsForSharingList(foundNote.sharedWith || []);

            const authorized =
                foundNote.owner === currentEmailFromStorage ||
                (foundNote.sharedWith && foundNote.sharedWith.includes(currentEmailFromStorage));
            setIsAuthorized(Boolean(authorized));
            if (!authorized) {
                console.warn('User not authorized to edit this note.');
            }
        } else {
            navigate('/main');
            return;
        }

        const savedTags = localStorage.getItem(`tags_${currentEmailFromStorage}`);
        if (savedTags) {
            try {
                const parsed = JSON.parse(savedTags);
                setUserTags(parsed.map((t: { name: string }) => t.name));
            } catch {
                setUserTags([]);
            }
        }
    }, [id, navigate]);

    const handleTagClick = (tag: string) => {
        if (!isAuthorized) return;
        setSelectedTag(selectedTag === tag ? null : tag);
    };

    const handleAddEmailToShare = () => {
        if (!isAuthorized) return;
        setShareError('');
        if (!emailToShare.trim()) {
            setShareError('Email не может быть пустым.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToShare)) {
            setShareError('Неверный формат email.');
            return;
        }
        if (emailToShare === currentUserEmail) {
            setShareError('Вы не можете поделиться заметкой с самим собой.');
            return;
        }
        if (emailsForSharingList.includes(emailToShare)) {
            setShareError('Этот пользователь уже добавлен.');
            return;
        }
        const allUsers = JSON.parse(localStorage.getItem('users') || '{}');
        if (!allUsers[emailToShare]) {
            setShareError('Пользователь с таким email не найден.');
            return;
        }
        setEmailsForSharingList([...emailsForSharingList, emailToShare]);
        setEmailToShare('');
    };

    const handleRemoveEmailFromShare = (emailToRemove: string) => {
        if (!isAuthorized) return;
        setEmailsForSharingList(emailsForSharingList.filter((email) => email !== emailToRemove));
    };

    const handleSubmit = () => {
        if (!isAuthorized) {
            alert('У вас нет прав для редактирования этой заметки.');
            return;
        }
        if (!title.trim() || !content.trim() || !selectedTag) {
            alert('Пожалуйста, заполните все поля: Название, Контент и Тег.');
            return;
        }

        const notes: NoteData[] = JSON.parse(localStorage.getItem('notes') || '[]');
        const updatedNotes = notes.map((n: NoteData) =>
            n.id === id
                ? {
                      ...n,
                      title,
                      content,
                      tag: selectedTag,
                      backgroundUrl,
                      sharedWith: emailsForSharingList,
                  }
                : n,
        );
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        navigate('/main');
    };

    if (!note)
        return (
            <div className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Загрузка...
            </div>
        );
    if (!isAuthorized && note)
        return (
            <div className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                У вас нет доступа для редактирования этой заметки.
            </div>
        );

    return (
        <div
            className={`min-h-screen py-10 px-6 ${
                theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            } transition-colors duration-300`}
        >
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition font-medium z-10"
            >
                <FiArrowLeft size={20} />
                Назад
            </button>

            <div className="max-w-4xl mx-auto relative">
                <h1 className="text-3xl font-bold text-center mb-8">Редактировать заметку</h1>

                <div className="mb-6 mt-10">
                    <label className="block mb-2 font-semibold">Название</label>
                    <input
                        type="text"
                        placeholder="Введите название"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded border bg-transparent border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        disabled={!isAuthorized}
                    />
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                    {userTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`${
                                selectedTag === tag
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : theme === 'dark'
                                      ? 'bg-gray-700 text-white'
                                      : 'bg-gray-100 text-gray-800'
                            } py-2 px-4 rounded-full transition-all duration-300 hover:scale-105`}
                            disabled={!isAuthorized}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Поделиться с (по Email):</label>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="email"
                            placeholder="Введите email пользователя"
                            value={emailToShare}
                            onChange={(e) => setEmailToShare(e.target.value)}
                            className={`flex-grow p-3 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                            disabled={!isAuthorized}
                        />
                        <button
                            type="button"
                            onClick={handleAddEmailToShare}
                            className={`p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center ${!isAuthorized ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label="Добавить пользователя"
                            disabled={!isAuthorized}
                        >
                            <FiUserPlus size={20} />
                        </button>
                    </div>
                    {shareError && <p className="text-red-500 text-sm mb-2">{shareError}</p>}
                    {emailsForSharingList.length > 0 && (
                        <div className="mt-2 space-y-2">
                            <p className="text-sm font-medium">Поделено с:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1">
                                {emailsForSharingList.map((email) => (
                                    <li
                                        key={email}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span>{email}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEmailFromShare(email)}
                                            className={`text-red-500 hover:text-red-700 ${!isAuthorized ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            aria-label={`Удалить ${email} из списка`}
                                            disabled={!isAuthorized}
                                        >
                                            <FiXCircle size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Фоновое изображение (URL)</label>
                    <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={backgroundUrl}
                        onChange={(e) => setBackgroundUrl(e.target.value)}
                        className="w-full p-3 rounded border bg-transparent border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        disabled={!isAuthorized}
                    />
                </div>

                <div className="mb-8">
                    <label className="block mb-2 font-semibold">Контент</label>
                    <Editor
                        apiKey="t8oo9mg6bapoipa27f0qskb0q88othaa91zt4sp89pgd4qfq"
                        onEditorChange={(newValue) => {
                            if (isAuthorized) setContent(newValue);
                        }}
                        value={content}
                        disabled={!isAuthorized}
                        init={{
                            height: 500,
                            menubar: false,
                            skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                            content_css: theme === 'dark' ? 'dark' : 'default',
                            plugins: [
                                'anchor',
                                'autolink',
                                'charmap',
                                'codesample',
                                'emoticons',
                                'image',
                                'link',
                                'lists',
                                'media',
                                'searchreplace',
                                'table',
                                'visualblocks',
                                'wordcount',
                                'checklist',
                                'mediaembed',
                                'casechange',
                                'formatpainter',
                                'pageembed',
                                'a11ychecker',
                                'tinymcespellchecker',
                                'permanentpen',
                                'powerpaste',
                                'advtable',
                                'advcode',
                                'editimage',
                                'advtemplate',
                                'mentions',
                                'tinycomments',
                                'tableofcontents',
                                'footnotes',
                                'mergetags',
                                'autocorrect',
                                'typography',
                                'inlinecss',
                                'markdown',
                                'importword',
                                'exportword',
                                'exportpdf',
                            ],
                            toolbar:
                                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                            tinycomments_mode: 'embedded',
                            tinycomments_author: 'Author name',
                            mergetags_list: [
                                { value: 'First.Name', title: 'First Name' },
                                { value: 'Email', title: 'Email' },
                            ],
                        }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                    disabled={!isAuthorized || !title || !content || !selectedTag}
                >
                    Сохранить изменения
                </button>
            </div>
        </div>
    );
};

export default EditNotePage;
