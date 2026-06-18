export const ADMIN_CREDENTIALS = {
    email: 'admin@khanmoves.co.uk',
    password: 'Admin@123',
};

const KEY = 'khanmoves_admin';

export const loginAdmin = (email, password) => {
    const ok =
        email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === ADMIN_CREDENTIALS.password;
    if (ok) sessionStorage.setItem(KEY, 'true');
    return ok;
};

export const logoutAdmin = () => sessionStorage.removeItem(KEY);
export const isAdminAuthed = () => sessionStorage.getItem(KEY) === 'true';