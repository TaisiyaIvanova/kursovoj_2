export const getNotes = () => {
    const notesData = localStorage.getItem('notes');
    return notesData ? JSON.parse(notesData) : [];
};
