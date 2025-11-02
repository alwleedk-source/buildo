# Local Images Directory

## Structure
- blog/: Blog article images
- hero/: Hero section backgrounds
- projects/: Project images
- team/: Team member photos
- partners/: Partner logos

## Guidelines
1. Use WebP format for best performance
2. Optimize images before upload (max 1920px width)
3. Use descriptive filenames (e.g., sustainable-building-2024.webp)
4. Keep file sizes under 200KB

## Optimization Tools
- Online: squoosh.app, tinypng.com
- CLI: imagemagick, sharp

## Example Usage
```jsx
<img 
  src="/images/blog/sustainable-building.webp" 
  alt="Sustainable building techniques"
  loading="lazy"
/>
```

