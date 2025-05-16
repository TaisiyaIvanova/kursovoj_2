export const getCurrentUser = () => {
    return localStorage.getItem('currentUser');
};

export const getCurrentUserData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const email = getCurrentUser();
    return email ? users[email] : null;
};
