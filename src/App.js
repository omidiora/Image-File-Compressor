import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import imageCompression from 'browser-image-compression';
import {Form , Container , Row , Col , Card , Alert , Badge} from 'react-bootstrap'; 

export default class App extends React.Component {
  constructor (...args) {
    super(...args)
    this.compressImage = this.compressImage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      maxSizeMB: 1,
      maxWidthOrHeight: 2024,
      webWorker: {
        progress: null,
        inputSize: null,
        outputSize: null,
        inputUrl: null,
        outputUrl: null
      },
      mainThread: {
        progress: null,
        inputSize: null,
        outputSize: null,
        inputUrl: null,
        outputUrl: null
      }
    }
  }

  handleChange (target) {
    return (e) => {
      this.setState({ [target]: e.currentTarget.value })
    }
  }

  onProgress (p, useWebWorker) {
    const targetName = useWebWorker ? 'webWorker' : 'mainThread'
    this.setState(prevState => ({
      ...prevState,
      [targetName]: {
        ...prevState[targetName],
        progress: p
      }
    }))
  }

  async compressImage (event, useWebWorker) {
    const file = event.target.files[0]
    console.log('input', file)
    console.log(
      'ExifOrientation',
      await imageCompression.getExifOrientation(file)
    )
    const targetName = useWebWorker ? 'webWorker' : 'mainThread'
    this.setState(prevState => ({
      ...prevState,
      [targetName]: {
        ...prevState[targetName],
        inputSize: (file.size / 1024 / 1024).toFixed(2),
        inputUrl: URL.createObjectURL(file)
      }
    }))
    var options = {
      maxSizeMB: this.state.maxSizeMB,
      maxWidthOrHeight: this.state.maxWidthOrHeight,
      useWebWorker,
      onProgress: p => this.onProgress(p, useWebWorker)
    }
    const output = await imageCompression(file, options)
    console.log('output', output)
    this.setState(prevState => ({
      ...prevState,
      [targetName]: {
        ...prevState[targetName],
        outputSize: (output.size / 1024 / 1024).toFixed(2),
        outputUrl: URL.createObjectURL(output)
      }
    }))
  }

  render () {
    const { webWorker, mainThread, maxSizeMB, maxWidthOrHeight } = this.state
    return (
      <Container>
        <Row>
        <Col md={{ span: 6, offset: 3 }}>

        <div>
        
 
          <label htmlFor="web-worker">
            
          <p className='text-center'><h1 className='mt-4'>Image File Compressor</h1>  </p>
            {webWorker.progress && <span>{webWorker.progress} %</span>}
            
            <Form id="web-worker"
              type="file"
              accept="image/*"
              onChange={e => this.compressImage(e, true)}>
            <Form.Group> <Form.File id="exampleFormControlFile1" label="Example file input" />
              </Form.Group>
              
              </Form>
          
          </label>
          <p>
            {webWorker.inputSize && (
              <span> <b>Source image size:</b> <Badge variant="primary">{' '}{webWorker.inputSize} mb </Badge></span>
            )}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            {webWorker.outputSize && (
              <span><b> Output image size: </b> <Badge variant="primary">{webWorker.outputSize} mb</Badge> </span>
            )}
          </p>
        </div>
       
        {(mainThread.inputUrl || webWorker.inputUrl) && (
          <table>
            <thead>
            <tr>
              <td>  <Alert  variant= 'primary'>input preview </Alert></td>
              <td><Alert  variant= 'danger'>output preview </Alert></td>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td> <Card.Img variant="bottom" src={mainThread.inputUrl || webWorker.inputUrl} /></td>
            <td> <Card.Img variant="bottom" src={mainThread.outputUrl || webWorker.outputUrl}/></td>
          
             
            </tr>
            </tbody>
          </table>
        )}
        </Col>

      </Row>

  </Container>
    )
  }
};
