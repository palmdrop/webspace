export type Piece = {
  name : string,
  description : string[],

  tags: string[],
  index: number,
}

export const pieces : Piece[] = [];

for( let i = 0; i < 10; i++ ) {
  pieces.push( {
    name: "Piece " + i,

    description: [
      "This is a short description of a digital 3d experiment, generative art or whatever, etc etc",
      (""+i).repeat( 30 )
    ],

    tags: [ i + " tag1", i + " tag2" ],
    index: i
  })
}

export const introduction = {
  title: "Pieces",
  description: [ 
    "a short description of what I do, the areas of work, artistic ideas, experience, interests,", 
    "what I've done before the purpose of this page, and so on" 
  ]
}