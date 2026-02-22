import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
client: Client = create_client(supabase_url, supabase_key)

response = client.table("articles").select("title, credibility_score, ai_reasoning, published_at, created_at").order("created_at", desc=True).limit(5).execute()
print("Top 5 latest articles by created_at:")
for r in response.data:
    print(r)
