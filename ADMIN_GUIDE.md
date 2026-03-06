# 🏔️ OutdoorBalkans - Admin Priručnik

## 🔑 Podešavanje API Ključeva

### Anthropic AI API

1. Idi na https://console.anthropic.com/settings/keys
2. Kreiraj novi API ključ
3. Kopiraj ključ koji počinje sa `sk-ant-api03-...`
4. Dodaj u `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-tvoj-kljuc-ovdje
```

### Validni Anthropic Modeli

- ✅ `claude-3-5-sonnet-20241022` (KORISTI SE - najbolji odnos kvalitet/cijena)
- ✅ `claude-3-5-haiku-20241022` (brži, jeftiniji)
- ✅ `claude-3-opus-20240229` (najjači, ali skuplji)

❌ **NE KORISTI**: `claude-opus-4-5` - ovaj model ne postoji!

---

## 🚀 Admin Panel Funkcije

### 1. Dodavanje Pojedinačne Lokacije

1. Otvori tab **"✨ Dodaj + AI"**
2. Upiši naziv lokacije (npr. "Uvac Kanjon")
3. Odaberi kategoriju i državu
4. Kopiraj GPS koordinate sa Google Maps (desni klik → kopiraj)
5. Klikni **"✨ AI Generiši"** - popunjava automatski:
   - Kratki opis
   - Detaljan opis
   - SEO meta tagove
   - Sezonu
   - Info o dozvolama
6. Klikni **"💾 Sačuvaj Lokaciju"**

### 2. CSV Import (za masovno dodavanje)

1. Otvori tab **"📥 CSV Import"**
2. Klikni **"⬇️ Preuzmi Template"**
3. Popuni Excel tabelu sa lokacijama
4. Sačuvaj kao CSV (`;` separator)
5. Klikni **"📂 Učitaj CSV"**
6. Pregledaj preview
7. Klikni **"🚀 Importuj"**

**NAPOMENA:** CSV import trenutno NE pokreće AI automatski. Potrebno je ručno kliknuti AI za svaku lokaciju.

### 3. Uređivanje Postojećih Lokacija

1. Otvori tab **"📋 Lokacije"**
2. Klikni **"✏️ Uredi"** pored lokacije
3. Izmijeni podatke
4. Opciono: Klikni **"✨ AI Regenerisi"** za nove AI podatke
5. Klikni **"💾 Sačuvaj izmene"**

### 4. Pregled Predloga Korisnika

1. Otvori tab **"🔔 Predlozi"**
2. Pregledaj predloge sa sajta
3. Klikni **"⚡ Pokreni AI"** za generisanje sadržaja
4. Klikni **"✓ Odobri i objavi"** ili **"✕ Odbij"**

---

## 🤖 AI Generisanje Sadržaja

AI automatski generiše:
- ✅ Kratki opis (max 180 znakova)
- ✅ Detaljan opis (3-5 rečenica)
- ✅ SEO meta title (max 60 znakova)
- ✅ SEO meta description (max 155 znakova)
- ✅ Preporučena sezona
- ✅ Informacije o dozvolama
- ✅ Kategoriju-specifični podaci (dubina, vrste ribe, težina staze, itd.)

**Cijena:** ~$0.003 po lokaciji (Claude Sonnet 3.5)

---

## 🐛 Česti Problemi

### "401 Unauthorized" greška

**Uzrok:** Pogrešan ili nepostojeći API ključ  
**Rješenje:**
1. Provjeri da li je `ANTHROPIC_API_KEY` postavljen u `.env.local`
2. Restartuj Next.js dev server: `npm run dev`
3. Provjeri da ključ nije istekao na Anthropic dashboard-u

### "Invalid model" greška

**Uzrok:** Koristi se nepostojeći model  
**Rješenje:** Provjeri da u `app/api/ai-generate/route.ts` stoji `claude-3-5-sonnet-20241022`

### Lokacije nemaju fotografije

**Status:** U razvoju 🚧  
**Planirano:** Integracija sa Unsplash/Pexels API ili upload sistema

---

## 📊 Performance

- **Dodavanje 1 lokacije sa AI:** ~2-3 sekunde
- **CSV import 50 lokacija:** ~5 sekundi (bez AI)
- **AI bulk generate 50 lokacija:** ~3-5 minuta (60-100 lokacija/minut)

---

## 🔒 Sigurnost

- Admin pristup je ograničen na `ADMIN_EMAILS` iz `.env.local`
- API routes koriste `requireAdmin()` middleware
- Supabase RLS pravila sprečavaju neautorizovan pristup

---

## 📧 Kontakt

Za tehničku podršku kontaktiraj development tim.
