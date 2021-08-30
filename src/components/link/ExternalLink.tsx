import React from 'react'

type Props = {
  link : string,
  children : React.ReactChild | React.ReactChild[] | never[]
};

const ExternalLink = ( { link, children } : Props ) : JSX.Element => {
  return (
    <a
      href={ link }
      target="_blank"
      rel="noreferrer"
    >
      { children }
    </a>
  )
}

export default ExternalLink;