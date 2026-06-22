import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output by default — every page is pre-rendered to crawlable HTML.
export default defineConfig({
  site: 'https://homynex.com',
  integrations: [sitemap()],
  build: { format: 'directory' }, // clean URLs: /how-it-works/ not /how-it-works.html
});
