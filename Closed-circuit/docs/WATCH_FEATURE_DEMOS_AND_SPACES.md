# Watch Feature Demos & DigitalOcean Storage — Technical Documentation

**Project:** Closed Circuit (CC-App)  
**Last updated:** June 2026

---

## Table of Contents

1. [Video Player](#1-video-player)
2. [Video Upload Flow](#2-video-upload-flow)
3. [Video Management (Admin)](#3-video-management-admin)
4. [Public Usage](#4-public-usage)
5. [DigitalOcean Folder Structure](#5-digitalocean-folder-structure)
6. [Environment Variables](#6-environment-variables)
7. [API Reference](#7-api-reference)
8. [Migration Guide](#8-migration-guide)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Video Player

### What player is used?

Closed Circuit uses a **shared React wrapper around the native HTML5 `<video>` element** — not a third-party player library (no Video.js, Plyr, etc.).

| Item | Location |
|------|----------|
| Component | `frontend/src/components/MediaPlayer.jsx` |
| CDN URL helper | `frontend/src/lib/spaces.js` |

### Integration flow

```
Page (FlowVoice / Gifts / FeatureDemos)
    └── <MediaPlayer src={url} title={...} />
            └── Native <video controls autoPlay muted loop playsInline />
```

### Where MediaPlayer is used

| Page | Route | Video source |
|------|-------|--------------|
| Flow in Voice | `/flow-voice` | `getFlowVoiceVideoUrl()` from Spaces CDN |
| Families (Gifts) | `/gifts` | `getFamilyVideoUrl()` from Spaces CDN |
| Watch Feature Demos | `/feature-demos` | `videoUrl` from `demo_videos` table via API |

### Height enhancement

Player height was increased ~30% while keeping width, responsiveness, controls, and playback logic unchanged:

| Breakpoint | Before | After |
|------------|--------|-------|
| Mobile | `h-[320px]` | `h-[416px]` |
| Desktop (`md+`) | `h-[380px]` | `h-[494px]` |

### Usage example

```jsx
import MediaPlayer from '../components/MediaPlayer';
import { getFlowVoiceVideoUrl } from '../lib/spaces';

<MediaPlayer src={getFlowVoiceVideoUrl()} title="Flow in Voice" />
```

Props: `src`, `title`, `autoPlay`, `muted`, `loop`, `controls`, `playsInline`, `preload`, `className`.

---

## 2. Video Upload Flow

```
Admin Panel → Upload Video form
    ↓
POST /api/demo-videos/upload  (multipart: title + video_file)
    ↓
Multer (memory) → demoVideo.service.js
    ↓
spaces.service.js → uploadDemoVideo()
    ↓
DigitalOcean Spaces: {ROOT_FOLDER}/{VIDEO_FOLDER}/{unique-filename}
    ↓
demo_videos table INSERT (title, video_url, video_key, display_order)
    ↓
Public page loads via GET /api/public/demo-videos/
```

### Upload steps (admin)

1. Admin opens **Manage Demo Videos** (`/admin/demo-videos`)
2. Clicks **Upload Video**
3. Enters **Video Title** (required)
4. Selects video file — MP4, MOV, or WebM (required on create)
5. Upload progress bar shows transfer status
6. Backend validates MIME type and max file size (`DEMO_VIDEO_MAX_BYTES`)
7. File uploads to `Closed Circuit/demo-videos/` (configurable via `DO_SPACES_VIDEO_FOLDER`)
8. Public CDN URL is generated and saved to `demo_videos.video_url`
9. `display_order` auto-increments (`MAX(display_order) + 1`)

---

## 3. Video Management (Admin)

**Route:** `/admin/demo-videos`  
**Menu:** Admin Panel → Manage Demo Videos

### Features

| Feature | Description |
|---------|-------------|
| **Upload** | Title + file → Spaces + DB |
| **Edit** | Update title, display order, optionally replace video file |
| **Delete** | Removes DB record and Spaces object |
| **Reorder** | Set `display_order` on edit |
| **Search** | Filter by video title |
| **Pagination** | 10 per page |

### Listing columns

S.No, Video Title, Video Preview, Video URL, Display Order, Created Date, Actions (View / Edit / Delete)

---

## 4. Public Usage

**Route:** `/feature-demos`  
**Navigation:** Features → Watch Feature Demos

### How videos load

1. Page mounts → `GET /api/public/demo-videos/`
2. SQL: `SELECT id, title, video_url AS videoUrl FROM demo_videos ORDER BY display_order ASC, id ASC`
3. First video is auto-selected and plays in the right panel
4. Left panel lists all topics in display order (never shuffled)
5. Clicking a topic switches the video instantly (no page refresh)
6. Active topic is highlighted in the left menu

### How ordering works

- `display_order` column controls sequence (ascending)
- New uploads get the next available order number
- Admin can change order via Edit

### How to add new videos

1. Log in to admin panel
2. Go to **Manage Demo Videos**
3. Click **Upload Video**
4. Enter title, select file, upload
5. Video appears on `/feature-demos` automatically in order

---

## 5. DigitalOcean Folder Structure

### Old structure (duplicated folder — deprecated)

```
lara/
└─ Closed Circuit/
    └─ Closed Circuit/          ← duplicate
        └─ clients/
            ├─ logos/
            └─ profile-pictures/
├─ flow_in_voice.mp4
└─ gifts_in_voice.mp4
```

### New structure

```
lara/
└─ Closed Circuit/
    ├─ demo-videos/
    │   ├─ demo1.mp4
    │   └─ demo2.mp4
    └─ clients/
        ├─ logos/
        └─ profile-pictures/
├─ flow_in_voice.mp4
└─ gifts_in_voice.mp4
```

### Object key examples

| Asset | Key |
|-------|-----|
| Client logo | `Closed Circuit/clients/logos/filename.jpg` |
| Demo video | `Closed Circuit/demo-videos/filename.mp4` |
| Flow video | `Closed Circuit/flow_in_voice.mp4` |
| Families video | `Closed Circuit/gifts_in_voice.mp4` |

---

## 6. Environment Variables

### Backend (`backend/.env`)

```env
DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_SPACES_ENDPOINT=https://blr1.digitaloceanspaces.com
DO_SPACES_REGION=blr1
DO_SPACES_BUCKET=lara

DO_SPACES_ROOT_FOLDER=Closed Circuit
DO_SPACES_CLIENT_FOLDER=clients
DO_SPACES_VIDEO_FOLDER=demo-videos
DO_SPACES_MEDIA_FOLDER=media
DO_SPACES_FLOW_FOLDER=flow
DO_SPACES_VOICE_FOLDER=voice
DO_SPACES_FAMILY_FOLDER=families
DO_SPACES_FLOW_VIDEO_FILE=flow_in_voice.mp4
DO_SPACES_FAMILY_VIDEO_FILE=gifts_in_voice.mp4

CLIENT_IMAGE_MAX_BYTES=5242880
DEMO_VIDEO_MAX_BYTES=209715200
```

### Frontend (`frontend/.env`) — optional overrides

```env
VITE_DO_SPACES_CDN_BASE=https://lara.blr1.cdn.digitaloceanspaces.com
VITE_DO_SPACES_BUCKET=lara
VITE_DO_SPACES_REGION=blr1
VITE_DO_SPACES_ROOT_FOLDER=Closed Circuit
VITE_DO_SPACES_FLOW_VIDEO_FILE=flow_in_voice.mp4
VITE_DO_SPACES_FAMILY_VIDEO_FILE=gifts_in_voice.mp4
```

> Folder names must not be hardcoded in application code. All paths are built from these variables in `spaces.service.js` (backend) and `spaces.js` (frontend).

---

## 7. API Reference

### Public

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | `/api/public/demo-videos/` | None | `[{ id, title, videoUrl }]` |

### Admin (Bearer token required)

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/demo-videos/upload` | `multipart: title`, `video_file` |
| GET | `/api/demo-videos` | Query: `page`, `limit`, `search` |
| GET | `/api/demo-videos/:id` | — |
| PUT | `/api/demo-videos/:id` | `multipart: title`, `display_order`, `video_file` (optional) |
| DELETE | `/api/demo-videos/:id` | — |

### Database: `demo_videos`

| Column | Type | Notes |
|--------|------|-------|
| id | INT UNSIGNED | Primary key |
| title | VARCHAR(255) | Required |
| video_url | VARCHAR(1024) | Public CDN URL |
| video_key | VARCHAR(512) | Spaces object key (for delete) |
| display_order | INT UNSIGNED | Sort order |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto |

---

## 8. Migration Guide

The migration utility fixes the duplicated `Closed Circuit/Closed Circuit/` folder path.

### Scripts

```bash
cd backend

# Preview changes (no writes)
npm run spaces:migrate:dry-run

# Execute migration
npm run spaces:migrate -- --execute

# Verify after migration
npm run spaces:migrate:verify

# Rollback (uses saved manifest)
npm run spaces:migrate -- --rollback
```

### Steps

#### Step 1 — Backup

1. Export a list of current Spaces objects from the DigitalOcean console
2. Back up the `clients` table: `mysqldump cc_db clients > clients_backup.sql`
3. Note current `client_logo_url` and `client_profile_pic_url` values

#### Step 2 — Move files

Migration copies all objects from:
- `Closed Circuit/Closed Circuit/*` → `Closed Circuit/*`

Then deletes the old copies.

#### Step 3 — Update stored URLs/paths

The migration script updates `clients.client_logo_key`, `client_logo_url`, `client_profile_pic_key`, and `client_profile_pic_url` to remove the duplicate path segment.

#### Step 4 — Validate

```bash
npm run spaces:migrate:verify
```

Check:
- Client images on `/clients` public page
- Flow in Voice video on `/flow-voice`
- Families video on `/gifts`
- Demo videos on `/feature-demos`

#### Step 5 — Rollback

If issues occur:

```bash
npm run spaces:migrate -- --rollback
```

Rollback manifest: `backend/scripts/.spaces-migration-manifest.json`

---

## 9. Troubleshooting

### Video not playing

| Check | Action |
|-------|--------|
| URL accessible? | Open `video_url` directly in browser |
| CORS / ACL | Object must have `public-read` ACL |
| Format | Confirm MP4/MOV/WebM |
| Browser codec | Try MP4 (H.264) for widest support |
| Mixed content | Ensure HTTPS CDN URL on HTTPS site |

### File upload failed

| Check | Action |
|-------|--------|
| File size | Must be under `DEMO_VIDEO_MAX_BYTES` (default 200 MB) |
| Format | Only `video/mp4`, `video/quicktime`, `video/webm` |
| Spaces credentials | Verify `DO_SPACES_KEY`, `DO_SPACES_SECRET`, endpoint |
| Server logs | Check `[spaces]` and `uploadDemoVideo` errors |

### Broken URL

| Check | Action |
|-------|--------|
| Path mismatch | Confirm `DO_SPACES_ROOT_FOLDER` matches bucket layout |
| Migration incomplete | Run `npm run spaces:migrate:verify` |
| DB vs Spaces | Compare `video_key` in DB with actual object key in Spaces |

### DigitalOcean permission issue

| Check | Action |
|-------|--------|
| API keys | Spaces key must have read/write/delete |
| Bucket name | `DO_SPACES_BUCKET` must match |
| Region | `DO_SPACES_REGION` must match bucket region |

### Database record missing

| Check | Action |
|-------|--------|
| Upload succeeded? | Check admin listing at `/admin/demo-videos` |
| Table exists? | Restart backend to run auto-migrations |
| Manual check | `SELECT * FROM demo_videos ORDER BY display_order ASC` |

### Client images broken after migration

1. Run rollback: `npm run spaces:migrate -- --rollback`
2. Verify `DO_SPACES_ROOT_FOLDER` is set once (not duplicated in code)
3. Re-run migration with `--dry-run` first
4. Inspect `client_logo_key` for duplicate `Closed Circuit` segments

---

## Module File Reference

| Layer | Files |
|-------|-------|
| Frontend player | `frontend/src/components/MediaPlayer.jsx` |
| Frontend demos page | `frontend/src/pages/FeatureDemos.jsx` |
| Frontend admin | `frontend/src/pages/admin/DemoVideoManagement.jsx` |
| Backend model | `backend/src/models/demoVideo.model.js` |
| Backend service | `backend/src/services/demoVideo.service.js` |
| Backend controller | `backend/src/controllers/demoVideo.controller.js` |
| Backend routes | `backend/src/routes/demoVideo.routes.js`, `publicDemoVideo.routes.js` |
| Spaces service | `backend/src/services/spaces.service.js` |
| Migration script | `backend/scripts/migrate-spaces-structure.js` |
| DB schema | `backend/src/config/schema.js` (`demo_videos` table) |
