import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pxytwvgrvlaycdnljjht.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eXR3dmdydmxheWNkbmxqamh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDUyOTMsImV4cCI6MjA5NDc4MTI5M30.Rz4I6DNZ9PY86DMFbIIDRhBMebCQ8kIuq-lj0Nli5ag";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
