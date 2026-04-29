-- Auth Helper Functions
-- This file creates utility functions for checking admin status and managing user roles

-- Function to check if current user is an admin
-- Returns true if the user has is_admin = true in their raw_user_meta_data
create or replace function auth.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 
    from auth.users 
    where id = auth.uid() 
    and (raw_user_meta_data->>'is_admin')::boolean = true
  );
$$;

-- Function to check if current user is admin (returns bool, can be used in RLS)
-- Deprecated: Use auth.is_admin() instead
create or replace function public.is_admin_user()
returns boolean
language plpgsql
security definer
stable
as $$
begin
  return auth.is_admin();
end;
$$;

-- Grant execute permissions
grant execute on function auth.is_admin() to authenticated;
grant execute on function auth.is_admin() to anon;
grant execute on function public.is_admin_user() to authenticated;
grant execute on function public.is_admin_user() to anon;
