export default () => ({
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  github: {
    token: process.env.GITHUB_TOKEN,
  },
});
