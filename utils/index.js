export const createPageUrl = (page) => {
    const pages = {
        'Home': '/',
        'View': '/view'
    };
    return pages[page] || '/';
};
