+---------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                    |
|  [ PWA / Mobile-First React SPA ] (Vite + Vercel Edge Network)                 |
|         │                                 │                                     |
|         │ (HTTP REST / RPC)               │ (WebSocket Connection)              |
|         ▼                                 ▼                                     |
+---------------------------------------------------------------------------------+
|                               SERVERLESS LAYER                                  |
|                 [ Supabase API Gateway (PostgREST) ]                            |
+---------------------------------------------------------------------------------+
|                                 DATA LAYER                                      |
|  [ PostgreSQL ] ── (RLS Polices) ── [ Realtime Engine ] ── [ Storage Buckets ]  |
+---------------------------------------------------------------------------------+