# eduschedule
A full-stack scheduling management system for educational institutions. Built with React, Node.js/Express, and PostgreSQL.

> Système de gestion d'emplois du temps pour établissements scolaires.

## 🚀 Stack technique
- **Frontend** : React + Vite + TailwindCSS
- **Backend**  : Node.js + Express + JWT
- **Database** : PostgreSQL + Prisma ORM
- **Deploy**   : Vercel (client) + Railway (server)

## 👤 Rôles
| Rôle | Accès |
|------|-------|
| Admin | Gestion complète |
| Enseignant | Voir son emploi du temps |
| Étudiant | Voir son emploi du temps |

## ⚙️ Installation
\`\`\`bash
# Backend
cd server && npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

# Frontend
cd client && npm install
npm run dev
\`\`\`

## 📸 Screenshots
*Coming soon...*

## 🌐 Déploiement Vercel + ngrok

### 1. Configurer les variables d'environnement sur Vercel
Dans le **Vercel Dashboard** :
- Allez dans **Project Settings → Environment Variables**
- Ajoutez :
  - `VITE_API_URL` = `https://dismantle-concave-matching.ngrok-free.dev/api`
- Redéployez le frontend

### 2. Lancer le backend avec ngrok
```bash
cd server
npm run dev
ngrok http 3000
```

> ⚠️ **Important** : L'URL ngrok change à chaque redémarrage de ngrok.  
> Pensez à mettre à jour `VITE_API_URL` dans les variables d'environnement Vercel, puis redéployez.
