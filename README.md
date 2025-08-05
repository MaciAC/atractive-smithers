# Attractive Smithers

Feeling atractive yet? (• ε •)

## Project Overview

Directori web que mostra memes aleatoris o buscables d'atractive smithers. El crawling del contingut no està inclòs en aquest repo.

## Features

- **Random meme**
- **Busca memes**
- **Busca comentaris**


## Tech Stack

- **Full-stack Framework**: Next.js, React
- **Development Tools**: npm
- **Hosting**: VPS amb Coolify
- **Database**: PostgreSQL
- **Storage**: VPS
- **CI/CD**: Github Actions

## Getting Started

Has de copiar el .env.example al .env i posar les variables d'entorn necessaries. Posa't en contacte amb nosaltres per obtenir l'accés ssh i accedir a la base de dades. El development el fem connectats a producció pq som molt valents.

També et caldrà descarregar tota la media, esta explicat al README de la carpeta scripts.

tipic:
```bash
npm install
```
```bash
npm run dev
```

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

La app es desplega amb cada push a master. Per contribuïr crea una branca, edita el codi i fes una PR.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT license](LICENSE).

## TODO list atractive web:
- automate periodic updates
- timeline 
- millorar ⁠scrapper per obtenir tots els comentaris
- OCR als memes per poder buscar el text del meme
- idees?
