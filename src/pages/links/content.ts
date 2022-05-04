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

links.push( toLink(
  'Frank Chimero',
  'https://frankchimero.com/',
  'Blog', 'Tech'
) );

links.push( toLink(
  '~javier',
  'https://tilde.club/~javier/',
  'Art'
) );

links.push( toLink(
  'tilde.club',
  'http://tilde.club/',
  'Blog', 'Tech'
) );

links.push( toLink(
  'Samuel Brzeski',
  'https://samuelbrzeski.com/',
  'Art', 'Tech'
) );

links.push( toLink(
  'Internet Walks',
  'https://internetwalks.com',
  'Art'
) );

links.push( toLink(
  'HTML Quine',
  'https://secretgeek.github.io/html_wysiwyg/html.html',
  'Tech', 'Art'
) );

links.push( toLink(
  'UbuWeb',
  'https://ubu.com/',
  'Art', 'Politics'
) );

links.push( toLink(
  '~palmdrop',
  'https://tilde.town/~palmdrop',
  'Blog'
) );

links.push( toLink(
  'A Softer World',
  'https://www.asofterworld.com/',
  'Art'
) );

links.push( toLink(
  'Hypercard Simulator',
  'https://hypercardsimulator.com',
  'Tech', 'Other'
) );

links.push( toLink(
  'Feral File',
  'https://feralfile.com',
  'Art'
) );

links.push( toLink(
  'The Mother of All Demos',
  'https://www.youtube.com/watch?v=yJDv-zdhzMY',
  'Tech'
) );

links.push( toLink(
  'Cyberpunk Prophecies',
  'https://tilde.town/~vilmibm/cbprop.pdf',
  'Art'
) );

links.push( toLink(
  'Ayatgali Tuleubek',
  'https://www.ayatgali.com/',
  'Art'
) );
links.push( toLink(
  'Romain Fontaine',
  'https://www.romain-fontaine.com/',
  'Art', 'Tech'
) );

links.push( toLink(
  'Tante',
  'https://tante.cc/category/writing/english/',
  'Blog', 'Tech'
) );

links.push( toLink(
  'TWOMUCH',
  'https://twomuch.studio/',
  'Tech', 'Art'
) );

links.push( toLink(
  'Revision.io',
  'https://revision.io/',
  'Tech'
) );

links.push( toLink(
  'Low-tech magazine',
  'https://solar.lowtechmagazine.com/',
  'Tech'
) );

links.push( toLink(
  'booktwo',
  'https://booktwo.org/',
  'Blog', 'Tech', 'Art'
) );

links.push( toLink(
  'Stephan Tillmans',
  'https://www.stephantillmans.com/',
  'Art'
) );

links.push( toLink(
  'Most Dismal Swamp',
  'https://www.mostdismalswamp.com',
  'Art'
) );

links.push( toLink(
  'Still here',
  'https://still-here.net/',
  'Art'
) );

links.push( toLink(
  'Folder One',
  'https://folder-one.eu/',
  'Art', 'Tech'
) );

links.push( toLink(
  'Analfapedia',
  'https://analfapedia.org',
  'Tech', 'Art'
) );

links.push( toLink(
  'Will Baker',
  'https://willbaker.info/',
  'Blog', 'Art'
) );

links.push( toLink(
  'A Million Years of Sleep',
  'https://amillionyearsofsleep.com/',
  'Art', 'Blog'
) );

links.push( toLink(
  'Consume Digest Produce',
  'https://consumedigestproduce.us/',
  'Tech', 'Other'
) );

links.push( toLink(
  'Abolish Alienation',
  'https://www.are.na/darbee-hagerty/abolish-alienation',
  'Blog', 'Art'
) );

links.push( toLink(
  'Fletcher Bach',
  'https://fletcherbach.com/',
  'Blog', 'Art', 'Tech'
) );

links.push( toLink(
  'Out4Pizza',
  'https://www.out4pizza.com/',
  'Art'
) );

links.push( toLink(
  'The Art of Fiction - Don DeLillo',
  'https://www.theparisreview.org/interviews/1887/the-art-of-fiction-no-135-don-delillo?fbclid=IwAR2J4PD2lRgCgvAUU9dv_8phhhZt1RRPKZu_SOnKIxXBai2LljwBwTfNRnk',
  'Art'
) );

links.push( toLink(
  'xxiivv webring',
  'https://webring.xxiivv.com/',
  'Blog', 'Tech'
) );

