# 🐼 Panda Share

Panda Share is a modern, minimalist web application designed for fast and instant sharing of files, folders, and text. No registration, no overhead—just panda-fast sharing.

## ✨ Features

- **Multi-format Sharing**: Share single files, entire folders, or simple text/paste content.
- **Instant QR Codes**: Generate real-time QR codes for any share link.
- **Premium UI/UX**: A beautiful, teal-themed interface with smooth animations powered by Framer Motion.
- **Responsive Design**: Works seamlessly across mobile, tablet, and desktop devices.
- **Zero Configuration**: No accounts or login required. Just drop or paste, and share.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Pandashare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
├── api/                # Mock API client (localStorage based)
├── components/         # Reusable UI and Share components
│   ├── share/          # Specific share logic (uploader, qr, etc)
│   └── ui/             # Core UI components
├── entities/           # Data schemas and definitions
├── pages/              # Application views (Home, View)
├── utils/              # Helper functions
├── App.jsx             # Root component and Routing
└── main.jsx            # Application entry point
```

## 📄 License

This project is open-source and available under the MIT License.

## 🤝 Credits

Built with ❤️ by [@vatistasdimitris](https://instagram.com/vatistasdimitris)
