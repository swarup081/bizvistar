import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Replaces `supabase.auth.getUser()` in server actions.
 * It checks if the current logged-in user is an Admin.
 * If they are an Admin AND they have an 'impersonated_user_id' cookie,
 * it returns a mock user object with that ID, effectively granting them
 * access to that user's resources via the backend actions.
 */
export async function getAuthUserContext(supabaseServerClient) {
  const cookieStore = await cookies();
  
  // 1. Get the actual authenticated user
  const { data: { user }, error } = await supabaseServerClient.auth.getUser();
  if (error || !user) {
    return { data: { user: null }, error: error || new Error('Unauthorized') };
  }

  // 2. Check for impersonation cookie
  const impersonatedUserId = cookieStore.get('impersonated_user_id')?.value;
  
  if (impersonatedUserId) {
    // Verify the actual user is an admin before allowing impersonation
    const { data: adminRecord } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();

    if (adminRecord) {
      // Return a spoofed user object that acts like the impersonated user
      // We only need the ID and Email for most actions to work.
      const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(impersonatedUserId);
      if (targetUser && targetUser.user) {
        return {
          data: { user: targetUser.user },
          error: null,
          isImpersonating: true,
          realUser: user
        };
      }
    }
  }

  // 3. Normal behavior
  return { data: { user }, error: null, isImpersonating: false };
}

