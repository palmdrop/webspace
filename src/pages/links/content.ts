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
  additionalCategories ?: Category[]
}

const toLink = ( text : string, url : string, category : Category, ...additionalCategories : Category[] ) => {
  return {
    text,
    url,
    category,
    additionalCategories
  };
};

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
    'Stimulation Zone',
    'https://stimulation.zone/',
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
    'Hastelier',
    'https://hastelier.tumblr.com/',
    'Art'
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
    'Skumrask (swedish)',
    'https://fredrikedin.se',
    'Politics', 'Blog'
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

links.push( toLink(
  'Softer',
  'http://softerdigitalfutures.xyz',
  'Tech', 'Art', 'Blog'
) );
links.push( toLink(
  'Alice Maz',
  'https://www.alicemaz.com/',
  'Blog', 'Tech'
) );

links.push(toLink(
  'Frank Chimero',
  'https://frankchimero.com/',
  'Blog', 'Tech'
));

