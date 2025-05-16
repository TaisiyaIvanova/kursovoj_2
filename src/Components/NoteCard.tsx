// import { useNavigate } from "react-router-dom";
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTheme } from '../Context/ThemeContext';

type NoteCardProps = {
    id: string;
    title: string;
    tag: string;
    backgroundUrl: string;
    onDelete: (id: string) => void;
    onEdit: () => void;
    isShared?: boolean;
};

const getRandomGradient = () => {
    const gradients = [
        'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
        'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
};

const NoteCard = ({
    id,
    title,
    tag,
    backgroundUrl,
    onDelete,
    onEdit,
    isShared = false,
}: NoteCardProps) => {
    // const navigate = useNavigate();
    const { theme } = useTheme();
    const fallbackGradient = useMemo(() => getRandomGradient(), []);
    const hasBackground = Boolean(backgroundUrl);

    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
            onDelete(id);
        }
    };

    return (
        <motion.div
            className={`relative rounded-xl overflow-hidden w-80 h-96 border transition-all duration-300 mb-6 ${
                theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-700 shadow-xl hover:shadow-2xl'
                    : 'bg-white text-black border-indigo-300 shadow-lg hover:shadow-xl'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                className="w-full h-2/3 bg-cover bg-center rounded-t-xl transition-all duration-500"
                style={{
                    background: hasBackground
                        ? `url(${backgroundUrl}) center/cover no-repeat`
                        : fallbackGradient,
                }}
            ></motion.div>

            <div
                className={`p-6 flex flex-col justify-between h-1/3 relative transition-colors duration-300 ${
                    theme === 'dark'
                        ? 'bg-gray-900 text-white border-t border-gray-700'
                        : 'bg-white text-black'
                }`}
            >
                <h3 className="text-xl font-semibold mb-2 text-indigo-600 hover:text-indigo-800 transition-all">
                    {title}
                </h3>

                {isShared && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                        Совместная заметка
                    </div>
                )}

                <div className="absolute bottom-4 left-3 flex gap-3">
                    <motion.button
                        onClick={onEdit}
                        className="text-yellow-500 hover:text-yellow-600 text-2xl px-4 py-2 rounded-full transition-all"
                        whileHover={{ scale: 1.3, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <MdModeEdit />
                    </motion.button>
                    <motion.button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-600 text-2xl px-4 py-2 rounded-full transition-all"
                        whileHover={{ scale: 1.3, rotate: -15 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <MdDelete />
                    </motion.button>
                </div>

                <div className="absolute bottom-5 right-5">
                    <span className="bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold">
                        {tag}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default NoteCard;
