import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Verify password request received');
    
    const { password } = await req.json();
    
    if (!password) {
      console.error('No password provided');
      return new Response(
        JSON.stringify({ valid: false }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ valid: false }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Failed to get user:', userError);
      return new Response(
        JSON.stringify({ valid: false }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying password for user: ${user.id}`);
    
    // Verify the password
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password
    });
    
    // Generic response with fixed delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const isValid = !error;
    console.log(`Password verification result: ${isValid ? 'valid' : 'invalid'}`);
    
    return new Response(
      JSON.stringify({ valid: isValid }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in verify-password function:', error);
    
    // Generic error response with fixed delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return new Response(
      JSON.stringify({ valid: false }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
