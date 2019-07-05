import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

class ImageChooser extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chosenURL: ''
    }
    this.ReactSwal = withReactContent(Swal);
  }

  componentDidMount() {
    let images = [
      'https://minio.codingblocks.com/amoeba/2b8a22b9-f710-4a8d-b125-9cfa37c7f7fa.androidOnlinepng',
      'https://minio.codingblocks.com/amoeba/380cdffe-dc31-4e3e-bd5a-b5603b8ea873.competitiveProgrammingpng',
      'https://minio.codingblocks.com/amoeba/48704a87-4a16-4930-bc30-b8aae630fb90.SampleCoursepng',
      'https://minio.codingblocks.com/amoeba/7e87096d-aee9-4787-a1de-ddd0ed3e67fd.javapreviewpng',
      'https://minio.codingblocks.com/amoeba/ab386c20-4fcb-4720-bbc4-ce33829bcf7e.svg',
      'https://app.codingblocks.com/images/noShadowLogo.png',
      'https://minio.codingblocks.com/amoeba/aecc8ce8-77f6-4178-a47a-eb72c8746daa.mljpg',
      'https://minio.codingblocks.com/amoeba/c896bde5-e629-461d-877c-243d9a44cf15.compprog2png'
    ];
    this.setState({
      images
    });
  }

  /**
   * Choose Image Dialog
   */
  chooseImage = () => {

    let images = this.state.images.map((url) => {
      return (
        <img 
          src={url}
          width={100}
          onClick={() => {
            this.chooseImageURL(url)
          }}
        />
      );
    });

    const dialogHTML = (
      <div>
        <h3>Choose an Image</h3>
        {images}
      </div>
    );

    this.ReactSwal.fire({
      html: dialogHTML,
      showConfirmButton: false,
      showCloseButton: true
    });

  }
  
  /**
   * Set the image url in the state.
   * @param {string} url – Image URL
   */
  chooseImageURL = (url) => {
    this.props.callback(url);
    this.ReactSwal.close();
  }

  render() {
    return (
      <div>
        <div 
          className={"button-solid col-md-4 d-flex justify-content-center"}
          onClick={this.chooseImage}
        >
          Choose Image
        </div>
      </div>
    )
  }
  
}

export default ImageChooser;