console.log("Supabase URL:", window.APP_CONFIG.SUPABASE_URL);
console.log("Supabase Anon Key:", window.APP_CONFIG.SUPABASE_ANON_KEY);

const supabaseUrl = window.APP_CONFIG.SUPABASE_URL;
const supabaseAnonKey = window.APP_CONFIG.SUPABASE_ANON_KEY;

// Initialize the Supabase client
try {
  window.supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Error initializing Supabase client:", error);
}

console.log("supabase.js loaded");
