# Jyoti KM · Portfolio

Plain HTML, CSS and JavaScript. No build step, no npm install.

## Files
- index.html: all the content (text, links, projects, dates)
- styles.css: colours, fonts, layout, responsive rules
- main.js: menu, scroll reveal, text scramble, blob cursor, project previews
- assets/: photos, project screenshots, share image (og.png)
- favicon.svg: tab icon
- netlify.toml: tells Netlify to publish this folder as-is

## Before you deploy
1. Put your latest resume in this folder, named exactly `resume.pdf`.
2. Open `index.html` and check the dates in the "Journey" section.

## Turn on the "On stage" section later
In index.html, find `id="stage" hidden` and delete the word `hidden`,
then replace the [Event name] / [Talk topic] / [City] · [Month Year] text.

## Fix the share preview after your site has a name
Replace `content="assets/og.png"` with the full URL, for example
`content="https://jyotikm.netlify.app/assets/og.png"`.
