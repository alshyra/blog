---
title: "Automatiser son workflow GitHub avec Hermes Agent"
description: "Comment j'ai mis en place un pipeline GitHub complètement autonome : webhook → plan → approve → merge → déploiement, avec Hermes Agent."
pubDate: 2026-06-08
category: "Hermes"
homeFeatured: true
homeHeroOrder: 1
homeOrder: 1
---

**TL;DR** — Hermes Agent peut écouter les webhooks GitHub, analyser les issues et PR, proposer un plan, l'exécuter sur validation, et merge automatiquement. Le tout sur sa propre infra, sans dépendre d'un SaaS.

---

## Pourquoi automatiser ?

J'utilise Hermes Agent pour plein de tâches du quotidien : revue de code, réponses sur des issues, corrections de bugs, petites features. Le problème ? Chaque interaction demandait de :

1. Lire le contexte (issue, PR, commentaire)
2. Comprendre ce qui est demandé
3. Faire les changements
4. Ouvrir une PR ou merger
5. Attendre le déploiement

C'est beaucoup d'étapes manuelles pour des actions répétitives. Le workflow GitHub d'Hermes Agent réduit ça à une seule commande en commentaire.

---

## L'architecture du workflow

![Workflow GitHub → Hermes Agent](/diagrams/workflow-architecture.excalidraw.png)

*Le diagramme est éditable — glisse-le sur [excalidraw.com](https://excalidraw.com) pour le modifier.*

### Le webhook gateway

Hermes Agent expose un endpoint HTTP qui reçoit les webhooks GitHub. Pour chaque événement (`issues`, `issue_comment`, `pull_request`, `pull_request_review_comment`), un **worker webhook** est spawné avec le prompt approprié.

La configuration est déclarative :

```yaml
# ~/.hermes/config.yaml
webhook_subscriptions:
  - id: rpg-issues
    events:
      - issues
      - issue_comment
      - pull_request
      - pull_request_review_comment
    prompt: ~/.hermes/prompts/gh-plan-approve.txt
```

Cette ligne suffit à connecter un repo entier. Le prompt `gh-plan-approve.txt` décrit le comportement attendu :

> *Tu es un assistant DevOps intégré au workflow GitHub. Quand tu reçois une notification webhook, analyse le contexte complet de l'issue ou PR. Propose un plan d'action. L'utilisateur peut répondre "Hermes approve" pour exécuter.*

### Les commandes disponibles

Insensibles à la casse, reconnaissables en commentaire GitHub :

| Commande | Action |
|----------|--------|
| **Hermes plan** | Analyser et proposer un plan |
| **Hermes approve** | Valider et exécuter le plan |
| **Hermes abort** | Annuler l'exécution en cours |
| **Hermes retry** | Réessayer après un échec |
| **Hermes review** | Review de code |
| **Hermes fix all** | Corriger tous les problèmes |
| **Hermes fix it** | Corriger un problème spécifique |

---

## L'anti-loop et la sécurité — les détails qui tuent

Deux protections sont en place pour éviter les abus :

### 1. Filtre par auteur (sécurité)

Avant toute chose, le worker webhook vérifie **qui** a envoyé l'événement. Si l'auteur (`sender.login`) n'est pas le propriétaire du repo, le message est ignoré silencieusement. Personne d'autre ne peut envoyer de commande à Hermes.

```python
if sender.login != "alshyra":
    return  # Ignorer, utilisateur non autorisé
```

### 2. Le tag anti-boucle

Quand Hermes Agent poste un commentaire, il ajoute ce tag en commentaire HTML :

```html
<!-- hermes -->
```

Le webhook gateway vérifie sa présence : si le commentaire entrant contient `<!-- hermes -->`, il est ignoré.

```python
if "<!-- hermes -->" in comment_body:
    return  # Ignorer, c'est notre propre commentaire
```

---

## De l'issue à la PR au déploiement

Le workflow complet pour une correction de bug :

1. Un utilisateur (ou moi) ouvre une issue GitHub
2. Le webhook déclenche Hermes Agent
3. Hermes lit l'issue avec `gh issue view`, comprend le contexte
4. Il poste un plan : *"Je propose de modifier le fichier X pour corriger Y, puis d'ouvrir une PR"*
5. Je commente `Hermes approve`
6. Hermes exécute : branche, commit, push, ouvre une PR, merge
7. Le push sur `main` déclenche GitHub Actions
8. Le CI rsync les fichiers vers le VPS
9. `docker compose up -d` redéploie les services concernés

Tout ça sans que j'aie à ouvrir un terminal.

---

## L'infrastructure derrière

Tout tourne sur un petit VPS OVH :

| Service | Rôle |
|---------|------|
| **Hermes Agent** | Agent IA principal (systemd, standalone) |
| **Hermes WebUI** | Interface web (Docker, in-process) |
| **Traefik** | Reverse proxy, SSL Let's Encrypt |
| **OpenCode** | Webhook gateway secondaire (port 4097) |
| **Docker Compose** | Conteneurisation des services |

Les webhooks arrivent directement sur le VPS — pas de tunnel, pas de service externe. Le VPS expose les ports 80/443, Traefik fait le routage.

---

## Pourquoi j'aime ce setup

- **Pas de dépendance SaaS** — tout tourne sur mon matos (ou presque : GitHub héberge le code, OVH le VPS)
- **Déclaratif** — la config tient dans quelques lignes YAML
- **Extensible** — ajouter un nouveau repo ou une nouvelle commande prend 30 secondes
- **Anti-fragile** — l'anti-loop empêche les délires, le timeout évite les runs infinis

---

## Et ensuite ?

Ce workflow est encore jeune. Les prochaines améliorations que je veux explorer :

- **PR review automatique** déclenchée sur `opened` pull_request
- **Dépendances entre tâches** — merges conditionnels, approbations en séquence
- **Intégration WhatsApp** — approuver un plan depuis son téléphone

Le code source d'Hermes Agent est ouvert : [github.com/nousresearch/hermes](https://github.com/nousresearch/hermes). Le workflow complet avec le prompt, la configuration webhook et le système de second brain est disponible dans le dépôt [github.com/alshyra/hermes-github-agent](https://github.com/alshyra/hermes-github-agent) — prêt à l'emploi.

---

*Tu veux mettre en place un workflow similaire ? Ouvre une discussion, je peux détailler la config précise.*
