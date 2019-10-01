const {SignPdf} = require('node-signpdf');
const fs = require('fs');
const {plainAddPlaceholder} = require ('node-signpdf/dist/helpers');

const signPdf = new SignPdf();

const p12Buffer = fs.readFileSync(`${__dirname}/resources/certificate.p12`);
let pdfBuffer = fs.readFileSync(`${__dirname}/resources/pdfkit-sample.pdf`);
pdfBuffer = plainAddPlaceholder({
    pdfBuffer,
    reason: 'I have reviewed it.',
    signatureLength: 1612,
});
const signedPdf = signPdf.sign(pdfBuffer, p12Buffer);
const outputPath = `${__dirname}/output/pdfkit-sample-signed.pdf`;

fs.writeFileSync(outputPath, signedPdf);

console.log('Pdf signed and saved to:', outputPath);