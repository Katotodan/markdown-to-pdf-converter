const pdfMock = Buffer.from('fake-pdf-content');

const pageMock = {
  setContent: jest.fn(),
  pdf: jest.fn(() => Promise.resolve(pdfMock)),
};

const browserMock = {
  newPage: jest.fn(() => Promise.resolve(pageMock)),
  close: jest.fn(),
};

export default {
  launch: jest.fn(() => Promise.resolve(browserMock)),
};
