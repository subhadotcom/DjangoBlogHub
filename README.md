# DjangoBlogHub (Flask Blog Platform)

A modern, full-featured blogging platform built with Flask, SQLAlchemy, and Flask-Login. This project supports user registration, authentication, post creation and management, categories, comments, user profiles, and more.

## Features

- User registration, login, and profile management
- Create, edit, and delete blog posts with rich content
- Categorize posts and browse by category
- Comment on posts (with support for nested replies)
- Search posts by keywords
- Responsive, modern UI with custom CSS and JavaScript
- Error handling for 404, 403, and 500 errors

## Project Structure

```
.
├── app.py                # Flask app and extension initialization
├── main.py               # Application entry point
├── routes.py             # All route definitions and view logic
├── models.py             # SQLAlchemy models (User, Post, Comment, Category)
├── forms.py              # WTForms form classes and validation
├── templates/            # Jinja2 HTML templates
├── static/
│   ├── css/              # Custom stylesheets
│   └── js/               # JavaScript files (editor, scripts, animations)
├── pyproject.toml        # Project metadata and dependencies
├── uv.lock               # Dependency lock file
└── generated-icon.png    # Project icon
```

## Installation

### Prerequisites

- Python 3.11+
- PostgreSQL (or update `DATABASE_URL` for another DB)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd DjangoBlogHub
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   Or, if using `pyproject.toml`:
   ```bash
   pip install .
   ```

3. **Set environment variables:**
   - `DATABASE_URL`: Your database connection string (e.g., `postgresql://user:password@localhost/dbname`)
   - `SESSION_SECRET`: (Optional) Secret key for session management

4. **Initialize the database:**
   The database tables are created automatically on first run.

5. **Run the application:**
   ```bash
   python main.py
   ```
   The app will be available at [http://localhost:5000](http://localhost:5000).

## Usage

- Register a new user or log in.
- Create, edit, or delete your own posts.
- Browse posts by category or search for keywords.
- Comment on posts and reply to other comments.
- Edit your profile, including bio and avatar.

## Core Components

### Models

- **User**: Handles authentication, profile, and relationships to posts/comments.
- **Post**: Blog post content, slug, summary, featured image, categories, and author.
- **Comment**: Supports nested replies, linked to users and posts.
- **Category**: Organize posts by topic.

### Forms

- Registration, login, post creation/editing, comment, search, category, and profile forms with validation.

### Templates

- Responsive HTML templates for all major views: home, post, profile, category, search, error pages, etc.

### Static Files

- Custom CSS for styling.
- JavaScript for editor functionality, UI scripts, and animations.

## Configuration

- All configuration is handled in `app.py` and via environment variables.
- Database URI and session secret should be set for production.

## Deployment

- Use Gunicorn for production:
  ```bash
  gunicorn -w 4 main:app
  ```
- Configure a production-ready database and secure your secret keys.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the Apache License - see the LICENSE file for details.