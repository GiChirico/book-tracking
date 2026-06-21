# 📖 Book Tracker

A beautiful, interactive web application to track and manage your personal book collection. Built with Vite, Tailwind CSS, and vanilla JavaScript.

## Features

- **Add Books** - Create new book entries with title, author, status, and rating
- **Book Management** - Edit or delete books from your collection
- **Star Ratings** - Rate books on a 5-star scale
- **Cover Images** - Automatically fetch book covers from OpenLibrary API
- **Persistent Storage** - All books are saved to browser's local storage
- **Search** - Search functionality to find books in your collection
- **Responsive Design** - Works great on desktop and mobile devices

## Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: Vanilla JavaScript (ES6+)
- **Storage**: Browser Local Storage
- **API**: [OpenLibrary API](https://openlibrary.org/developers/api) for book covers

## Installation & Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd book-tracking-vite
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## How to Use

1. Click **"+ Add New Book"** to open the book form
2. Fill in the book details:
   - **Title**: Book title
   - **Author**: Author name
   - **Status**: Current reading status (e.g., "To Read", "Currently Reading", "Finished")
   - **Rating**: Click on stars to rate (1-5 stars)
3. Submit the form - the app will automatically fetch the book cover
4. View your books in the collection below
5. **Edit** a book to update its details
6. **Delete** a book to remove it from your collection

## Data Storage

Books are automatically saved to your browser's local storage. Your collection will persist even after closing and reopening the browser.

## License

This project is open source and available under the MIT License.

---

Made with ❤️ for book lovers
