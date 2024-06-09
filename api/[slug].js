// api/[slug].js
module.exports = (req, res) => {
  const { slug = "" } = req.query;
  res.redirect(`/pages/${slug}.html`);
};