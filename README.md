# Sportz

Spor maçlarını ve canlı yorumlarını yönetmek için geliştirilmiş REST API ve WebSocket sunucusu.

## Özellikler

- Maç oluşturma, listeleme ve durumları yönetme
- Maçlar için canlı yorum ekleme
- WebSocket ile gerçek zamanlı bildirimler
- PostgreSQL veritabanı desteği
- Zod ile veri doğrulama

## Teknolojiler

- **Node.js** - Runtime environment
- **Express** - Web framework
- **WebSocket (ws)** - Gerçek zamanlı iletişim
- **Drizzle ORM** - Veritabanı yönetimi
- **PostgreSQL** - Veritabanı
- **Zod** - Şema doğrulama

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyası oluştur ve veritabanı bağlantısını ekle
# DATABASE_URL=postgresql://user:password@localhost:5432/sportz

# Veritabanı migration'larını çalıştır
npm run db:migrate
```

## Kullanım

```bash
# Geliştirme modunda çalıştır
npm run dev

# Production modunda çalıştır
npm start

# Drizzle Studio'yu aç
npm run db:studio
```

## API Endpoints

### Maçlar

**Maçları Listele**

```
GET /matches?limit=50
```

**Maç Oluştur**

```
POST /matches
Content-Type: application/json

{
  "sport": "football",
  "homeTeam": "Team A",
  "awayTeam": "Team B",
  "startTime": "2026-02-28T15:00:00Z",
  "endTime": "2026-02-28T17:00:00Z",
  "homeScore": 0,
  "awayScore": 0
}
```

### Yorumlar

**Yorumları Listele**

```
GET /matches/:id/commentary?limit=100
```

**Yorum Ekle**

```
POST /matches/:id/commentary
Content-Type: application/json

{
  "eventType": "goal",
  "message": "Gol!",
  "actor": "Player Name",
  "team": "Team A",
  "minutes": 45,
  "sequence": 1,
  "period": "first_half"
}
```

## WebSocket

WebSocket sunucusu `/ws` yolunda çalışır.

### Bağlanma

```
ws://localhost:8000/ws
```

### Mesaj Formatları

**Maça Abone Ol**

```json
{
  "type": "subscribe",
  "matchId": 1
}
```

**Abonelikten Çık**

```json
{
  "type": "unsubscribe",
  "matchId": 1
}
```

### Sunucu Mesajları

**Yeni Maç**

```json
{
  "type": "match_created",
  "data": { ... }
}
```

**Yeni Yorum**

```json
{
  "type": "commentary",
  "data": { ... }
}
```

## Veritabanı Şeması

### matches

- Maç bilgileri (takımlar, skor, durum, zamanlar)
- Durum: `scheduled`, `live`, `finished`

### commentary

- Maç yorumları ve olaylar
- Metadata ve etiket desteği
- Dakika, periyot ve sıralama bilgisi
