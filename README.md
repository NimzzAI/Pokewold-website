# PokéWorld Adventure 🎮⚔️

**PokéWorld Adventure** adalah game RPG Pokémon klasik 8-bit yang berjalan langsung di peramban web (browser). Dikembangkan dengan **React + Vite (JavaScript)**, HTML5 Canvas 2D Tile Engine (60 FPS pixel-perfect), Web Audio API Synthesizer, serta data Pokémon resmi dari **PokeAPI**.

Website ini langsung menampilkan **dunia petualangan RPG tile-based yang dapat dimainkan sepenuhnya** — bukan mockup, dashboard modern, ataupun sekadar ensiklopedia.

---

## 🌟 Fitur Utama Permainan

### 1. Dunia RPG Tile-Based & Eksplorasi Penuh
- **Sistem Grid & Deteksi Tabrakan (Collision Detection)**: Karakter pemain tidak dapat menembus pohon, tebing batu, air, dinding bangunan, pagar, maupun NPC.
- **Transisi Peta & Pintu (Warps/Doors)**: Masuk dan keluar ruangan/bangunan secara mulus dengan transisi pintu.
- **Peta Petualangan Lengkap**:
  1. **Oakvale Town (Starter Town)**: Rumah Pemain, Laboratorium Prof. Oak, Pokémon Center, Poké Mart, Papan Tanda, & NPC warga.
  2. **Route 1**: Jalur semak rumput tinggi dengan Pokémon liar dan Pelatih *Youngster Joey*.
  3. **Emerald Forest**: Hutan lebat berliku dengan Pokémon serangga (Caterpie, Weedle) dan kemungkinan langka bertemu *Pikachu*.
  4. **Rockfall Cave**: Gua batu gelap atmosferik dengan Pokémon liar Zubat & Geodude serta Pelatih *Hiker Dwayne*.
  5. **Oakhaven City (Second Town)**: Kota tujuan dengan Pokémon Center, Poké Mart, dan **Oakhaven Gym**.
  6. **Interiors**: Interior Rumah Red, Lab Prof. Oak, Pokémon Center, Poké Mart, dan Arena Gym.

### 2. Pilihan Starter Pokémon
- Di Lab Prof. Oak, pemain dapat memilih salah satu dari 3 Pokémon Pemula legendaris:
  - 🌿 **Bulbasaur** (Grass / Poison)
  - 🔥 **Charmander** (Fire)
  - 💧 **Squirtle** (Water)
- Starter bergabung ke dalam Tim (*Party*) dengan statistik dinamis dan jurus bawaan.

### 3. Sistem Pertarungan Turn-Based Klasik (Battle Screen)
- Tampilan pertarungan RPG genggam klasik (Lawan di kiri-atas, Pemain di kanan-bawah).
- Pilihan Aksi:
  - **FIGHT**: Membuka 4 jurus dengan tipe elemen, power, dan akurasi.
  - **BAG**: Menggunakan Potion untuk menyembuhkan HP, atau melempar Poké Ball untuk menangkap Pokémon liar!
  - **POKÉMON**: Mengganti anggota tim aktif.
  - **RUN**: Melarikan diri dari pertarungan liar.
- **Formula Kerusakan Otentik**: Menghitung Attack vs Defense, STAB (Same-Type Attack Bonus 1.5x), Efektivitas Tipe (*Super Effective*, *Not Very Effective*, *Immune*), Critical Hit, dan variasi acak.
- **Sistem EXP & Naik Level**: Memenangkan pertarungan memberikan EXP, meningkatkan level, dan menaikkan HP serta status Pokémon!

### 4. Tantangan Gym & Lencana (Boulder Badge)
- Tantang **Gym Leader Brock** di Oakhaven Gym yang memiliki tim Pokémon tipe Batu tangguh (Geodude & Onix).
- Kalahkan Brock untuk meraih **Boulder Badge**, hadiah uang, dan menyelesaikan misi utama!

### 5. Fasilitas Kota: Pokémon Center & Poké Mart
- **Pokémon Center**: Suster Joy memulihkan seluruh HP tim Pokémon secara gratis dengan jingle pemulihan 6-nada khas.
- **Poké Mart**: Beli Poké Ball, Potion, Super Potion, dan Antidote menggunakan uang hasil pertarungan.

### 6. Kontrol Lengkap (Desktop & Mobile Touch)
- **Desktop**: Tombol Panah atau WASD untuk bergerak, Enter/Spasi untuk bicara/interaksi, M/Escape untuk membuka menu.
- **HP / Layar Sentuh**: D-Pad Virtual 4-arah (▲ ◀ ● ▶), Tombol A (Aksi), Tombol B (Batal), dan Tombol START (Menu).

### 7. Sistem Penyimpanan (Save System)
- Progres tersimpan secara persisten di peramban via `localStorage` (posisi, tim Pokémon, inventaris tas, uang, lencana, status misi, dan pelatih yang dikalahkan).
- Menu in-game menyediakan opsi **Simpan Game** kapan saja serta tombol reset game baru.

---

## 🛠️ Stack Teknologi

- **Framework**: React 19 + Vite (JavaScript / JSX)
- **Grafis & Renderer**: HTML5 Canvas 2D Tile Engine (Image Smoothing Disabled / Crisp Pixel Rendering)
- **Styling**: Tailwind CSS Modern + Custom Retro RPG Borders & Pixel Font (Press Start 2P)
- **Audio Synthesizer**: Web Audio API Sound Generator (Efek suara retro 8-bit tanpa file audio eksternal)
- **Data Source**: [PokeAPI (v2)](https://pokeapi.co/) + Caching & Fallback Library Mandiri
- **Penyimpanan**: Browser `localStorage`
- **Deployment**: Vercel Ready (dengan `vercel.json` SPA rewrite)

---

## 📁 Struktur Direktori

```text
├── index.html                  # HTML entry point (Font Press Start 2P & pixel-art)
├── metadata.json               # Metadata AI Studio
├── package.json                # Dependensi proyek
├── vercel.json                 # Konfigurasi SPA rewrite untuk Vercel
├── README.md                   # Dokumentasi proyek
└── src/
    ├── main.jsx                # Entry file React
    ├── App.jsx                 # Routing (/game, /pokedex, /about)
    ├── index.css               # Styling global & kelas RPG retro
    ├── components/
    │   ├── Navbar.jsx          # Bar navigasi retro minimalis
    │   └── TypeBadge.jsx       # Badge tipe Pokémon berwarna
    ├── game/
    │   ├── GameEngine.jsx      # Game loop utama (pergerakan, interaksi, status)
    │   ├── WorldCanvas.jsx     # Canvas 2D tile renderer (peta, bangunan, sprite pemain & NPC)
    │   ├── BattleScreen.jsx    # Layar pertarungan turn-based handheld RPG
    │   ├── DialogueBox.jsx     # Kotak teks percakapan RPG
    │   ├── StarterSelectModal.jsx # Modal pemilihan starter Pokémon
    │   ├── ShopModal.jsx       # Toko Poké Mart
    │   ├── GameMenu.jsx        # Menu jeda / pause (Party, Bag, Trainer Card, Save)
    │   ├── TouchControls.jsx   # Kontrol D-Pad sentuh virtual untuk smartphone
    │   ├── soundEffects.js     # Web Audio API Synthesizer retro 8-bit
    │   ├── constants.js        # Definisi ubin, tabrakan, dan state awal
    │   └── maps/
    │       ├── index.js        # Registri seluruh peta permainan
    │       ├── starterTown.js  # Oakvale Town (Rumah, Lab, Mart, Center)
    │       ├── route1.js       # Route 1 (Semak liar & Youngster Joey)
    │       ├── forest.js       # Emerald Forest (Pikachu, Caterpie, Weedle)
    │       ├── cave.js         # Rockfall Cave (Zubat, Geodude, Hiker)
    │       ├── secondTown.js   # Oakhaven City (Gym, Mart, Center)
    │       └── interiors.js    # Interior rumah, lab, pokecenter, mart, gym
    ├── pages/
    │   ├── GamePage.jsx        # Halaman game utama (/game)
    │   ├── PokedexPage.jsx     # Halaman referensi data Pokédex (/pokedex)
    │   └── AboutPage.jsx       # Halaman panduan kontrol & disclaimer (/about)
    ├── services/
    │   └── pokeapi.js          # Layanan API PokeAPI + in-memory cache & fallback instan
    └── utils/
        └── typeChart.js        # Matriks 18 tipe Pokémon & efektivitas serangan
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js** (versi 18+) dan npm.

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Server Dev
```bash
npm run dev
```
Buka di peramban: `http://localhost:3000` (atau port yang tertera). Rute default `/` akan langsung memuat dunia game di `/game`!

### 4. Build untuk Produksi
```bash
npm run build
```

---

## ☁️ Deploy ke Vercel

Proyek ini telah siap di-deploy langsung ke **Vercel**:
1. Hubungkan repositori ke Vercel.
2. File `vercel.json` sudah menyediakan konfigurasi rewrite untuk Single Page Application (SPA).
3. Build command: `npm run build`
4. Output directory: `dist`
5. Aplikasi tidak membutuhkan database eksternal ataupun API key.

---

## ⚖️ Hak Cipta & Disclaimer (Fan Project)

> **Pemberitahuan**: Website ini adalah proyek non-komersial buatan penggemar (*fan-made project*) dan **tidak berafiliasi, disponsori, atau didukung oleh Nintendo, Game Freak, maupun The Pokémon Company**.
> Pokémon dan semua nama, gambar, serta aset karakter Pokémon adalah hak cipta dan merek dagang milik Nintendo, Game Freak, dan The Pokémon Company.
