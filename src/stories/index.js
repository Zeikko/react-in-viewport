import React, { PureComponent } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import handleViewport from '../index';

import AspectRatio from 'react-aspect-ratio';
import 'react-aspect-ratio/aspect-ratio.css';
import '../../theme.css';
const DUMMY_IMAGE_SRC = 'https://www.gstatic.com/psa/static/1.gif';

const PageTitle = () => (
  <div className='page__title'>
    <h1 className='page__title-main'>
      React in viewport
      <a
        className='github mui-icon'
        href='https://github.com/roderickhsiao/react-in-viewport'
        target='_blank'
        rel='noopener noreferrer'
      />
    </h1>
    <p className='page__title-desc'>
      Check if element is in viewport using Intersection Observer
    </p>
  </div>
);

const Card = ({ titleText, contentNode, innerRef }) => (
  <div className='card' ref={innerRef}>
    <div className='card__head'>
      <h3 className='card__title'>{titleText}</h3>
    </div>
    <div className='card__conent'>
      {contentNode}
    </div>
  </div>
);

const Block = props => {
  const { inViewport, innerRef, className } = props;
  const color = inViewport ? '#217ac0' : '#ff9800';
  const text = inViewport ? 'In viewport' : 'Not in viewport';
  action('Is in viewport')(inViewport);

  return (
    <Card
      className={'viewport-block'}
      titleText={text}
      innerRef={innerRef}
      contentNode={
        <div style={{ width: '400px', height: '300px', background: color }} />
      }
    />
  );
};
const ViewportBlock = handleViewport(Block);

const Iframe = ({ innerRef, src, ratio, inViewport }) => {
  const Component = inViewport ? 'iframe' : 'div';
  const props = inViewport
    ? {
        src,
        frameBorder: 0
      }
    : {};
  return (
    <AspectRatio
      ref={innerRef}
      ratio={ratio}
      style={{ marginBottom: '20px', backgroundColor: 'rgba(0,0,0,.12)' }}
    >
      <Component {...props} />
    </AspectRatio>
  );
};
const LazyIframe = handleViewport(Iframe);
class Image extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      src: DUMMY_IMAGE_SRC
    };
  }

  componentDidMount() {
    if (this.props.inViewport) {
      this.setState({
        src: this.props.src
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inViewport) {
      // prefetch image
      const image = new Image();
      image.src = nextProps.src;
      action('Load image')(nextProps.src);
      this.setState({
        src: nextProps.src
      });
    }
  }

  render() {
    return (
      <AspectRatio
        ratio={this.props.ratio}
        style={{ maxWidth: '400px', marginBottom: '20px', backgroundColor: 'rgba(0,0,0,.12)' }}
        ref={this.props.innerRef}
      >
        <img src={this.state.src} />
      </AspectRatio>
    );
  }
}

const LazyImage = handleViewport(Image);
storiesOf('Viewport detection', module)
  .add('Callback when in viewport', () => (
    <div>
      <PageTitle />
      <div style={{ height: '100vh', padding: '20px' }}>
        <p>Scroll down to make component in viewport 👇 </p>
      </div>
      <ViewportBlock className='card' />
    </div>
  ))
  .add('Lazyload Image', () => {
    const imageArray = [
      {
        src: 'https://i0.wp.com/peopledotcom.files.wordpress.com/2016/08/gettyimages-175928870.jpg',
        ratio: '595/397'
      },
      {
        src: 'https://s-media-cache-ak0.pinimg.com/originals/cf/31/83/cf31837a53dc1cdb13880ac38c66d70d.jpg',
        ratio: '508/397'
      },
      {
        src: 'http://cdn1-www.dogtime.com/assets/uploads/gallery/english-bulldog-puppies/english-bulldog-9.jpg',
        ratio: '1'
      }
    ];
    return (
      <div>
        <PageTitle />
        <Card
          titleText='Lazyload Image'
          contentNode={imageArray.map(image => (
            <LazyImage key={image.src} src={image.src} ratio={image.ratio} />
          ))}
        />
      </div>
    );
  })
  .add('Lazyload Iframe', () => {
    const iframeArray = [
      {
        src: 'https://www.youtube.com/embed/hTcBnxxuAls',
        ratio: '560/315'
      },
      {
        src: 'https://www.youtube.com/embed/M8AlxrwhY30',
        ratio: '560/315'
      },
      {
        src: 'https://www.youtube.com/embed/q31tGyBJhRY',
        ratio: '560/315'
      }
    ];
    return (
      <div>
        <PageTitle />
        <Card
          titleText='Lazyload Iframe'
          contentNode={iframeArray.map(iframe => (
            <LazyIframe key={iframe.src} src={iframe.src} ratio={iframe.ratio} />
          ))}
        />
      </div>
    );
  });
