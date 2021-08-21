import { ReactChild } from "react";

import './Paragraph.scss';

type Props = {
  children : ReactChild | ReactChild[] | never[]
};

const Paragraph = ( { children } : Props ) : JSX.Element => {
  return (
    <p className="paragraph">
      { children } 
    </p>
  )
}

export default Paragraph;
