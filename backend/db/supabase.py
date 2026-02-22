import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Just a warning for now, allowing structural tests to run before keys are supplied
    print("Warning: SUPABASE_URL or SUPABASE_KEY is missing in .env")

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not configured.")
    return create_client(SUPABASE_URL, SUPABASE_KEY)
