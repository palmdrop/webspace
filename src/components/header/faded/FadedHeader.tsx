import Header from '../Header';


import './FadedHeader.scss';

type Props = {
  title : string,
  children? : React.ReactChild | React.ReactChild[] | never[]
}

const FadedHeader = ( { title, children } : Props ) : JSX.Element => {
  return (
    <div className="faded-header">
      <Header 
        mainTitle={ title }
        mainLevel={ 1 }
      >
        { children }
      </Header>
    </div>
  )
}

export default FadedHeader;