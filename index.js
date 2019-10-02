const {SignPdf} = require('node-signpdf');
const fs = require('fs');
const minimist = require('minimist');
const {plainAddPlaceholder} = require ('node-signpdf/dist/helpers');
const {createPdf} = require('./helpers');
const signPdf = new SignPdf();

async function signPdfSample() {
    //sign PDF sample without passphrase
    //note: read/writes from/to files should be done via ASYNC method
    const p12Buffer = fs.readFileSync(`${__dirname}/resources/certificate.p12`);
    let pdfBuffer = fs.readFileSync(`${__dirname}/resources/pdfkit-sample.pdf`);
    pdfBuffer = plainAddPlaceholder({
        pdfBuffer,
        reason: 'I have reviewed it.',
        signatureLength: 1612,
    });
    const signedPdfBuffer = signPdf.sign(pdfBuffer, p12Buffer);
    const outputPath = `${__dirname}/output/pdfkit-sample-signed.pdf`;

    fs.writeFileSync(outputPath, signedPdfBuffer);

    console.log('Pdf signed and saved to:', outputPath);    
}

async function signPdfWithPassphrase(passphrase) {
    //dynamically generate PDF via PDFKit and sign with passphrase
    //note: read/writes from/to files should be done via ASYNC method
    console.log('passphrase:', passphrase);
    const p12Buffer = fs.readFileSync(`${__dirname}/resources/withpass.p12`);
    let pdfBuffer = await createPdf();

    const signedPdfBuffer = signPdf.sign(
        pdfBuffer,
        p12Buffer,
        {passphrase}
    );    
    const outputPath = `${__dirname}/output/pdfkit-sample-signed-with-passphrase.pdf`;
    fs.writeFileSync(outputPath, signedPdfBuffer);

    console.log('Pdf signed and saved to:', outputPath);
}

async function main() {
    const args = minimist(process.argv.slice(2));
    const passphrase = args.passphrase;

    if(passphrase) {
        await signPdfWithPassphrase(passphrase);        
    }
    else {
        await signPdfSample();
    }
}

main();