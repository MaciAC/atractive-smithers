# Attractive Smithers

Feeling atractive yet?

## Project Overview

Web irectori d'atractive smithers per protegir la IP dels memes. El crawling del contingut no està inclòs en aquest repo, s'ha dafegir i automatitzar.

## Features

- **Busca memes**
- **Busca comentaris**


## Tech Stack

- **Frontend**: Next.js, React
- **Development Tools**: npm
- **Deployment**: Vercel
- **Storage**: R2

## Getting Started

Abans de res necessitaràs en fitxer .env.local amb les variables del r2:

```bash
R2_REGION="auto"
R2_ENDPOINT=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="atractive-smithers"
```

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

The project structure follows the Next.js App Router convention:
- `/app`: Contains pages and components
- `/public`: Static assets
- `/components`: Reusable UI components

### Code Quality and Pre-commit Hooks

This project uses Husky and lint-staged to enforce code quality standards before commits:

1. **Pre-commit Hook**: Automatically runs ESLint on staged files before each commit
2. **ESLint Configuration**: Custom rules are defined in `.eslintrc.json`

When you commit changes, the pre-commit hook will:
- Lint your staged files
- Attempt to automatically fix issues
- Block the commit if there are unfixable errors

To manually run the linter:
```bash
npm run lint
```

To bypass the pre-commit hook in exceptional cases (not recommended):
```bash
git commit -m "Your message" --no-verify
```

## Deployment

La app es desplega amb cada push a main. Per contribuïr crea una branca, edita el codi i fes una PR.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT license](LICENSE).

## TODO list atractive web:
- automate periodic periodic updates
- timeline per mostrar arcs
- ⁠scrap tots els coments
- OCR a tot els memes
