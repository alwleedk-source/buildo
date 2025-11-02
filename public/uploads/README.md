# Uploads Directory

This directory stores uploaded images for the blog.

## Structure

- `/blog/` - Blog featured images and thumbnails

## File Handling

- Images are automatically optimized and converted to WebP format
- Original images are resized to max 1200x800px
- Thumbnails are created at 400x300px
- All images are compressed with 85% quality

## Gitignore

Image files (*.webp) are ignored by git to keep the repository size small.
In production, these files should be stored in a CDN or cloud storage service.
