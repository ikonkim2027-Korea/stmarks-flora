# Tiny Worlds Collectibles

A Next.js field guide for plants documented within 1km of St. Mark's School in Southborough, Massachusetts. The app is designed for student field observation, ethical specimen collection, printable guide generation, and quick seasonal discovery.

## What It Includes

- 65 plant profiles with habitats, collection windows, identification tips, sources, and images.
- Search across names, taxonomy, habitat, descriptions, identification traits, and curated discovery keywords.
- Collection policy labels so sensitive plants can be shown as photograph-only instead of collectible.
- Calendar, habitat, map, plant detail, and printable field guide views.
- PWA manifest, service worker registration, and local app icons.

## Development

```bash
npm install
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) by default. Next.js may choose another port if 3000 is already occupied.

## Verification

```bash
npm test
npm run lint
npm run build
npm audit --audit-level=moderate
```

The data integrity tests check duplicate IDs, valid collection windows, source URL shape, search relevance, and photograph-only handling for protected or sensitive species.

## Data Notes

Plant information is source-attributed in `src/data/plants.ts`. Collection guidance is educational and should be checked against school rules, landowner permission, and Massachusetts conservation restrictions before any real specimen collection.
