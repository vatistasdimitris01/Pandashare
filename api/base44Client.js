// Basic mock client for base44
const storageKey = 'pandashare_data';

const getStore = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
const saveStore = (data) => localStorage.setItem(storageKey, JSON.stringify(data));

export const base44 = {
    entities: {
        SharedContent: {
            create: async (data) => {
                const store = getStore();
                const newItem = {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                    created_date: new Date().toISOString()
                };
                store.push(newItem);
                saveStore(store);
                return newItem;
            },
            filter: async (query) => {
                const store = getStore();
                return store.filter(item => {
                    return Object.entries(query).every(([key, value]) => item[key] === value);
                });
            },
            update: async (id, data) => {
                const store = getStore();
                const index = store.findIndex(item => item.id === id);
                if (index !== -1) {
                    store[index] = { ...store[index], ...data };
                    saveStore(store);
                    return store[index];
                }
                throw new Error('Not found');
            }
        }
    },
    integrations: {
        Core: {
            UploadFile: async ({ file }) => {
                // Simulate file upload by creating a data URL if needed, 
                // but for this mock we'll just return a fake URL
                // In a real app, this would upload to S3/Cloudinary/etc.
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({ file_url: reader.result });
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    }
};
