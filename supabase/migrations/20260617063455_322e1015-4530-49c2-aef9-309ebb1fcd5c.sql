REVOKE EXECUTE ON FUNCTION public.lookup_app_by_track_code(text) FROM PUBLIC, authenticated;
GRANT EXECUTE ON FUNCTION public.lookup_app_by_track_code(text) TO anon;