const PDFDocument = require('pdfkit');
const {pdfkitAddPlaceholder} = require ('node-signpdf/dist/helpers');

module.exports = {
  createPdf(params) {
    return new Promise((resolve) => {
      const requestParams = {
          placeholder: {},
          text: 'Hello world',
          addSignaturePlaceholder: true,
          ...params,
      };
  
      const pdf = new PDFDocument({
          autoFirstPage: true,
          size: 'A4',
          layout: 'portrait',
          bufferPages: true,
      });
      pdf.info.CreationDate = '';
  
      // Add some content to the page
      pdf
          .fillColor('#333')
          .fontSize(25)
          .moveDown()
          .text(requestParams.text);
  
      // Collect the ouput PDF
      // and, when done, resolve with it stored in a Buffer
      const pdfChunks = [];
      pdf.on('data', (data) => {
          pdfChunks.push(data);
      });
      pdf.on('end', () => {
          resolve(Buffer.concat(pdfChunks));
      });
  
      if (requestParams.addSignaturePlaceholder) {
          // Externally (to PDFKit) add the signature placeholder.
          const refs = pdfkitAddPlaceholder({
              pdf,
              reason: 'I am the author',
              ...requestParams.placeholder,
          });
          // Externally end the streams of the created objects.
          // PDFKit doesn't know much about them, so it won't .end() them.
          Object.keys(refs).forEach(key => refs[key].end());
      }
  
      // Also end the PDFDocument stream.
      // See pdf.on('end'... on how it is then converted to Buffer.
      pdf.end();
    })
  }  
}