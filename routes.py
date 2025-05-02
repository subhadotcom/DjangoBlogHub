import os
from datetime import datetime
from flask import render_template, redirect, url_for, flash, request, abort, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from urllib.parse import urlparse
from app import app, db
from models import User, Post, Comment, Category
from forms import RegistrationForm, LoginForm, PostForm, CommentForm, SearchForm, CategoryForm, ProfileForm
from sqlalchemy import or_, desc

# Pass current datetime to all templates
@app.context_processor
def inject_now():
    return {'now': datetime.utcnow()}

# Helper function to create a slug from a title
def create_slug(title):
    import re
    # Replace spaces with hyphens and remove special characters
    slug = re.sub(r'[^\w\s]', '', title.lower())
    slug = re.sub(r'\s+', '-', slug)
    # Check if slug exists, append number if needed
    original_slug = slug
    count = 1
    while Post.query.filter_by(slug=slug).first():
        slug = f"{original_slug}-{count}"
        count += 1
    return slug

# Home page
@app.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    posts = Post.query.filter_by(published=True).order_by(Post.created_at.desc()).paginate(page=page, per_page=5)
    return render_template('index.html', posts=posts, title='Home')

# User registration
@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You can now log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form, title='Register')

# User login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid email or password', 'danger')
            return redirect(url_for('login'))
        
        login_user(user, remember=form.remember.data)
        next_page = request.args.get('next')
        if not next_page or urlparse(next_page).netloc != '':
            next_page = url_for('index')
        
        flash('You have been logged in successfully!', 'success')
        return redirect(next_page)
    
    return render_template('login.html', form=form, title='Login')

# User logout
@app.route('/logout')
def logout():
    logout_user()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('index'))

# User profile
@app.route('/profile/<username>')
def profile(username):
    user = User.query.filter_by(username=username).first_or_404()
    posts = Post.query.filter_by(author=user).order_by(Post.created_at.desc()).all()
    return render_template('profile.html', user=user, posts=posts, title=f"{user.username}'s Profile")

# Edit profile
@app.route('/profile/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = ProfileForm(original_username=current_user.username, original_email=current_user.email)
    
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.email = form.email.data
        current_user.bio = form.bio.data
        current_user.avatar = form.avatar.data
        db.session.commit()
        flash('Your profile has been updated!', 'success')
        return redirect(url_for('profile', username=current_user.username))
    
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
        form.bio.data = current_user.bio
        form.avatar.data = current_user.avatar
    
    return render_template('profile.html', form=form, title='Edit Profile', edit_mode=True)

# View post
@app.route('/post/<slug>')
def post(slug):
    post = Post.query.filter_by(slug=slug).first_or_404()
    form = CommentForm()
    return render_template('post.html', post=post, form=form, title=post.title)

# Create post
@app.route('/post/create', methods=['GET', 'POST'])
@login_required
def create_post():
    form = PostForm()
    form.categories.choices = [(c.id, c.name) for c in Category.query.order_by(Category.name).all()]
    
    if form.validate_on_submit():
        slug = form.slug.data if form.slug.data else create_slug(form.title.data)
        post = Post(
            title=form.title.data,
            slug=slug,
            content=form.content.data,
            summary=form.summary.data,
            featured_image=form.featured_image.data,
            published=form.published.data,
            author=current_user
        )
        
        # Add selected categories
        for category_id in form.categories.data:
            category = Category.query.get(category_id)
            if category:
                post.categories.append(category)
        
        db.session.add(post)
        db.session.commit()
        flash('Your post has been created!', 'success')
        return redirect(url_for('post', slug=post.slug))
    
    return render_template('create_post.html', form=form, title='Create Post')

# Edit post
@app.route('/post/<slug>/edit', methods=['GET', 'POST'])
@login_required
def edit_post(slug):
    post = Post.query.filter_by(slug=slug).first_or_404()
    
    # Check if current user is the author
    if post.author != current_user:
        abort(403)
    
    form = PostForm()
    form.categories.choices = [(c.id, c.name) for c in Category.query.order_by(Category.name).all()]
    
    if form.validate_on_submit():
        post.title = form.title.data
        post.slug = form.slug.data
        post.content = form.content.data
        post.summary = form.summary.data
        post.featured_image = form.featured_image.data
        post.published = form.published.data
        post.updated_at = datetime.utcnow()
        
        # Update categories
        post.categories = []
        for category_id in form.categories.data:
            category = Category.query.get(category_id)
            if category:
                post.categories.append(category)
        
        db.session.commit()
        flash('Your post has been updated!', 'success')
        return redirect(url_for('post', slug=post.slug))
    
    elif request.method == 'GET':
        form.title.data = post.title
        form.slug.data = post.slug
        form.content.data = post.content
        form.summary.data = post.summary
        form.featured_image.data = post.featured_image
        form.published.data = post.published
        form.categories.data = [category.id for category in post.categories]
    
    return render_template('edit_post.html', form=form, post=post, title='Edit Post')

# Delete post
@app.route('/post/<slug>/delete', methods=['POST'])
@login_required
def delete_post(slug):
    post = Post.query.filter_by(slug=slug).first_or_404()
    
    # Check if current user is the author
    if post.author != current_user:
        abort(403)
    
    db.session.delete(post)
    db.session.commit()
    flash('Your post has been deleted!', 'success')
    return redirect(url_for('index'))

# Add comment
@app.route('/post/<slug>/comment', methods=['POST'])
@login_required
def add_comment(slug):
    post = Post.query.filter_by(slug=slug).first_or_404()
    form = CommentForm()
    
    if form.validate_on_submit():
        comment = Comment(
            content=form.content.data,
            post=post,
            author=current_user
        )
        db.session.add(comment)
        db.session.commit()
        flash('Your comment has been added!', 'success')
    
    return redirect(url_for('post', slug=post.slug))

# Delete comment
@app.route('/comment/<int:comment_id>/delete', methods=['POST'])
@login_required
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    
    # Check if current user is the author of the comment or post
    if comment.author != current_user and comment.post.author != current_user:
        abort(403)
    
    post_slug = comment.post.slug
    db.session.delete(comment)
    db.session.commit()
    flash('Comment has been deleted.', 'success')
    return redirect(url_for('post', slug=post_slug))

# Search
@app.route('/search')
def search():
    query = request.args.get('query', '')
    if not query:
        return render_template('search.html', title='Search', query='', posts=None)
    
    search_term = f"%{query}%"
    posts = Post.query.filter(
        Post.published == True,
        or_(
            Post.title.ilike(search_term),
            Post.content.ilike(search_term),
            Post.summary.ilike(search_term)
        )
    ).order_by(desc(Post.created_at)).all()
    
    return render_template('search.html', title='Search Results', query=query, posts=posts)

# Categories
@app.route('/categories')
def categories():
    categories = Category.query.order_by(Category.name).all()
    return render_template('categories.html', categories=categories, title='Categories')

# View posts by category
@app.route('/category/<int:category_id>')
def category(category_id):
    category = Category.query.get_or_404(category_id)
    posts = Post.query.filter(
        Post.published == True,
        Post.categories.contains(category)
    ).order_by(desc(Post.created_at)).all()
    
    return render_template('category.html', category=category, posts=posts, title=f'Category: {category.name}')

# Create category (admin only for simplicity)
@app.route('/category/create', methods=['GET', 'POST'])
@login_required
def create_category():
    form = CategoryForm()
    
    if form.validate_on_submit():
        category = Category(
            name=form.name.data,
            description=form.description.data
        )
        db.session.add(category)
        db.session.commit()
        flash('Category has been created!', 'success')
        return redirect(url_for('categories'))
    
    return render_template('create_category.html', form=form, title='Create Category')

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('error.html', error_code=404, message='Page not found'), 404

@app.errorhandler(403)
def forbidden_error(error):
    return render_template('error.html', error_code=403, message='Forbidden'), 403

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('error.html', error_code=500, message='Server error'), 500
