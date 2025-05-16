import { useEffect, useRef, useState } from 'react';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

type TagInputProps = {
    id: string;
    name: string;
    color: string;
    onUpdate: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
    onSelectTag: (tagName: string) => void;
    selectedTag: string;
    isNewTag?: boolean;
};

const TagInput: React.FC<TagInputProps> = ({
    id,
    name,
    onUpdate,
    onDelete,
    onSelectTag,
    selectedTag,
    isNewTag = false,
    color,
}) => {
    const [isEditing, setIsEditing] = useState(isNewTag);
    const [newName, setNewName] = useState(name);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isNewTag && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isNewTag]);

    const toggleEditMode = () => setIsEditing(!isEditing);

    const handleUpdate = () => {
        if (newName.trim() !== '') {
            onUpdate(id, newName);
            setIsEditing(false);
        }
    };

    return (
        <div
            className={`relative flex items-center justify-between px-4 py-2 rounded-full border-2 cursor-pointer transition-colors duration-300 group z-10 ${
                selectedTag === name
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : `${color} text-white border-transparent`
            }`}
            onClick={() => onSelectTag(name)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleUpdate}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleUpdate();
                            }
                        }}
                        className="bg-transparent outline-none text-sm font-semibold w-28"
                    />
                ) : (
                    <span className="text-sm font-semibold">{name}</span>
                )}
            </div>

            <AnimatePresence>
                {isHovered && !isEditing && (
                    <motion.div
                        key="actions"
                        className="flex items-center space-x-2 absolute right-[-70px] top-1/2 -translate-y-1/2 z-20"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            className="bg-blue-500 text-white p-1 rounded-full shadow-lg hover:shadow-xl"
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiEdit className="text-xs" onClick={toggleEditMode} />
                        </motion.div>
                        <motion.div
                            className="bg-red-500 text-white p-1 rounded-full shadow-lg hover:shadow-xl"
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiTrash className="text-xs" onClick={() => onDelete(id)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TagInput;
