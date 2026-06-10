# Revenue Counter — Briefing Complet du Projet

> **Document de référence** pour tout nouveau collaborateur rejoignant le projet.  
> Dernière mise à jour : 10/06/2026

---

## 🏛️ Contexte Produit

**Revenue Counter** est un système numérique de collecte des taxes municipales utilisé en **République Démocratique du Congo**, développé pour la **Mairie de Lubumbashi**.

Le marché cible initial est le **Marché Kenya** (Lubumbashi), mais l'architecture est conçue pour être multi-structures.

### Problème résolu
Avant ce système, les agents de terrain collectaient les taxes manuellement (papier). L'application digitalise ce processus de A à Z : de la collecte terrain jusqu'au pilotage stratégique par la direction.

---

## 👥 Les 3 Rôles de l'Application

| Rôle | Description | Accès |
|------|-------------|-------|
| **agent** | Collecteur de terrain. Enregistre les paiements, consulte les commerçants. | `/dashboard`, `/paiements`, `/commercants`, `/taxes` |
| **admin** | Superviseur local (ex: chef du marché Kenya). Gère les agents, zones, commerçants de son périmètre. | `/admin/dashboard`, `/admin/agents`, `/admin/zones`, `/admin/commercants`, `/admin/taxes` |
| **superadmin** | Direction Générale. Pilotage global de toutes les structures de la ville. | `/superadmin/dashboard`, `/superadmin/structures`, `/superadmin/admins`, `/superadmin/commercants`, `/superadmin/configuration` |

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|------------|
| Framework | **Next.js** (App Router) |
| UI Components | **shadcn/ui** (@base-ui/react) |
| Styling | **Tailwind CSS** + variables CSS **OKLCH** |
| Icônes | **Lucide React** |
| État asynchrone | **TanStack React Query** |
| HTTP Client | **Axios** |
| Sessions | **Cookies + LocalStorage** |
| Backend API | **Laravel (Render)** — `https://revenue-counter-api.onrender.com/api` |

---

## 🔐 Système d'Authentification (Phase 3 — Terminée)

L'authentification est sécurisée et centralisée.

### 1. Flux de Connexion
1. **Login** : L'utilisateur saisit son **Code Agent** (8 caractères, ex: `AT300001`) et son mot de passe.
2. **Token** : Le serveur renvoie un `access_token` (Bearer).
3. **Persistance** : Le token est stocké dans le `localStorage` et dans un cookie (pour le middleware).
4. **Vérification** : À chaque chargement/refresh, le frontend appelle `GET /user` pour valider le token et récupérer les infos réelles.

### 2. Sécurité & Protection des routes
- **Middleware** : Bloque l'accès aux pages protégées si le token est absent. Redirige vers `/`.
- **Contrôle par rôle** : Le middleware empêche un `agent` d'aller sur `/admin` ou `/superadmin`.
- **Auto-Logout** : Toute erreur **401 (Unauthorized)** détectée par l'intercepteur Axios déclenche la suppression de la session et la redirection vers le login.

### 3. Règles d'or de sécurité
- **Ne jamais faire confiance au frontend** : L'affichage des pages dépend de l'état `user` validé par le backend.
- **Header Accept** : Toujours envoyer `Accept: application/json` pour garantir que Laravel ne tente pas de redirection HTML en cas d'erreur.

---

## 🎨 Design System

### Couleurs (thème RDC)
Les couleurs sont définies via des variables CSS OKLCH dans `globals.css`.

### Composants UI disponibles
Situés dans `components/ui/` :
- `button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `table.tsx`, `skeleton.tsx`
- `sonner.tsx` (Toaster)
- `action-button.tsx`, `skeletons.tsx`, `empty-state.tsx` (Composants custom métier)

---

## 📋 Plan de Développement

```
Phase 1 : Infrastructure & Plomberie       ✅ TERMINÉE
Phase 2 : Nettoyage des Mocks & États UI  ✅ TERMINÉE
Phase 3 : Sessions & Authentification     ✅ TERMINÉE
Phase 4 : Dynamisation des flux métiers  ⏳ EN COURS
  ├─ 4.1 Récupération des taxes (useQuery sur GET /taxes)
  ├─ 4.2 Liste des commerçants (useQuery sur GET /commercants)
  ├─ 4.3 Enregistrement paiements (useMutation sur POST /paiements)
```

---

## 🧪 Audit des Mocks (Transition Phase 4)

Actuellement, les pages suivantes utilisent encore des données fictives (`mocks/`) :
- **Dashboard (Tous)** : Stats KPI et graphiques.
- **Commerçants** : Liste et recherche.
- **Paiements** : Historique et formulaire de création.
- **Agents/Zones** : Gestion administrative (Admin).

> **Convention de dynamisation** : Remplacer `const [isLoading] = useState(false)` par le status de `useQuery` et injecter les données de l'API à la place des objets importés de `@/mocks/*`.

---

## 🚀 Pour Démarrer

```bash
npm install
npm run dev
```

**URL locale** : `http://localhost:3000`

**Identifiants de test** : À vérifier directement dans la base de données via le Code Agent (ex: `AT300001`).
