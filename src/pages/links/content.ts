export const categories = [
  'Art',
  'Blog',
  'Tech',
  'Politics',
  'Other'
] as const;

export type Category = typeof categories[ number ];

export type Link = {
  text : string,
  url : string,
  category : Category,
  additionalCategories? : Category[]
}

const toLink = ( text : string, url : string, category : Category, ...additionalCategories : Category[] ) => {
  return {
    text,
    url,
    category,
    additionalCategories
  }
}

// TODO read this from json file
// TOOD create script for me to easily add entries
// TODO possibly admin interface on site
export const links : Link[] = [
  toLink(
    'Underground Flower',
    'http://undergroundflower.com/',
    'Art'
  ),
  toLink(
    'Sofia Crespo',
    'https://sofiacrespo.com/',
    'Art'
  ),
  toLink(
    'Ivan Seal',
    'http://ivanseal.com/',
    'Art',
  ),
  toLink(
    'Crosslucid',
    'https://linktr.ee/crosslucid',
    'Art',
  ),
  toLink(
    'Butt Studio',
    'http://www.butt-studio.com/',
    'Art',
  ),
  toLink(
    'Brutalism',
    'https://brutalism.rs/',
    'Art', 'Tech'
  ),
  toLink(
    'Broadcast',
    'https://pioneerworks.org/broadcast/',
    'Blog'
  ),
  toLink(
    'Ciphrd',
    'https://ciphrd.com/',
    'Blog', 'Art'
  ),
  toLink(
    'Harm.work',
    'https://harm.work/',
    'Blog', 'Art'
  ),
  toLink(
    'Fuse',
    'https://fuse.blog/',
    'Blog', 'Art'
  ),
  toLink(
    'Hackernews',
    'https://hckrnews.com',
    'Tech', 'Blog'
  ),
  toLink(
    'Memex Marginalia',
    'https://memex.marginalia.nu/',
    'Blog', 'Tech'
  ),
  toLink(
    'Search Marginalia',
    'https://search.marginalia.nu/',
    'Other' 
  ),
  toLink(
    'K-punk',
    'http://k-punk.abstractdynamics.org/',
    'Blog', 'Politics'
  ),
];

