# Ctrl+Alt+Brew (Basic Express Routing)

    npm install
    npm start        # or: npm run dev (nodemon)

Open http://localhost:3000

| Route | Purpose |
|---|---|
| GET / , /menu , /about , /contact | HTML pages (logs "Rendering <file>") |
| GET /api/menu?category=milk&search=lat | JSON list, filtered by query string |
| GET /api/menu/:id | One item via route parameter (404 JSON if missing) |
| GET /api/contact?name=&email=&message= | Contact form handler |
| /css, /js, /images | Static assets via express.static() |
