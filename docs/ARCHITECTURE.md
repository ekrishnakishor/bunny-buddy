┌───────────────────────────────┐
                       │      Guest User (Visitor)     │
                       └───────────────┬───────────────┘
                                       │ Select Locality (Zustand UI Only)
                                       ▼
                       ┌───────────────────────────────┐
                       │ Read-Only Hyperlocal Content  │
                       └───────────────────────────────┘
                                       │
                    Trigger Interactive Action (e.g., Reply to Help Request)
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │     Authentication Shield     │
                       └───────────────┬───────────────┘
                                       │
               ┌───────────────────────┴───────────────────────┐
               ▼                                               ▼
   [ Option A: Email OTP ]                         [ Option B: Google OAuth ]
  1. Input Email Address                          1. Redirect to Provider
  2. Receive Secure Token                         2. User Authenticates
  3. Enter 6-Digit Token                          3. Return Signed Cryptographic Token
               │                                               │
               └───────────────────────┬───────────────────────┘
                                       │ Validated by Supabase Auth
                                       ▼
                       ┌───────────────────────────────┐
                       │ Trigger: handle_new_user_    │
                       │          signup()             │
                       └───────────────┬───────────────┘
                                       │ Auto-generates Profile Entry
                                       ▼
                       ┌───────────────────────────────┐
                       │  Session Broadcast to Client  │
                       └───────────────────────────────┘
                                       │ TanStack Query syncs cache
                                       ▼
                       ┌───────────────────────────────┐
                       │ Full Access (Member/Helper)   │
                       └───────────────────────────────┘