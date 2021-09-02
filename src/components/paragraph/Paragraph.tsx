import { ReactChild } from "react";

import './Paragraph.scss';

export enum ParagraphType {
  normal = "normal",
  bold = "bold"
};

type Props = {
  type? : ParagraphType,
  children : ReactChild | ReactChild[] | never[]
};

const Paragraph = ( { type = ParagraphType.normal, children } : Props ) : JSX.Element => {
  return (
    <p className={ `paragraph paragraph--${ type }` }>
      { children } 
    </p>
  )
}

export default Paragraph;
