import ExternalLink from "../../components/link/ExternalLink";
import HomeBar from "../../components/navigation/home/HomeBar";
import Paragraph from "../../components/paragraph/Paragraph";
import Title from "../../components/title/Title";

import './blogPage.scss';

const BlogPage = ( /* { } : PageProps */ ) : JSX.Element => {
  return (
    <div className='blog-page'>
      <div>
        <Title
          text="Work In Progress"
          level={ 3 }
        />
        <Paragraph>
          For this project, I do not intend to display a finished product -- I don't want to create a product at all. 
          This place will grow organically as my skills and interests grow and shift. 
        </Paragraph>
        <Paragraph>
          I have yet to build the blog section of this site. Please refer to my old (and unfortunately very inactive) blog: 
          <ExternalLink link="https://palmdrop.github.io/">
            { " palmdrop.github.io " }
          </ExternalLink>
        </Paragraph>
      </div>

      <aside className="blog-page__aside" >
        <HomeBar />
      </aside>
    </div>
  )
}

export default BlogPage;
