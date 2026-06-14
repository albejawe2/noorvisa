
REVOKE EXECUTE ON FUNCTION public.log_activity() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_track_code() FROM PUBLIC, anon, authenticated;
COMMENT ON FUNCTION public.lookup_app_by_track_code(text) IS
  'Intentionally public: lets clients track their visa application by code, returns only non-sensitive fields.';
