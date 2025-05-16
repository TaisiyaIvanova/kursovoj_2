import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';
import { FiArrowLeft, FiUserPlus, FiXCircle } from 'react-icons/fi';

const CreateNotePage = () => {
    const [title, setTitle] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState('');
    const [userTags, setUserTags] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [emailToShare, setEmailToShare] = useState('');
    const [emailsForSharingList, setEmailsForSharingList] = useState<string[]>([]);
    const [shareError, setShareError] = useState<string>('');

    const navigate = useNavigate();
    const { theme } = useTheme();
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const currentEmail = localStorage.getItem('currentUser');
        if (!currentEmail) {
            navigate('/login');
            return;
        }
        setCurrentUserEmail(currentEmail);

        const savedTags = localStorage.getItem(`tags_${currentEmail}`);
        if (savedTags) {
            try {
                const parsed = JSON.parse(savedTags);
                setUserTags(parsed.map((t: { name: string }) => t.name));
            } catch {
                setUserTags([]);
            }
        }
    }, [navigate]);

    const handleTagClick = (tag: string) => {
        setSelectedTag(selectedTag === tag ? null : tag);
    };

    const handleAddEmailToShare = () => {
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
        setEmailsForSharingList(emailsForSharingList.filter((email) => email !== emailToRemove));
    };

    const handleSubmit = () => {
        if (!title.trim() || !content.trim() || !selectedTag) {
            alert('Пожалуйста, заполните все поля: Название, Контент и Тег.');
            return;
        }

        const currentEmail = localStorage.getItem('currentUser');
        if (!currentEmail) {
            navigate('/login');
            return;
        }

        const newNote = {
            id: Date.now().toString(),
            title,
            content,
            tag: selectedTag,
            backgroundUrl,
            owner: currentEmail,
            createdAt: new Date().toISOString(),
            sharedWith: emailsForSharingList,
        };

        try {
            const notes = JSON.parse(localStorage.getItem('notes') || '[]');
            const updatedNotes = [...notes, newNote];
            localStorage.setItem('notes', JSON.stringify(updatedNotes));

            navigate('/main');
        } catch (error) {
            console.error('Ошибка при сохранении заметки:', error);
            alert('Произошла ошибка при сохранении заметки');
        }
    };

    return (
        <div
            className={`min-h-screen py-10 px-6 ${
                theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            } transition-colors duration-300`}
        >
            <button
                onClick={() => navigate(-1)}
                className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition font-medium"
            >
                <FiArrowLeft size={20} />
                Назад
            </button>

            <div className="max-w-4xl mx-auto relative">
                <h1 className="text-3xl font-bold text-center mb-8">Создать новую заметку</h1>

                <div className="mb-6 mt-10">
                    <label className="block mb-2 font-semibold">Название</label>
                    <input
                        type="text"
                        placeholder="Введите название"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded border bg-transparent border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Тег</label>
                    <div className="flex flex-wrap gap-2">
                        {userTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagClick(tag)}
                                className={`${
                                    selectedTag === tag
                                        ? 'bg-indigo-600 text-white'
                                        : theme === 'dark'
                                          ? 'bg-gray-700 text-white'
                                          : 'bg-gray-200 text-gray-800'
                                } px-4 py-2 rounded-full text-sm font-medium transition-colors`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    {userTags.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Нет доступных тегов. Сначала создайте теги на главной странице.
                        </p>
                    )}
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
                        />
                        <button
                            type="button"
                            onClick={handleAddEmailToShare}
                            className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center"
                            aria-label="Добавить пользователя"
                        >
                            <FiUserPlus size={20} />
                        </button>
                    </div>
                    {shareError && <p className="text-red-500 text-sm mb-2">{shareError}</p>}
                    {emailsForSharingList.length > 0 && (
                        <div className="mt-2 space-y-2">
                            <p className="text-sm font-medium">Будет поделено с:</p>
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
                                            className="text-red-500 hover:text-red-700"
                                            aria-label={`Удалить ${email} из списка`}
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
                    />
                </div>

                <div className="mb-8">
                    <label className="block mb-2 font-semibold">Контент</label>
                    <Editor
                        apiKey="t8oo9mg6bapoipa27f0qskb0q88othaa91zt4sp89pgd4qfq"
                        onEditorChange={(newValue) => setContent(newValue)}
                        value={content}
                        init={{
                            height: 500,
                            menubar: false,
                            skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                            content_css: theme === 'dark' ? 'dark' : 'default',
                            plugins: [
                                'advlist',
                                'autolink',
                                'lists',
                                'link',
                                'image',
                                'charmap',
                                'preview',
                                'anchor',
                                'searchreplace',
                                'visualblocks',
                                'code',
                                'fullscreen',
                                'insertdatetime',
                                'media',
                                'table',
                                'code',
                                'help',
                                'wordcount',
                            ],
                            toolbar:
                                'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style:
                                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!title || !content || !selectedTag}
                    className={`px-6 py-3 rounded font-semibold transition ${
                        !title || !content || !selectedTag
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                    Создать заметку
                </button>
            </div>
        </div>
    );
};

export default CreateNotePage;
