## Tiny Models in Browser

This project explores training and evaluating tiny open-source models directly in the browser for payments-related NLP tasks (intent detection, type classification, amount & currency extraction).

## Getting Started
Clone the repository:

```
git clone git@github.com:tonible14012002/Proof-Of-Work-Tiny-Models-For-Node.git
cd Proof-Of-Work-Tiny-Models-For-Node
```

Install dependencies (using Bun or npm):

```
bun install
```


Run the development server:

```
bun run dev
```


Open in your browser at http://localhost:5173

## Technical Document

**Project structure**

```
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, styles
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions, model logic
│   ├── pages/           # Page-level components
│   ├── index.css        # Global styles
│   ├── main.tsx         # App entry point
│   └── vite-env.d.ts    # Vite environment types
├── index.html           # Root HTML file
├── package.json         # Dependencies & scripts
├── Makefile             # Automation scripts
└── README.md            # Project documentation
```