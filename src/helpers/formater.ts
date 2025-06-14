import prettier from 'prettier/standalone';
import parserXml from 'prettier-plugin-xml';
import parserBabel from 'prettier/parser-babel';

export const formatJson = (code: string) => {
  return prettier.format(code, {
    parser: 'json',
    plugins: [parserBabel],
    
  });
};

export const formatXml = (code: string) => {
  return prettier.format(code, {
    parser: 'xml',
    plugins: [parserXml],
  });
};
